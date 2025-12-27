import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Sparkles, Loader2, Edit, Check, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { geminiClient } from '../../api/geminiClient';

export default function ImageGenerator({ onImageGenerated, contextHint }) {
  const [generating, setGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);

  const generateImage = async (prompt) => {
    setGenerating(true);
    
    const styledPrompt = `Warm, nostalgic watercolor illustration in soft muted colors: ${prompt}. Style: gentle, abstract, impressionistic, not photorealistic. Suitable for a family memory book.`;
    
    const result = await geminiClient.GenerateImage({
      prompt: styledPrompt
    });

    if (result?.url) {
      const newImage = {
        url: result.url,
        prompt: prompt,
        timestamp: new Date().toISOString()
      };
      setGeneratedImages(prev => [...prev, newImage]);
      onImageGenerated(newImage);
    }
    
    setGenerating(false);
    setShowCustom(false);
    setCustomPrompt('');
  };

  return (
    <div className="bg-gradient-to-br from-[#D4A5A5]/10 to-[#E8C4C4]/10 rounded-2xl border border-[#D4A5A5]/20 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#D4A5A5] flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-medium text-[#3D3D3D]">Create Memory Image</h3>
        </div>
      </div>

      <p className="text-sm text-[#6B6B6B] mb-4">
        Create an illustrated image based on what they're describing. Images are styled as gentle watercolor illustrations.
      </p>

      <AnimatePresence mode="wait">
        {showCustom ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <Input
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe the scene clearly (e.g., 'A wooden schoolhouse with a big gate in Bangkok, 1950s')"
              className="border-[#E8DFD5] focus:border-[#D4A5A5] focus:ring-[#D4A5A5]"
            />
            <p className="text-xs text-[#6B6B6B]">
              💡 Be specific: include location, time period, key details. This helps the AI create accurate illustrations.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => generateImage(customPrompt)}
                disabled={generating || !customPrompt.trim()}
                className="flex-1 bg-[#D4A5A5] hover:bg-[#C49595] text-white"
              >
                {generating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Generate
              </Button>
              <Button
                onClick={() => setShowCustom(false)}
                variant="outline"
                className="border-[#E8DFD5]"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              onClick={() => setShowCustom(true)}
              disabled={generating}
              className="w-full bg-[#D4A5A5] hover:bg-[#C49595] text-white"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating illustration...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Describe a Scene to Illustrate
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {generatedImages.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#E8DFD5]">
          <p className="text-sm font-medium text-[#3D3D3D] mb-2">Generated this session:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {generatedImages.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
              >
                <img src={img.url} alt={`Generated ${idx + 1}`} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}