import axios from 'axios';
import { imageStorage } from './imageStorage';

const GEMINI_API_KEY = 'AIzaSyDRllKQL7aEom7J3j4Fv3dHRX81eHSng7Q';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const geminiClient = {
  async generateText(prompt, jsonSchema = null) {
    try {
      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
          responseMimeType: jsonSchema ? "application/json" : "text/plain"
        }
      };

      console.log('📤 Sending to Gemini API:', prompt.substring(0, 100) + '...');
      
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
        throw new Error('Invalid API response structure');
      }

      const text = response.data.candidates[0].content.parts[0].text;
      console.log('✅ Gemini response received successfully!');
      console.log('📝 Raw response:', text);
      
      if (jsonSchema) {
        return this.parseJSON(text);
      }
      
      return text;
    } catch (error) {
      console.error('❌ Gemini API error:', error.response?.data || error.message);
      
      return {
        error: true,
        message: error.response?.data?.error?.message || error.message || "AI service connection failed",
        details: error.toString()
      };
    }
  },

  parseJSON(text) {
    console.log('🔍 Attempting to parse JSON from text...');
    console.log('📄 Text length:', text.length);
    console.log('📄 First 500 chars:', text.substring(0, 500));
    
    // Strategy 1: Direct parse
    try {
      const parsed = JSON.parse(text);
      console.log('✅ Strategy 1 SUCCESS: Direct JSON.parse worked');
      return parsed;
    } catch (e) {
      console.log('⚠️ Strategy 1 failed:', e.message);
    }

    // Strategy 2: Remove markdown code blocks
    try {
      let cleaned = text
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();
      
      console.log('🧹 Cleaned text (first 300 chars):', cleaned.substring(0, 300));
      
      const parsed = JSON.parse(cleaned);
      console.log('✅ Strategy 2 SUCCESS: Cleaned markdown and parsed');
      return parsed;
    } catch (e) {
      console.log('⚠️ Strategy 2 failed:', e.message);
    }

    // Strategy 3: Extract JSON object
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log('🔍 Found JSON object in text');
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ Strategy 3 SUCCESS: Extracted and parsed JSON object');
        return parsed;
      }
    } catch (e) {
      console.log('⚠️ Strategy 3 failed:', e.message);
    }

    // Strategy 4: Try to find JSON array
    try {
      const arrayMatch = text.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        console.log('🔍 Found JSON array in text');
        const parsed = JSON.parse(arrayMatch[0]);
        console.log('✅ Strategy 4 SUCCESS: Extracted and parsed JSON array');
        return { scenes: parsed };
      }
    } catch (e) {
      console.log('⚠️ Strategy 4 failed:', e.message);
    }

    console.error('❌ ALL PARSING STRATEGIES FAILED');
    console.error('📄 Original text:', text);
    
    throw new Error('Failed to parse API response. The AI did not return valid JSON.');
  },

  /**
   * Generate an image and store it permanently in IndexedDB
   * @param {string} prompt - The image generation prompt
   * @param {string} imageId - Unique ID for caching (if not provided, generates one)
   * @returns {Promise<Object>} Image data with id and url
   */
  async generateImage(prompt, imageId = null) {
    try {
      // Generate unique ID if not provided
      const id = imageId || `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Check if image already exists in IndexedDB cache
      const existingImage = await imageStorage.getImage(id);
      if (existingImage) {
        console.log('✅ Image found in IndexedDB cache:', id);
        return {
          id,
          url: existingImage.url,
          prompt: existingImage.prompt,
          mimeType: existingImage.mimeType,
          fromCache: true,
          generated: true
        };
      }

      console.log('🎨 Generating new image with Gemini 2.5 Flash Image:', prompt.substring(0, 80) + '...');
      
      const IMAGE_MODEL = 'gemini-2.5-flash-image';
      const IMAGE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent`;
      
      const response = await axios.post(
        `${IMAGE_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            responseModalities: ["IMAGE"],
            temperature: 0.4,
            topK: 32,
            topP: 1
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📥 Image API response received');

      if (response.data?.candidates?.[0]?.content?.parts) {
        const parts = response.data.candidates[0].content.parts;
        const imagePart = parts.find(part => part.inlineData);
        
        if (imagePart?.inlineData?.data) {
          const base64Image = imagePart.inlineData.data;
          const mimeType = imagePart.inlineData.mimeType || 'image/png';
          const imageUrl = `data:${mimeType};base64,${base64Image}`;
          
          console.log('✅ Image generated successfully!');
          console.log('Image size:', (base64Image.length * 0.75 / 1024).toFixed(2), 'KB');
          
          // Save to IndexedDB for permanent storage
          const imageData = {
            id,
            url: imageUrl,
            prompt: prompt,
            mimeType: mimeType
          };
          
          await imageStorage.saveImage(id, imageData);
          console.log('💾 Image saved to IndexedDB:', id);
          
          return {
            ...imageData,
            generated: true,
            fromCache: false
          };
        }
      }
      
      console.warn('⚠️ No image data in API response, using fallback');
      return this.generateFallbackImage(prompt, id);
      
    } catch (error) {
      console.error('❌ Gemini image generation failed:', error.response?.data || error.message);
      
      if (error.response?.data?.error) {
        console.error('Error details:', error.response.data.error);
      }
      
      console.log('⚠️ Falling back to placeholder image');
      return this.generateFallbackImage(prompt, imageId);
    }
  },

  generateFallbackImage(prompt, id) {
    console.log('📦 Using placeholder image');
    const placeholderUrl = `https://placehold.co/600x400/F5EDE6/C4785A?text=${encodeURIComponent(prompt.substring(0, 50))}`;
    
    return {
      id: id || `fallback-${Date.now()}`,
      url: placeholderUrl,
      prompt: prompt,
      isFallback: true,
      isPlaceholder: true
    };
  },

  /**
   * Load an image from IndexedDB by ID
   */
  async loadImage(imageId) {
    try {
      const image = await imageStorage.getImage(imageId);
      if (image) {
        return {
          id: imageId,
          url: image.url,
          prompt: image.prompt,
          mimeType: image.mimeType,
          fromCache: true
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to load image:', error);
      return null;
    }
  },

  async uploadFile(file) {
    return {
      file_url: URL.createObjectURL(file),
      file_name: file.name,
      file_size: file.size
    };
  },

  async InvokeLLM({ prompt, response_json_schema }) {
    return await this.generateText(prompt, response_json_schema);
  },

  async GenerateImage({ prompt, imageId }) {
    return await this.generateImage(prompt, imageId);
  },

  async UploadFile({ file }) {
    return await this.uploadFile(file);
  }
};

// AGGRESSIVE URL STRIPPING - Optimized story storage
const optimizeStoryForStorage = (storyData) => {
  console.log('🧹 Optimizing story for storage...');
  console.log('Before optimization:', JSON.stringify(storyData).length, 'characters');
  
  const optimized = { ...storyData };
  
  // Helper function to strip URLs from image objects
  const stripImageUrls = (img) => {
    if (!img) return null;
    return {
      id: img.id,
      prompt: img.prompt,
      mimeType: img.mimeType,
      scene_number: img.scene_number,
      generated: img.generated
      // NO url, NO base64 data!
    };
  };
  
  // Strip URLs from top-level images array
  if (optimized.images && Array.isArray(optimized.images)) {
    optimized.images = optimized.images.map(stripImageUrls).filter(Boolean);
    console.log('✂️ Stripped URLs from', optimized.images.length, 'top-level images');
  }
  
  // Strip URLs from generated_images array
  if (optimized.generated_images && Array.isArray(optimized.generated_images)) {
    optimized.generated_images = optimized.generated_images.map(stripImageUrls).filter(Boolean);
    console.log('✂️ Stripped URLs from', optimized.generated_images.length, 'generated images');
  }
  
  // Strip URLs from story_formats
  if (optimized.story_formats && Array.isArray(optimized.story_formats)) {
    optimized.story_formats = optimized.story_formats.map(format => {
      const optimizedFormat = { ...format };
      
      // Strip from format.images
      if (optimizedFormat.images && Array.isArray(optimizedFormat.images)) {
        optimizedFormat.images = optimizedFormat.images.map(stripImageUrls).filter(Boolean);
      }
      
      // Strip from format.scenes
      if (optimizedFormat.scenes && Array.isArray(optimizedFormat.scenes)) {
        optimizedFormat.scenes = optimizedFormat.scenes.map(scene => ({
          ...scene,
          image: scene.image ? stripImageUrls(scene.image) : null
        }));
      }
      
      // Strip from format.slides
      if (optimizedFormat.slides && Array.isArray(optimizedFormat.slides)) {
        optimizedFormat.slides = optimizedFormat.slides.map(slide => ({
          ...slide,
          image: slide.image ? stripImageUrls(slide.image) : null
        }));
      }
      
      return optimizedFormat;
    });
    
    console.log('✂️ Stripped URLs from', optimized.story_formats.length, 'story formats');
    
    // Limit formats to prevent any issues
    if (optimized.story_formats.length > 10) {
      console.warn('⚠️ Story has more than 10 formats. Keeping only the 10 most recent.');
      optimized.story_formats = optimized.story_formats.slice(-10);
    }
  }
  
  const optimizedSize = JSON.stringify(optimized).length;
  console.log('After optimization:', optimizedSize, 'characters');
  console.log('Space saved:', 
    JSON.stringify(storyData).length - optimizedSize, 
    'characters (~' + ((JSON.stringify(storyData).length - optimizedSize) / 1024 / 1024).toFixed(2) + ' MB)'
  );
  
  return optimized;
};

export const mockEntities = {
  Senior: {
    list: async () => {
      const stored = localStorage.getItem('seniors');
      return stored ? JSON.parse(stored) : [];
    },
    create: async (data) => {
      const seniors = await mockEntities.Senior.list();
      const newSenior = { 
        id: Date.now().toString(), 
        created_date: new Date().toISOString(),
        ...data 
      };
      seniors.push(newSenior);
      localStorage.setItem('seniors', JSON.stringify(seniors));
      return newSenior;
    },
    filter: async ({ id }) => {
      const seniors = await mockEntities.Senior.list();
      return seniors.filter(s => s.id === id);
    },
    update: async (id, data) => {
      const seniors = await mockEntities.Senior.list();
      const index = seniors.findIndex(s => s.id === id);
      if (index !== -1) {
        seniors[index] = { ...seniors[index], ...data };
        localStorage.setItem('seniors', JSON.stringify(seniors));
        return seniors[index];
      }
      return null;
    }
  },
  
  Story: {
    list: async (sort = '-created_date', limit = 20) => {
      const stored = localStorage.getItem('stories');
      const stories = stored ? JSON.parse(stored) : [];
      return stories.slice(0, limit);
    },
    create: async (data) => {
      const stories = await mockEntities.Story.list();
      const optimizedData = optimizeStoryForStorage(data);
      const newStory = { 
        id: Date.now().toString(), 
        created_date: new Date().toISOString(),
        ...optimizedData 
      };
      stories.unshift(newStory);
      
      const limitedStories = stories.slice(0, 50);
      
      try {
        localStorage.setItem('stories', JSON.stringify(limitedStories));
      } catch (e) {
        if (e.name === 'QuotaExceededError') {
          console.warn('⚠️ Storage quota exceeded, keeping only 20 most recent stories');
          const reducedStories = stories.slice(0, 20);
          localStorage.setItem('stories', JSON.stringify(reducedStories));
        } else {
          throw e;
        }
      }
      
      return newStory;
    },
    filter: async ({ id }) => {
      const stories = await mockEntities.Story.list();
      return stories.filter(s => s.id === id);
    },
    update: async (id, data) => {
      const stories = await mockEntities.Story.list();
      const index = stories.findIndex(s => s.id === id);
      if (index !== -1) {
        const optimizedData = optimizeStoryForStorage(data);
        stories[index] = { ...stories[index], ...optimizedData };
        
        try {
          localStorage.setItem('stories', JSON.stringify(stories));
          console.log('✅ Story saved successfully! Images are in IndexedDB.');
        } catch (e) {
          if (e.name === 'QuotaExceededError') {
            console.error('❌ Storage quota exceeded!');
            throw new Error('Storage full! Please delete some old stories.');
          }
          throw e;
        }
        
        return stories[index];
      }
      return null;
    },
    bulkCreate: async (stories) => {
      const existing = await mockEntities.Story.list();
      const newStories = stories.map((story, idx) => ({
        id: (Date.now() + idx).toString(),
        ...optimizeStoryForStorage(story)
      }));
      const allStories = [...newStories, ...existing].slice(0, 50);
      
      try {
        localStorage.setItem('stories', JSON.stringify(allStories));
      } catch (e) {
        if (e.name === 'QuotaExceededError') {
          const reducedStories = allStories.slice(0, 20);
          localStorage.setItem('stories', JSON.stringify(reducedStories));
        } else {
          throw e;
        }
      }
      
      return newStories;
    }
  },
  
  InterviewSession: {
    list: async () => {
      const stored = localStorage.getItem('sessions');
      return stored ? JSON.parse(stored) : [];
    },
    create: async (data) => {
      const sessions = await mockEntities.InterviewSession.list();
      const newSession = { 
        id: Date.now().toString(),
        session_date: new Date().toISOString().split('T')[0],
        ...data 
      };
      sessions.push(newSession);
      localStorage.setItem('sessions', JSON.stringify(sessions));
      return newSession;
    },
    filter: async ({ senior_id }) => {
      const sessions = await mockEntities.InterviewSession.list();
      return sessions.filter(s => s.senior_id === senior_id);
    }
  },
  
  PromptCard: {
    list: async () => {
      const stored = localStorage.getItem('prompts');
      if (stored) return JSON.parse(stored);
      
      const defaultPrompts = [
        {
          id: '1',
          category: 'childhood',
          prompt_text: "What games did you play as a child?",
          follow_up_prompts: ["Who did you play with?", "Where was your favorite place to play?"],
          tips_for_interviewer: "If they mention toys, ask them to describe what they looked like",
          dementia_friendly: true,
          sensory_triggers: ["Old photos of toys", "Children's songs from their era"]
        },
        {
          id: '2',
          category: 'family',
          prompt_text: "What did a typical Sunday look like in your family?",
          follow_up_prompts: ["Who prepared the meals?", "Did you have family traditions?"],
          tips_for_interviewer: "Family gatherings often bring back strong memories",
          dementia_friendly: true,
          sensory_triggers: ["Sunday dinner smells", "Church bells"]
        }
      ];
      localStorage.setItem('prompts', JSON.stringify(defaultPrompts));
      return defaultPrompts;
    },
    create: async (data) => {
      const prompts = await mockEntities.PromptCard.list();
      const newPrompt = { id: Date.now().toString(), ...data };
      prompts.push(newPrompt);
      localStorage.setItem('prompts', JSON.stringify(prompts));
      return newPrompt;
    },
    bulkCreate: async (prompts) => {
      const existing = await mockEntities.PromptCard.list();
      const newPrompts = prompts.map((prompt, idx) => ({
        id: (Date.now() + idx).toString(),
        ...prompt
      }));
      const allPrompts = [...newPrompts, ...existing];
      localStorage.setItem('prompts', JSON.stringify(allPrompts));
      return newPrompts;
    }
  }
};