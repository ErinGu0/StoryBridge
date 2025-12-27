import React, { useState, useEffect } from 'react';
import { geminiClient } from '../api/geminiClient';
import { Loader2 } from 'lucide-react';

/**
 * Smart Image component that handles both:
 * 1. Images with URLs (display immediately)
 * 2. Images with only prompts (regenerate once per session, cache in sessionStorage)
 * 
 * This prevents storing massive base64 images in localStorage
 * while keeping images consistent during your browsing session
 */
export default function SmartImage({ imageData, alt, className, ...props }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadImage() {
      console.log('🖼️ SmartImage loading:', {
        hasImageData: !!imageData,
        hasUrl: !!imageData?.url,
        hasPrompt: !!imageData?.prompt,
        imageData: imageData
      });

      // If imageData already has a URL, use it immediately
      if (imageData?.url) {
        console.log('✅ Using existing URL');
        setImageUrl(imageData.url);
        return;
      }

      // If imageData has a prompt but no URL, check sessionStorage cache first
      if (imageData?.prompt && !imageData?.url) {
        const cacheKey = `img_${btoa(imageData.prompt).substring(0, 50)}`;
        
        // Check if we already generated this image in this session
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          console.log('✅ Using cached image from session');
          setImageUrl(cached);
          return;
        }
        
        // Not cached, need to regenerate
        setIsLoading(true);
        setError(null);
        
        try {
          console.log('🔄 Regenerating image from prompt:', imageData.prompt);
          const regenerated = await geminiClient.regenerateImage(imageData);
          console.log('✅ Regeneration complete:', regenerated);
          
          // Cache in sessionStorage for consistency during this session
          if (regenerated.url) {
            try {
              sessionStorage.setItem(cacheKey, regenerated.url);
              console.log('💾 Cached image in session');
            } catch (storageError) {
              console.warn('⚠️ Could not cache in sessionStorage:', storageError);
              // Continue anyway - just won't be cached
            }
          }
          
          setImageUrl(regenerated.url);
        } catch (err) {
          console.error('❌ Failed to regenerate image:', err);
          setError(err.message);
          // Fallback to placeholder
          setImageUrl(`https://placehold.co/600x400/F5EDE6/C4785A?text=${encodeURIComponent('Image unavailable')}`);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.warn('⚠️ No image data or prompt available');
      }
    }

    loadImage();
  }, [imageData]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-[#F5EDE6] ${className}`}>
        <Loader2 className="w-8 h-8 text-[#C4785A] animate-spin" />
      </div>
    );
  }

  if (error && !imageUrl) {
    return (
      <div className={`flex items-center justify-center bg-[#F5EDE6] ${className}`}>
        <span className="text-[#C4785A] text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <img 
      src={imageUrl} 
      alt={alt} 
      className={className}
      {...props}
    />
  );
}

/**
 * Gallery component that efficiently handles multiple images
 * Images regenerate once per session and stay consistent while browsing
 */
export function SmartImageGallery({ images, className, onImageClick }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {images.map((imageData, idx) => (
        <div
          key={idx}
          className="aspect-square rounded-xl overflow-hidden bg-[#F5EDE6] cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onImageClick?.(imageData, idx)}
        >
          <SmartImage
            imageData={imageData}
            alt={`Image ${idx + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}