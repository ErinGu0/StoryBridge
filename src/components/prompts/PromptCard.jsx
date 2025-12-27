import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, Music, Heart } from 'lucide-react';

const categoryColors = {
  childhood: { bg: 'bg-[#FFE5B4]', text: 'text-[#8B6914]', light: 'bg-[#FFF8E8]' },
  family: { bg: 'bg-[#E5B4FF]', text: 'text-[#54148B]', light: 'bg-[#F8E8FF]' },
  career: { bg: 'bg-[#B4FFB8]', text: 'text-[#148B1A]', light: 'bg-[#E8FFF0]' },
  love: { bg: 'bg-[#FFB4D4]', text: 'text-[#8B1454]', light: 'bg-[#FFE8F0]' },
  adventures: { bg: 'bg-[#B4E5FF]', text: 'text-[#14648B]', light: 'bg-[#E8F8FF]' },
  traditions: { bg: 'bg-[#FFD4B4]', text: 'text-[#8B4514]', light: 'bg-[#FFF0E8]' },
  heirlooms: { bg: 'bg-[#D4D4B4]', text: 'text-[#5A5A14]', light: 'bg-[#F5F5E8]' },
  music: { bg: 'bg-[#B4D4FF]', text: 'text-[#144A8B]', light: 'bg-[#E8F0FF]' },
  food: { bg: 'bg-[#FFB4B4]', text: 'text-[#8B1414]', light: 'bg-[#FFE8E8]' },
  challenges: { bg: 'bg-[#B4B4B4]', text: 'text-[#4A4A4A]', light: 'bg-[#F0F0F0]' },
  wisdom: { bg: 'bg-[#D4B4FF]', text: 'text-[#4A148B]', light: 'bg-[#F0E8FF]' }
};

export default function PromptCardDisplay({ prompt, index = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const colors = categoryColors[prompt.category] || categoryColors.wisdom;

  return (
    <div
      style={{
        opacity: 0,
        animation: `fadeInUp 0.4s ease-out ${index * 0.05}s forwards`
      }}
      className={`${colors.light} rounded-2xl border border-white/50 overflow-hidden`}
    >
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .expand-content {
          animation: expandDown 0.3s ease-out forwards;
        }
        
        @keyframes expandDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 1000px;
          }
        }
      `}</style>
      
      <div 
        className="p-5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <span className={`inline-block text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text} mb-2`}>
              {prompt.category}
            </span>
            <p className="text-[#3D3D3D] font-medium text-lg leading-relaxed">
              "{prompt.prompt_text}"
            </p>
            
            {prompt.dementia_friendly && (
              <span className="inline-flex items-center gap-1 mt-2 text-xs text-[#8FAE8B]">
                <Heart className="w-3 h-3" />
                Dementia-friendly
              </span>
            )}
          </div>
          
          <button className="flex-shrink-0 w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-[#6B6B6B]">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div
          className="px-5 pb-5 space-y-4 border-t border-white/50 pt-4 expand-content"
        >
          {/* Follow-up prompts */}
          {prompt.follow_up_prompts?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-[#3D3D3D] mb-2">Follow-up Questions</h4>
              <ul className="space-y-2">
                {prompt.follow_up_prompts.map((followUp, idx) => (
                  <li key={idx} className="text-sm text-[#6B6B6B] pl-4 border-l-2 border-[#E8DFD5]">
                    {followUp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips for interviewer */}
          {prompt.tips_for_interviewer && (
            <div className="bg-white/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-[#C4785A]" />
                <h4 className="text-sm font-medium text-[#3D3D3D]">Tip for Interviewer</h4>
              </div>
              <p className="text-sm text-[#6B6B6B]">{prompt.tips_for_interviewer}</p>
            </div>
          )}

          {/* Sensory triggers */}
          {prompt.sensory_triggers?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Music className="w-4 h-4 text-[#8FAE8B]" />
                <h4 className="text-sm font-medium text-[#3D3D3D]">Memory Triggers</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {prompt.sensory_triggers.map((trigger, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-white/70 text-[#6B6B6B] rounded-full">
                    {trigger}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}