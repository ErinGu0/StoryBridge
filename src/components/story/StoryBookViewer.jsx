import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '../ui/button';
import CachedImage from './CachedImage';

export default function StoryBookViewer({ storyFormat, storyTitle, storyYear, storyLocation, themes, storyContent, onClose }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('📖 StoryBookViewer mounted with data:');
    console.log('storyFormat:', storyFormat);
    console.log('storyTitle:', storyTitle);
    console.log('Has scenes?', !!storyFormat?.scenes);
    console.log('Has slides?', !!storyFormat?.slides);
    console.log('Has images?', !!storyFormat?.images);
    console.log('Scenes length:', storyFormat?.scenes?.length || 0);
  }, [storyFormat, storyTitle]);

  if (!storyFormat) {
    console.warn('⚠️ StoryBookViewer: No storyFormat provided');
    return null;
  }

  const formatType = storyFormat.format_type;
  const formattedText = storyFormat.formatted_content || '';
  
  // Try multiple property names for compatibility
  const scenes = storyFormat.scenes || storyFormat.slides || storyFormat.content || [];
  const images = storyFormat.images || [];

  console.log('📊 Viewer data extracted:', {
    formatType,
    scenesCount: scenes.length,
    imagesCount: images.length,
    firstScene: scenes[0],
    firstImage: images[0]
  });

  // Parse content into pages
  const parseContent = () => {
    const pages = [];
    
    console.log('🔄 Parsing content into pages...');
    
    // Cover page
    pages.push({
      type: 'cover',
      title: storyTitle || storyFormat.title || 'Untitled Story',
      imageData: images[0] || null,
      subtitle: storyLocation ? `${storyLocation}, ${storyYear || ''}` : '',
      formatType
    });

    // Use scenes if available
    if (scenes && scenes.length > 0) {
      console.log(`✅ Using ${scenes.length} scenes for pages`);
      
      scenes.forEach((scene, idx) => {
        // Get image data object (not just URL)
        let imageData = scene.image || images[idx];
        
        // Fallback: if no image data but we have an image_prompt, create minimal image data
        if (!imageData && scene.image_prompt) {
          imageData = {
            prompt: scene.image_prompt,
            generated: false
          };
        }
        
        const sceneText = scene.text || scene.content || '';
        
        console.log(`Page ${idx + 1}:`, {
          hasText: !!sceneText,
          textLength: sceneText.length,
          hasImageData: !!imageData,
          imageId: imageData?.id,
          imageHasUrl: !!imageData?.url,
          sceneNumber: scene.scene_number
        });
        
        if (formatType === 'comic') {
          pages.push({
            type: 'comic-panel',
            text: sceneText,
            imageData: imageData,
            panelNumber: scene.scene_number || (idx + 1)
          });
        } else {
          pages.push({
            type: 'storybook-page',
            text: sceneText,
            imageData: imageData,
            pageNumber: scene.scene_number || (idx + 1)
          });
        }
      });
    } else if (images.length > 1 && storyContent) {
      console.log('⚠️ No scenes found, using fallback content splitting');
      
      for (let i = 0; i < Math.min(images.length, 6); i++) {
        const text = storyContent.substring(i * 200, (i + 1) * 200);
        const imageData = images[i] || null;
        
        pages.push({
          type: 'content-page',
          text: text,
          imageData: imageData,
          pageNumber: i + 1
        });
      }
    } else {
      console.warn('⚠️ No scenes or content available to display');
    }

    // End page
    pages.push({
      type: 'end',
      title: 'The End',
      subtitle: `A story from ${storyYear || 'the past'}`,
      themes: themes || []
    });

    console.log(`✅ Total pages created: ${pages.length}`);
    return pages;
  };

  const pages = parseContent();
  const totalPages = pages.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  const currentPageData = pages[currentPage];

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50 bg-[#2D2319]' : 'bg-[#2D2319] rounded-2xl overflow-hidden'}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20">
        <div className="flex items-center gap-2 text-white/80">
          <BookOpen className="w-5 h-5" />
          <span className="text-sm font-medium">{storyTitle || storyFormat.title || 'Story'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Book Content */}
      <div className={`relative ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[500px]'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center p-4"
          >
            {/* Book Page Container */}
            <div className="w-full max-w-4xl h-full bg-[#FDF8F3] rounded-lg shadow-2xl overflow-hidden">
              
              {/* Cover Page */}
              {currentPageData.type === 'cover' && (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#C4785A] to-[#8B5A3C]">
                  {currentPageData.imageData?.id ? (
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/30 shadow-xl mb-6">
                      <CachedImage
                        imageId={currentPageData.imageData.id}
                        alt="Cover"
                        className="w-full h-full object-cover"
                        fallbackSrc={currentPageData.imageData.url}
                      />
                    </div>
                  ) : currentPageData.imageData?.url && (
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/30 shadow-xl mb-6">
                      <img
                        src={currentPageData.imageData.url}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h1 className="font-serif text-3xl text-white mb-3">
                    {currentPageData.title}
                  </h1>
                  {currentPageData.subtitle && (
                    <p className="text-white/80 text-lg">{currentPageData.subtitle}</p>
                  )}
                  <p className="text-white/60 text-sm mt-4">
                    {scenes.length} scenes · {images.length} illustrations
                  </p>
                </div>
              )}

              {/* Comic Panel */}
              {currentPageData.type === 'comic-panel' && (
                <div className="w-full h-full bg-white flex flex-col items-center justify-center p-4">
                  <div className="relative w-full h-5/6 max-w-2xl border-8 border-black rounded-lg overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    {currentPageData.imageData?.id ? (
                      <CachedImage
                        imageId={currentPageData.imageData.id}
                        alt={`Panel ${currentPageData.panelNumber}`}
                        className="w-full h-full object-contain bg-gradient-to-br from-yellow-50 to-orange-50"
                        fallbackSrc={currentPageData.imageData.url}
                      />
                    ) : currentPageData.imageData?.url ? (
                      <img
                        src={currentPageData.imageData.url}
                        alt={`Panel ${currentPageData.panelNumber}`}
                        className="w-full h-full object-contain bg-gradient-to-br from-yellow-50 to-orange-50"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                  </div>
                  
                  {/* Comic text bubble */}
                  {currentPageData.text && (
                    <div className="mt-4 max-w-2xl">
                      <div className="bg-white border-4 border-black rounded-xl p-4 shadow-lg relative">
                        <div className="absolute -top-3 left-8 w-6 h-6 bg-white border-l-4 border-t-4 border-black transform rotate-45"></div>
                        <p className="font-bold text-center text-lg">
                          {currentPageData.text}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Storybook Page */}
              {currentPageData.type === 'storybook-page' && (
                <div className="w-full h-full flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="w-full md:w-3/5 h-64 md:h-full bg-gradient-to-br from-[#FFE5B4] to-[#FFD4A5] p-6 flex items-center justify-center">
                    {currentPageData.imageData?.id ? (
                      <CachedImage
                        imageId={currentPageData.imageData.id}
                        alt={`Page ${currentPageData.pageNumber}`}
                        className="w-full h-full object-contain rounded-lg shadow-lg"
                        fallbackSrc={currentPageData.imageData.url}
                      />
                    ) : currentPageData.imageData?.url ? (
                      <img
                        src={currentPageData.imageData.url}
                        alt={`Page ${currentPageData.pageNumber}`}
                        className="w-full h-full object-contain rounded-lg shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-lg bg-white/30">
                        <BookOpen className="w-16 h-16 text-white/40" />
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 p-6 flex flex-col justify-center bg-[#FFFEF9] overflow-y-auto">
                    <div className="relative">
                      <div className="absolute -left-3 top-0 text-5xl text-[#C4785A]/20 font-serif">"</div>
                      <p className="font-serif text-base text-[#3D3D3D] leading-relaxed tracking-wide">
                        {currentPageData.text || 'No text available for this scene.'}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C4785A]/30 to-transparent" />
                      <span className="px-3 text-xs text-[#A0A0A0] font-serif italic">{currentPageData.pageNumber}</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C4785A]/30 to-transparent" />
                    </div>
                  </div>
                </div>
              )}

              {/* Generic Content Page */}
              {currentPageData.type === 'content-page' && (
                <div className="w-full h-full flex flex-col md:flex-row">
                  {currentPageData.imageData?.id ? (
                    <div className="w-full md:w-1/2 h-48 md:h-full bg-[#E8DFD5]">
                      <CachedImage
                        imageId={currentPageData.imageData.id}
                        alt={`Page ${currentPageData.pageNumber}`}
                        className="w-full h-full object-cover"
                        fallbackSrc={currentPageData.imageData.url}
                      />
                    </div>
                  ) : currentPageData.imageData?.url && (
                    <div className="w-full md:w-1/2 h-48 md:h-full bg-[#E8DFD5]">
                      <img
                        src={currentPageData.imageData.url}
                        alt={`Page ${currentPageData.pageNumber}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className={`flex-1 p-6 flex flex-col justify-center overflow-y-auto ${!currentPageData.imageData ? 'w-full' : ''}`}>
                    <p className="text-lg text-[#3D3D3D] leading-relaxed whitespace-pre-wrap">
                      {currentPageData.text}
                    </p>
                    <div className="mt-auto pt-4 text-right">
                      <span className="text-sm text-[#A0A0A0]">{currentPageData.pageNumber}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* End Page */}
              {currentPageData.type === 'end' && (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#8FAE8B] to-[#6B8B68]">
                  <h2 className="font-serif text-4xl text-white mb-4">
                    {currentPageData.title}
                  </h2>
                  <p className="text-white/80 text-lg mb-8">{currentPageData.subtitle}</p>
                  {currentPageData.themes?.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2">
                      {currentPageData.themes.map((theme, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-white/20 text-white rounded-full text-sm"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-all z-10 ${
            currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:scale-110'
          }`}
        >
          <ChevronLeft className="w-5 h-5 text-[#3D3D3D]" />
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-all z-10 ${
            currentPage === totalPages - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:scale-110'
          }`}
        >
          <ChevronRight className="w-5 h-5 text-[#3D3D3D]" />
        </button>
      </div>

      {/* Footer - Page Indicator */}
      <div className="flex items-center justify-center gap-2 p-4 bg-black/20">
        <span className="text-white/60 text-xs mr-3">
          {currentPage + 1} / {totalPages}
        </span>
        {pages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentPage ? 'w-6 bg-white' : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to page ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}