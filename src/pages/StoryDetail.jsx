import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockEntities, geminiClient } from '../api/geminiClient';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, MapPin, User, Users, BookOpen, 
  Sparkles, Play, Image as ImageIcon, Loader2, Edit, Wand2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import StoryGeneratorModal from '../components/interview/StoryGeneratorModal';
import StoryBookViewer from '../components/story/StoryBookViewer';
import CachedImage from '../components/story/CachedImage';
import { format } from 'date-fns';

const chapterColors = {
  childhood: 'bg-[#FFE5B4] text-[#8B6914]',
  teen_years: 'bg-[#B4E5FF] text-[#14648B]',
  young_adult: 'bg-[#FFB4D4] text-[#8B1454]',
  career: 'bg-[#B4FFB8] text-[#148B1A]',
  family_life: 'bg-[#E5B4FF] text-[#54148B]',
  retirement: 'bg-[#FFD4B4] text-[#8B4514]',
  other: 'bg-[#E0E0E0] text-[#505050]'
};

export default function StoryDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const storyId = urlParams.get('id');
  const queryClient = useQueryClient();
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [showBookViewer, setShowBookViewer] = useState(null);

  const { data: story, isLoading: loadingStory } = useQuery({
    queryKey: ['story', storyId],
    queryFn: () => mockEntities.Story.filter({ id: storyId }),
    enabled: !!storyId,
    select: (data) => data[0]
  });

  const { data: seniors = [] } = useQuery({
    queryKey: ['seniors'],
    queryFn: () => mockEntities.Senior.list()
  });

  const senior = seniors.find(s => s.id === story?.senior_id);

  const updateStoryMutation = useMutation({
    mutationFn: (data) => mockEntities.Story.update(storyId, data),
    onSuccess: async () => {
      console.log('✅ Story updated, invalidating queries...');
      await queryClient.invalidateQueries({ queryKey: ['story', storyId] });
      await queryClient.refetchQueries({ queryKey: ['story', storyId] });
      console.log('🔄 Story data refreshed');
    },
    onError: (error) => {
      console.error('❌ Failed to update story:', error);
      alert('Failed to save story: ' + error.message);
    }
  });

  const handleStoryBookComplete = async (data) => {
    console.log('📚 Saving story book format...');
    console.log('Data received:', data);
    
    const existingFormats = story.story_formats || [];
    
    // CRITICAL: Strip URLs to save localStorage space
    // Images are ALREADY in IndexedDB permanently - we just need the IDs!
    const stripUrls = (obj) => {
      if (!obj) return null;
      const { url, ...rest } = obj; // Remove url field - it's in IndexedDB!
      return rest;
    };
    
    const newFormat = {
      format_type: data.format_type,
      format_name: data.format_name,
      title: data.title,
      scenes: data.scenes?.map(scene => ({
        ...scene,
        image: scene.image ? stripUrls(scene.image) : null
      })) || [],
      slides: data.slides?.map(slide => ({
        ...slide,
        image: slide.image ? stripUrls(slide.image) : null
      })) || data.scenes?.map(scene => ({
        ...scene,
        image: scene.image ? stripUrls(scene.image) : null
      })) || [],
      images: data.images?.map(stripUrls) || [],
      scene_count: data.scene_count || data.scenes?.length || 0,
      image_count: data.image_count || data.images?.length || 0,
      created_date: data.created_date || new Date().toISOString(),
      original_story_id: data.original_story_id,
      senior_name: data.senior_name,
      full_content: data.full_content,
      year_approximate: data.year_approximate,
      location: data.location
    };
    
    // Verify URLs are stripped
    const hasUrls = JSON.stringify(newFormat).includes('data:image');
    console.log('✅ Format prepared:', {
      type: newFormat.format_type,
      scenes: newFormat.scenes?.length,
      images: newFormat.images?.length,
      hasUrls: hasUrls,  // Should be FALSE
      imageIds: newFormat.images?.map(img => img.id),
      size: `${(JSON.stringify(newFormat).length / 1024).toFixed(2)} KB`
    });
    
    if (hasUrls) {
      console.error('❌ URLS STILL PRESENT! This will cause quota errors!');
      alert('Error: Images not properly cached. Please try again.');
      return;
    }
    
    try {
      await updateStoryMutation.mutateAsync({
        story_formats: [...existingFormats, newFormat]
      });
      console.log('💾 Story format saved successfully! Images load from IndexedDB.');
      setShowGeneratorModal(false);
    } catch (error) {
      console.error('❌ Error saving story format:', error);
      alert('Failed to save: ' + error.message + '. Try deleting old storybooks.');
    }
  };

  if (loadingStory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C4785A] animate-spin" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="font-serif text-2xl text-[#3D3D3D] mb-4">Story not found</h1>
        <Link to={createPageUrl('Stories')}>
          <Button className="bg-[#C4785A] hover:bg-[#A86045]">
            Back to Stories
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link 
        to={createPageUrl('Stories')} 
        className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#C4785A] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Stories
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-[#E8DFD5] overflow-hidden"
      >
        {/* Hero Image - Use CachedImage if we have an ID */}
        {story.generated_images?.[0]?.id ? (
          <div className="aspect-video bg-[#F5EDE6] overflow-hidden">
            <CachedImage
              imageId={story.generated_images[0].id}
              alt={story.title}
              className="w-full h-full object-cover"
              fallbackSrc={story.generated_images[0].url}
            />
          </div>
        ) : story.generated_images?.[0]?.url ? (
          <div className="aspect-video bg-[#F5EDE6] overflow-hidden">
            <img
              src={story.generated_images[0].url}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}

        <div className="p-6 md:p-10">
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`text-sm px-3 py-1 rounded-full ${chapterColors[story.life_chapter] || chapterColors.other}`}>
              {story.life_chapter?.replace('_', ' ') || 'Memory'}
            </span>
            <Badge variant="outline" className="border-[#E8DFD5] text-[#6B6B6B]">
              {story.status}
            </Badge>
            {story.story_formats?.map((format, idx) => (
              <Button
                key={idx}
                onClick={() => setShowBookViewer(format.format_type)}
                variant="outline"
                className="border-[#C4785A] text-[#C4785A] hover:bg-[#C4785A] hover:text-white rounded-full"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Read {format.format_type === 'storybook' ? 'Storybook' : 
                      format.format_type === 'comic' ? 'Comic' :
                      format.format_type === 'novel' ? 'Novel' :
                      format.format_type === 'memoir' ? 'Memoir' :
                      format.format_type === 'slideshow' ? 'Slideshow' : 'Timeline'}
              </Button>
            ))}
            <Button
              onClick={() => setShowGeneratorModal(true)}
              className="bg-gradient-to-r from-[#C4785A] to-[#E8A98A] hover:from-[#A86045] hover:to-[#D4896A] text-white rounded-full"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Create Story Book
            </Button>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl text-[#3D3D3D] mb-4 leading-tight">
            {story.title}
          </h1>

          {/* Senior & Meta */}
          <div className="flex flex-wrap items-center gap-4 text-[#6B6B6B] mb-6 pb-6 border-b border-[#E8DFD5]">
            {senior && (
              <Link 
                to={createPageUrl(`SeniorProfile?id=${senior.id}`)}
                className="flex items-center gap-2 hover:text-[#C4785A] transition-colors"
              >
                {senior.photo_url ? (
                  <img src={senior.photo_url} alt={senior.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#F5EDE6] flex items-center justify-center">
                    <User className="w-4 h-4 text-[#C4785A]" />
                  </div>
                )}
                <span>{senior.nickname || senior.name}</span>
              </Link>
            )}
            {story.year_approximate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                ~{story.year_approximate}
              </span>
            )}
            {story.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {story.location}
              </span>
            )}
          </div>

          {/* Summary */}
          {story.summary && (
            <div className="bg-[#F5EDE6] rounded-xl p-5 mb-6">
              <p className="text-[#3D3D3D] italic text-lg leading-relaxed">
                "{story.summary}"
              </p>
            </div>
          )}

          {/* Full Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-[#3D3D3D] leading-relaxed whitespace-pre-wrap">
              {story.full_content}
            </p>
          </div>

          {/* AI Context */}
          {story.ai_context && (
            <div className="bg-gradient-to-br from-[#8FAE8B]/10 to-[#B8D4B4]/10 rounded-xl p-5 mb-8 border border-[#8FAE8B]/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#8FAE8B]" />
                <h3 className="font-medium text-[#3D3D3D]">Historical Context</h3>
              </div>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">
                {story.ai_context}
              </p>
            </div>
          )}

          {/* People Mentioned */}
          {story.people_mentioned?.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-[#C4785A]" />
                <h3 className="font-medium text-[#3D3D3D]">People in this Story</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {story.people_mentioned.map((person, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#F5EDE6] text-[#6B6B6B] rounded-full text-sm">
                    {person}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Themes */}
          {story.themes?.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-[#C4785A]" />
                <h3 className="font-medium text-[#3D3D3D]">Themes</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {story.themes.map((theme, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#C4785A]/10 text-[#C4785A] rounded-full text-sm">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Generated Images Gallery - Use CachedImage */}
          {story.generated_images?.length > 1 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-[#C4785A]" />
                <h3 className="font-medium text-[#3D3D3D]">Story Illustrations</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {story.generated_images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="aspect-square rounded-xl overflow-hidden bg-[#F5EDE6]"
                  >
                    {img.id ? (
                      <CachedImage
                        imageId={img.id}
                        alt={`Illustration ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        fallbackSrc={img.url}
                      />
                    ) : img.url ? (
                      <img 
                        src={img.url} 
                        alt={`Illustration ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : null}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Family Notes */}
          {story.family_notes && (
            <div className="bg-[#FFE5B4]/20 rounded-xl p-5 border border-[#FFE5B4]/40">
              <div className="flex items-center gap-2 mb-3">
                <Edit className="w-5 h-5 text-[#8B6914]" />
                <h3 className="font-medium text-[#3D3D3D]">Family Notes</h3>
              </div>
              <p className="text-[#6B6B6B] text-sm">
                {story.family_notes}
              </p>
            </div>
          )}
        </div>
      </motion.article>

      {/* Story Generator Modal */}
      <StoryGeneratorModal
        isOpen={showGeneratorModal}
        onClose={() => setShowGeneratorModal(false)}
        story={story}
        senior={senior}
        onComplete={handleStoryBookComplete}
      />

      {/* Story Book Viewer */}
      {showBookViewer && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl">
            <StoryBookViewer 
              storyFormat={story.story_formats?.find(f => f.format_type === showBookViewer)}
              storyTitle={story.title}
              storyYear={story.year_approximate}
              storyLocation={story.location}
              themes={story.themes}
              storyContent={story.full_content}
              onClose={() => setShowBookViewer(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}