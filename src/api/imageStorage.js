// imageStorage.js - IndexedDB wrapper for storing images
const DB_NAME = 'MemoryLaneDB';
const STORE_NAME = 'images';
const DB_VERSION = 1;

class ImageStorage {
  constructor() {
    this.db = null;
  }

  async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB initialized');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          console.log('📦 Created images object store');
        }
      };
    });
  }

  async saveImage(id, imageData) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = store.put({
          id,
          url: imageData.url,
          prompt: imageData.prompt,
          mimeType: imageData.mimeType,
          timestamp: Date.now()
        });

        request.onsuccess = () => {
          console.log(`💾 Image saved to IndexedDB: ${id}`);
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('❌ Failed to save image:', error);
      throw error;
    }
  }

  async getImage(id) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
          if (request.result) {
            console.log(`📥 Image loaded from IndexedDB: ${id}`);
          }
          resolve(request.result);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('❌ Failed to get image:', error);
      return null;
    }
  }

  async deleteImage(id) {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => {
          console.log(`🗑️ Image deleted: ${id}`);
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('❌ Failed to delete image:', error);
    }
  }

  async clearAll() {
    try {
      await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => {
          console.log('🧹 All images cleared');
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('❌ Failed to clear images:', error);
    }
  }
}

export const imageStorage = new ImageStorage();