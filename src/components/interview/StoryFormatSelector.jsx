import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Image, FileText, Layout, Presentation, Sparkles } from 'lucide-react';

const formats = [
  {
    id: 'storybook',
    name: 'Illustrated Storybook',
    description: 'A picture book with watercolor illustrations for younger children (5-10 years)',
    icon: BookOpen,
    color: 'from-[#FFE5B4] to-[#FFD4A5]',
    textColor: 'text-[#8B6914]',
    ageRange: '5-10 years',
    imageStyle: 'Warm, gentle watercolor illustrations with soft edges and friendly faces'
  },
  {
    id: 'comic',
    name: 'Comic Book',
    description: 'Graphic novel style with panels and speech bubbles for older children (8-14 years)',
    icon: Layout,
    color: 'from-[#B4E5FF] to-[#A5D4FF]',
    textColor: 'text-[#14648B]',
    ageRange: '8-14 years',
    imageStyle: 'Comic book style with bold lines, panels, and dynamic action poses'
  },
  {
    id: 'novel',
    name: 'Hero\'s Journey',
    description: 'Written narrative framing them as the hero of their own adventure (12+ years)',
    icon: Sparkles,
    color: 'from-[#E5B4FF] to-[#D4A5FF]',
    textColor: 'text-[#54148B]',
    ageRange: '12+ years',
    imageStyle: 'Epic, dramatic illustrations highlighting key moments of courage and triumph'
  },
  {
    id: 'memoir',
    name: 'Family Memoir',
    description: 'Traditional narrative with historical photos and context for adults',
    icon: FileText,
    color: 'from-[#B8D4B4] to-[#A5C4A5]',
    textColor: 'text-[#148B1A]',
    ageRange: 'Adults',
    imageStyle: 'Vintage-styled illustrations that complement historical photographs'
  },
  {
    id: 'slideshow',
    name: 'Photo Slideshow',
    description: 'Visual presentation with AI-generated images and story narration',
    icon: Presentation,
    color: 'from-[#D4A5A5] to-[#C49595]',
    textColor: 'text-[#8B1454]',
    ageRange: 'All ages',
    imageStyle: 'Scenic, atmospheric images that capture moments and emotions'
  },
  {
    id: 'infographic',
    name: 'Life Timeline',
    description: 'Visual infographic showing key life events and milestones',
    icon: Image,
    color: 'from-[#A5C4DD] to-[#95B4CD]',
    textColor: 'text-[#144A8B]',
    ageRange: 'All ages',
    imageStyle: 'Clean, modern icons and illustrations for timeline visualization'
  }
];

export default function StoryFormatSelector({ selectedFormat, onSelectFormat }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-[#3D3D3D] mb-1">Choose Story Format</h3>
        <p className="text-sm text-[#6B6B6B]">
          How would you like this story to be presented? Each format creates different illustrations.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {formats.map((format, idx) => {
          const Icon = format.icon;
          const isSelected = selectedFormat === format.id;
          
          return (
            <motion.button
              key={format.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelectFormat(format.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                isSelected 
                  ? 'border-[#C4785A] bg-[#FDF8F3] shadow-md' 
                  : 'border-[#E8DFD5] hover:border-[#C4785A]/50 hover:bg-[#FDFBF9]'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${format.color} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${format.textColor}`} />
              </div>
              <h4 className="font-medium text-[#3D3D3D] text-sm mb-1">{format.name}</h4>
              <p className="text-xs text-[#6B6B6B] line-clamp-2">{format.description}</p>
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${format.color} ${format.textColor}`}>
                {format.ageRange}
              </span>
            </motion.button>
          );
        })}
      </div>

      {selectedFormat && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-[#F5EDE6] rounded-xl p-4"
        >
          <p className="text-sm text-[#6B6B6B]">
            <span className="font-medium text-[#3D3D3D]">Image Style: </span>
            {formats.find(f => f.id === selectedFormat)?.imageStyle}
          </p>
        </motion.div>
      )}
    </div>
  );
}

export { formats as storyFormats };