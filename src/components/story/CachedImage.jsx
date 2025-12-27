import React, { useState, useEffect } from 'react';
import { imageStorage } from '../../api/imageStorage';  // ← Fixed: two levels up!
import { Loader2 } from 'lucide-react';

/**
 * Component that loads images from IndexedDB cache
 * Images are permanent - no regeneration needed!
 */
export default function CachedImage({ imageId, alt, className, fallbackSrc }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadImage = async () => {
      if (!imageId) {
        setLoading(false);
        setError(true);
        return;
      }

      try {
        setLoading(true);
        const image = await imageStorage.getImage(imageId);
        
        if (mounted) {
          if (image?.url) {
            setImageSrc(image.url);
            setError(false);
          } else {
            console.warn(`Image not found in cache: ${imageId}`);
            setError(true);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load image:', err);
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      mounted = false;
    };
  }, [imageId]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className || ''}`}>
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error || !imageSrc) {
    return fallbackSrc ? (
      <img src={fallbackSrc} alt={alt} className={className} />
    ) : (
      <div className={`flex items-center justify-center bg-gray-200 ${className || ''}`}>
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={className}
    />
  );
}