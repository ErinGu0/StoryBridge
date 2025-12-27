import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Image, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { geminiClient } from '../../api/geminiClient';
import StoryFormatSelector, { storyFormats } from './StoryFormatSelector';

export default function StoryGeneratorModal({ 
  isOpen, 
  onClose, 
  story,
  senior,
  onComplete 
}) {
  const [step, setStep] = useState('format');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [error, setError] = useState(null);

  const formatConfig = storyFormats.find(f => f.id === selectedFormat);

  const generateStory = async () => {
    if (!selectedFormat || !story) return;
    
    setStep('generating');
    setProgress(10);
    setError(null);

    try {
      console.log('=== STARTING STORY GENERATION ===');
      console.log('Selected format:', selectedFormat);
      console.log('Story data:', story);

      const contentPrompt = `You are creating a ${formatConfig.name} from a personal story.

STORY:
${story.full_content || story.raw_transcript || story.content || 'A memory about enjoying sushi'}

YOUR TASK:
Create 6 scenes for this story in ${formatConfig.name} format.

YOU MUST RESPOND WITH ONLY THIS EXACT JSON STRUCTURE (no other text):
{
  "title": "A title for the story",
  "scenes": [
    {
      "scene_number": 1,
      "text": "The text or dialogue for this scene (2-3 sentences)",
      "image_prompt": "A detailed description of what to draw for this scene"
    },
    {
      "scene_number": 2,
      "text": "The text or dialogue for scene 2",
      "image_prompt": "Description for scene 2"
    }
  ]
}

IMPORTANT RULES:
- Create exactly 6 scenes
- Each scene needs scene_number, text, and image_prompt
- Keep text to 2-3 sentences per scene
- Make image_prompt descriptive and visual
${selectedFormat === 'comic' ? '- For comics, use dialogue-style text like "Wow, this sushi is amazing!"' : ''}
${selectedFormat === 'storybook' ? '- For storybook, use simple, warm language suitable for children' : ''}

RESPOND WITH ONLY THE JSON. NO MARKDOWN. NO EXPLANATION. JUST THE JSON.`;

      console.log('📤 Sending generation request...');
      
      const contentResponse = await geminiClient.generateText(contentPrompt, true);

      console.log('📥 Response received');
      console.log('Response type:', typeof contentResponse);
      console.log('Response:', contentResponse);

      if (contentResponse?.error) {
        console.error('❌ API returned error:', contentResponse.message);
        throw new Error(contentResponse.message || 'API call failed');
      }

      if (!contentResponse || typeof contentResponse !== 'object') {
        console.error('❌ Invalid response type:', typeof contentResponse);
        throw new Error('API did not return a valid response object');
      }

      if (!contentResponse.scenes) {
        console.error('❌ Response missing scenes array');
        console.error('Available keys:', Object.keys(contentResponse));
        throw new Error('API response is missing the scenes array. Please try again.');
      }

      if (!Array.isArray(contentResponse.scenes)) {
        console.error('❌ scenes is not an array:', typeof contentResponse.scenes);
        throw new Error('API response scenes is not an array');
      }

      if (contentResponse.scenes.length === 0) {
        console.error('❌ scenes array is empty');
        throw new Error('API returned no scenes. Please try again.');
      }

      console.log('✅ Valid response with', contentResponse.scenes.length, 'scenes');
      console.log('First scene:', contentResponse.scenes[0]);

      setProgress(30);
      setGeneratedContent(contentResponse);

      // Generate images for scenes
      const scenes = contentResponse.scenes;
      const images = [];
const numImagesToGenerate = scenes.length;
      console.log(`🖼️ Generating ${numImagesToGenerate} images...`);
      if (senior?.physical_description) {
        console.log(`👤 Using senior's appearance: ${senior.physical_description}`);
      }

      for (let i = 0; i < numImagesToGenerate; i++) {
        const progressPercent = 30 + (i + 1) * (60 / numImagesToGenerate);
        setProgress(progressPercent);
        
        const scene = scenes[i];
        
        const characterDescription = senior?.physical_description 
          ? `Character appearance: ${senior.physical_description}.` 
          : '';
        
        const imagePrompt = `${formatConfig.imageStyle}. ${characterDescription} ${scene.image_prompt || 'A warm nostalgic scene'}. Time period: ${story.year_approximate || '1950s'}. Location: ${story.location || 'unspecified'}.`;

        console.log(`📸 Generating image ${i + 1}/${numImagesToGenerate}`);
        console.log(`🎨 Prompt: ${imagePrompt}`);

        try {
          // CRITICAL: Pass imageId for permanent caching in IndexedDB
          const imageId = `${story.id}-${selectedFormat}-scene${i + 1}`;
          
          const imageResult = await geminiClient.GenerateImage({
            prompt: imagePrompt,
            imageId: imageId  // This makes the image permanent!
          });

          console.log(`📥 Image API response received for image ${i + 1}`);
          console.log('Image result:', imageResult);

          if (imageResult?.url) {
            images.push({
              id: imageResult.id,  // Store the ID for later retrieval
              url: imageResult.url,
              prompt: imagePrompt,
              mimeType: imageResult.mimeType,
              generated: true,
              scene_number: scene.scene_number || i + 1
            });
            setGeneratedImages([...images]);
            console.log(`✅ Image ${i + 1} cached in IndexedDB with ID: ${imageResult.id}`);
          } else {
            console.warn(`⚠️ Image ${i + 1} returned no URL`);
          }
        } catch (imgError) {
          console.error(`❌ Image ${i + 1} failed:`, imgError);
          console.error('Error details:', imgError.message);
        }
      }

      console.log('✅ Generation complete!');
      console.log('Total images generated:', images.length);

      setGeneratedImages(images);
      setProgress(100);
      setStep('complete');

    } catch (err) {
      console.error('=== GENERATION FAILED ===');
      console.error('Error:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      
      let errorMessage = err.message || 'Story generation failed';
      
      if (errorMessage.includes('parse')) {
        errorMessage = 'The AI response could not be understood. Please try generating again.';
      } else if (errorMessage.includes('API call failed')) {
        errorMessage = 'Could not connect to AI service. Please check your internet connection and try again.';
      } else if (errorMessage.includes('missing')) {
        errorMessage = 'The AI did not generate the story correctly. Please try again.';
      }
      
      setError(errorMessage);
      setProgress(0);
      setStep('format');
    }
  };

  const handleComplete = () => {
    console.log('💾 Saving completed story...');
    console.log('Generated images count:', generatedImages.length);
    console.log('Generated images:', generatedImages);

    const normalizedScenes = (generatedContent?.scenes || []).map((scene, idx) => {
      const matchingImage = generatedImages.find(
        img => img.scene_number === scene.scene_number || img.scene_number === idx + 1
      );

      return {
        id: `scene-${idx}`,
        scene_number: scene.scene_number || idx + 1,
        title: scene.title || `Scene ${idx + 1}`,
        text: scene.text || scene.content || '',
        content: scene.text || scene.content || '',
        image_prompt: scene.image_prompt || '',
        imagePrompt: scene.image_prompt || '',
        
        // Store image with ID for IndexedDB retrieval
        image: matchingImage ? {
          id: matchingImage.id,  // This is the key - the ID for IndexedDB lookup
          url: matchingImage.url,  // Temporary - will be stripped before localStorage
          prompt: matchingImage.prompt,
          mimeType: matchingImage.mimeType,
          generated: matchingImage.generated
        } : (scene.image_prompt ? {
          prompt: scene.image_prompt,
          generated: false
        } : null)
      };
    });

    const completedStory = {
      id: Date.now().toString(),
      created_date: new Date().toISOString(),
      
      format_type: selectedFormat,
      format_name: formatConfig?.name,
      
      title: generatedContent?.title || story.title,
      senior_name: story.senior_name || story.senior?.name,
      original_story_id: story.id,
      
      scenes: normalizedScenes,
      slides: normalizedScenes,
      
      // Images with IDs - URLs will be stripped by optimizeStoryForStorage
      images: generatedImages.map(img => ({
        id: img.id,  // The permanent ID
        url: img.url,  // Will be removed before localStorage
        prompt: img.prompt,
        mimeType: img.mimeType,
        generated: img.generated,
        scene_number: img.scene_number
      })),
      
      scene_count: normalizedScenes.length,
      image_count: generatedImages.length,
      
      full_content: story.full_content || story.raw_transcript || story.content,
      year_approximate: story.year_approximate,
      location: story.location
    };

    console.log('✅ Story data normalized and ready to save');
    console.log('Structure:', {
      id: completedStory.id,
      hasScenes: !!completedStory.scenes,
      sceneCount: completedStory.scenes?.length,
      imageCount: completedStory.images?.length,
      imageIds: completedStory.images?.map(img => img.id)
    });

    onComplete(completedStory);
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep('format');
    setSelectedFormat('');
    setProgress(0);
    setGeneratedImages([]);
    setGeneratedContent(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-2xl">
            <Sparkles className="w-6 h-6 text-[#C4785A]" />
            Create Story Book
          </DialogTitle>
        </DialogHeader>

        {step === 'format' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-[#F5EDE6] rounded-xl p-4">
              <h4 className="font-medium text-[#3D3D3D]">{story?.title || 'Untitled Story'}</h4>
              <p className="text-sm text-[#6B6B6B] mt-1 line-clamp-2">
                {story?.summary || story?.full_content?.substring(0, 150) || story?.content?.substring(0, 150) || 'No preview available'}
              </p>
            </div>

            <StoryFormatSelector 
              selectedFormat={selectedFormat}
              onSelectFormat={setSelectedFormat}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-1">Story Generation Failed</p>
                  <p className="text-sm">{error}</p>
                  <p className="text-xs mt-2 text-red-600">
                    Tip: Try selecting a different format or rephrasing your story content.
                  </p>
                </div>
              </motion.div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={resetAndClose}
                variant="outline"
                className="flex-1 border-[#E8DFD5]"
              >
                Cancel
              </Button>
              <Button
                onClick={generateStory}
                disabled={!selectedFormat}
                className="flex-1 bg-[#C4785A] hover:bg-[#A86045] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Story
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'generating' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C4785A] to-[#E8A98A] flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            
            <h3 className="font-serif text-xl text-[#3D3D3D] mb-2">
              Creating Your {formatConfig?.name}
            </h3>
            <p className="text-[#6B6B6B] mb-6">
              {progress < 30 ? 'Formatting the story with AI...' : 
               progress < 90 ? `Creating illustration ${generatedImages.length + 1}...` :
               'Finishing up...'}
            </p>

            <Progress value={progress} className="h-2 max-w-xs mx-auto" />
            <p className="text-sm text-[#6B6B6B] mt-2">{Math.round(progress)}%</p>

            {generatedImages.length > 0 && (
              <div className="flex justify-center gap-2 mt-6 flex-wrap">
                {generatedImages.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-16 h-16 rounded-lg overflow-hidden border-2 border-[#E8DFD5] shadow-sm"
                  >
                    <img src={img.url} alt={`Scene ${idx + 1}`} className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#8FAE8B] flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-serif text-xl text-[#3D3D3D]">
                Your {formatConfig?.name} is Ready!
              </h3>
              <p className="text-[#6B6B6B] mt-1">
                {generatedContent?.scenes?.length || 0} scenes · {generatedImages.length} illustrations
              </p>
            </div>

            {generatedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {generatedImages.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="aspect-square rounded-xl overflow-hidden border-2 border-[#E8DFD5] shadow-sm"
                  >
                    <img 
                      src={img.url} 
                      alt={`Scene ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {generatedContent?.scenes && generatedContent.scenes.length > 0 && (
              <div className="bg-[#F5EDE6] rounded-xl p-4 max-h-48 overflow-y-auto">
                <h4 className="font-medium text-[#3D3D3D] mb-3">Story Preview</h4>
                <div className="space-y-3">
                  {generatedContent.scenes.slice(0, 3).map((scene, idx) => (
                    <div key={idx} className="border-l-2 border-[#C4785A] pl-3">
                      <p className="text-xs font-medium text-[#6B6B6B]">
                        Scene {scene.scene_number || idx + 1}
                      </p>
                      <p className="text-sm text-[#3D3D3D] mt-1">
                        {scene.text?.substring(0, 120)}{scene.text?.length > 120 ? '...' : ''}
                      </p>
                    </div>
                  ))}
                </div>
                {generatedContent.scenes.length > 3 && (
                  <p className="text-xs text-[#6B6B6B] mt-3 text-center">
                    + {generatedContent.scenes.length - 3} more scenes
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setStep('format');
                  setError(null);
                  setProgress(0);
                }}
                variant="outline"
                className="flex-1 border-[#E8DFD5]"
              >
                Try Different Format
              </Button>
              <Button
                onClick={handleComplete}
                className="flex-1 bg-[#C4785A] hover:bg-[#A86045] text-white"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Save Story Book
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}