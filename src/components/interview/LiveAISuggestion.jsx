import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, Ear, Hand, Heart, ArrowRight, X } from 'lucide-react';
import { Button } from '../../components/ui/button';

const typeConfig = {
  sensory: {
    icon: Ear,
    label: 'Sensory Prompt',
    color: 'from-[#D4A5A5] to-[#E8C4C4]',
    description: 'Help them recall through senses'
  },
  follow_up: {
    icon: ArrowRight,
    label: 'Follow Up',
    color: 'from-[#8FAE8B] to-[#B8D4B4]',
    description: 'Dig deeper into this topic'
  },
  redirect: {
    icon: Heart,
    label: 'Gentle Redirect',
    color: 'from-[#7B9EBD] to-[#A5C4DD]',
    description: 'Try a new direction'
  },
  encouragement: {
    icon: Sparkles,
    label: 'Encouragement',
    color: 'from-[#C4785A] to-[#E8A98A]',
    description: 'Keep them engaged'
  }
};

export default function LiveAISuggestion({ suggestion, onDismiss, onUse }) {
  if (!suggestion) return null;

  const config = typeConfig[suggestion.type] || typeConfig.follow_up;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={`bg-gradient-to-r ${config.color} rounded-2xl p-5 text-white shadow-lg`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-medium opacity-90">{config.label}</span>
              <p className="text-xs opacity-70">{config.description}</p>
            </div>
          </div>
          <button 
            onClick={onDismiss}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-lg font-medium mb-4">
          "{suggestion.text}"
        </p>

        <div className="flex gap-2">
          <Button
            onClick={() => onUse(suggestion.text)}
            variant="secondary"
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-none"
          >
            Use This Prompt
          </Button>
          <Button
            onClick={onDismiss}
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            Skip
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}