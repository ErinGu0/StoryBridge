import React from 'react';
import { motion } from 'framer-motion';
import { User, Clock, Pause, Play, Coffee, X } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function InterviewHeader({ 
  senior, 
  duration, 
  isPaused, 
  onPause, 
  onResume, 
  onBreak, 
  onEnd 
}) {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#E8DFD5] p-4 md:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#F5EDE6] overflow-hidden flex-shrink-0">
            {senior?.photo_url ? (
              <img src={senior.photo_url} alt={senior.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-7 h-7 text-[#C4785A]" />
              </div>
            )}
          </div>
          <div>
            <h2 className="font-serif text-xl text-[#3D3D3D]">
              Interview with {senior?.nickname || senior?.name || 'Select a senior'}
            </h2>
            <div className="flex items-center gap-3 text-sm text-[#6B6B6B] mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDuration(duration)}
              </span>
              {isPaused && (
                <span className="text-[#C4785A] font-medium">Paused</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPaused ? (
            <Button
              onClick={onResume}
              variant="outline"
              className="border-[#8FAE8B] text-[#8FAE8B] hover:bg-[#8FAE8B] hover:text-white rounded-full"
            >
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
          ) : (
            <Button
              onClick={onPause}
              variant="outline"
              className="border-[#D4A5A5] text-[#D4A5A5] hover:bg-[#D4A5A5] hover:text-white rounded-full"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          <Button
            onClick={onBreak}
            variant="outline"
            className="border-[#8FAE8B] text-[#8FAE8B] hover:bg-[#8FAE8B] hover:text-white rounded-full"
          >
            <Coffee className="w-4 h-4 mr-2" />
            Break
          </Button>
          <Button
            onClick={onEnd}
            className="bg-[#C4785A] hover:bg-[#A86045] text-white rounded-full"
          >
            End Session
          </Button>
        </div>
      </div>

      {senior?.dementia_considerations && (
        <div className="mt-4 p-3 bg-[#E8FFF0] rounded-xl border border-[#B4FFB8] text-sm text-[#148B1A]">
          <strong>Remember:</strong> {senior.dementia_considerations}
        </div>
      )}
    </motion.div>
  );
}