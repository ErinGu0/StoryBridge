import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Play, Clock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

export default function BreakModal({ isOpen, onClose, onResume }) {
  const [breakDuration, setBreakDuration] = useState(0);

  useEffect(() => {
    let interval;
    if (isOpen) {
      interval = setInterval(() => {
        setBreakDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
      setBreakDuration(0);
    };
  }, [isOpen]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-2xl">
            <Coffee className="w-6 h-6 text-[#8FAE8B]" />
            Taking a Break
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="w-24 h-24 rounded-full bg-[#F5EDE6] flex items-center justify-center mx-auto mb-6">
            <Coffee className="w-12 h-12 text-[#8FAE8B]" />
          </div>

          <p className="text-[#6B6B6B] mb-4">
            It's important to take breaks during interviews. 
            This prevents overwhelming the senior and keeps the conversation enjoyable.
          </p>

          <div className="flex items-center justify-center gap-2 text-2xl font-mono text-[#C4785A] mb-6">
            <Clock className="w-6 h-6" />
            {formatDuration(breakDuration)}
          </div>

          <div className="bg-[#FFF8E8] rounded-xl p-4 text-sm text-[#8B6914] mb-6">
            <p><strong>Tip:</strong> Offer water or tea. Let them rest their eyes. 
            This is a good time to review your notes.</p>
          </div>

          <Button
            onClick={onResume}
            className="bg-[#8FAE8B] hover:bg-[#7A9A76] text-white rounded-full px-8"
          >
            <Play className="w-4 h-4 mr-2" />
            Resume Interview
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}