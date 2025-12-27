import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { BookOpen, Calendar, MapPin, ArrowRight } from 'lucide-react';

const chapterColors = {
  childhood: 'bg-[#FFE5B4] text-[#8B6914]',
  teen_years: 'bg-[#B4E5FF] text-[#14648B]',
  young_adult: 'bg-[#FFB4D4] text-[#8B1454]',
  career: 'bg-[#B4FFB8] text-[#148B1A]',
  family_life: 'bg-[#E5B4FF] text-[#54148B]',
  retirement: 'bg-[#FFD4B4] text-[#8B4514]',
  other: 'bg-[#E0E0E0] text-[#505050]'
};

export default function RecentStories({ stories = [], seniors = [] }) {
  const getSeniorName = (seniorId) => {
    const senior = seniors.find(s => s.id === seniorId);
    return senior?.nickname || senior?.name || 'Unknown';
  };

  if (stories.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-[#E8DFD5]">
        <div className="w-16 h-16 bg-[#F5EDE6] rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-[#C4785A]" />
        </div>
        <h3 className="font-serif text-xl text-[#3D3D3D] mb-2">No stories yet</h3>
        <p className="text-[#6B6B6B]">Start an interview to capture your first story</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-[#3D3D3D]">Recent Stories</h2>
        <Link 
          to={createPageUrl('Stories')} 
          className="text-[#C4785A] hover:text-[#A86045] text-sm font-medium flex items-center gap-1"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stories.slice(0, 6).map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link 
              to={createPageUrl(`StoryDetail?id=${story.id}`)}
              className="block bg-white rounded-2xl p-5 border border-[#E8DFD5] hover:shadow-lg hover:border-[#C4785A]/30 transition-all duration-300 group"
            >
              {story.generated_images?.[0]?.url && (
                <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-[#F5EDE6]">
                  <img 
                    src={story.generated_images[0].url} 
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${chapterColors[story.life_chapter] || chapterColors.other}`}>
                  {story.life_chapter?.replace('_', ' ') || 'Memory'}
                </span>
                <span className="text-xs text-[#6B6B6B]">{getSeniorName(story.senior_id)}</span>
              </div>
              
              <h3 className="font-serif text-lg text-[#3D3D3D] mb-2 line-clamp-2 group-hover:text-[#C4785A] transition-colors">
                {story.title}
              </h3>
              
              <p className="text-[#6B6B6B] text-sm line-clamp-2 mb-3">
                {story.summary || story.full_content?.substring(0, 100)}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-[#A0A0A0]">
                {story.year_approximate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    ~{story.year_approximate}
                  </span>
                )}
                {story.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {story.location}
                  </span>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}