import React from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '../../components/ui/textarea';
import { Edit3 } from 'lucide-react';

export default function ConversationNotes({ notes, onNotesChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#E8DFD5] p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#C4785A] flex items-center justify-center">
          <Edit3 className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-medium text-[#3D3D3D]">Conversation Notes</h3>
      </div>

      <Textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Type what they're sharing... You can clean this up later with AI assistance. Don't worry about perfect transcription - capture key points, names, places, and emotions."
        className="min-h-[300px] border-[#E8DFD5] focus:border-[#C4785A] focus:ring-[#C4785A] resize-none text-[#3D3D3D]"
      />

      <p className="text-xs text-[#6B6B6B] mt-3">
        💡 Tip: Focus on listening. Jot down key words, names, and places. The AI will help organize this into a story later.
      </p>
    </motion.div>
  );
}