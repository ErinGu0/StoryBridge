import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Heart } from 'lucide-react';

export default function WelcomeHero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#C4785A] via-[#D4896A] to-[#E8A98A] p-8 md:p-12 text-white"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Heart className="w-5 h-5" />
          </div>
          <span className="text-white/80 text-sm font-medium">Welcome Back</span>
        </div>
        
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium mb-4 leading-tight">
          Building bridges between<br />generations through stories
        </h1>
        
        <p className="text-white/90 text-lg mb-8 max-w-lg">
          Help preserve precious memories through gentle conversations. 
          Our AI-assisted platform makes it easy to capture and share family history.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">AI-Powered Prompts</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Dementia-Friendly</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}