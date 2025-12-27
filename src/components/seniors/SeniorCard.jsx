import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { User, MapPin, Calendar, BookOpen, MessageCircle } from 'lucide-react';

export default function SeniorCard({ senior, storiesCount = 0, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={createPageUrl(`SeniorProfile?id=${senior.id}`)}
        className="block bg-white rounded-2xl border border-[#E8DFD5] overflow-hidden hover:shadow-lg hover:border-[#C4785A]/30 transition-all duration-300 group"
      >
        <div className="aspect-[4/3] bg-gradient-to-br from-[#F5EDE6] to-[#E8DFD5] relative overflow-hidden">
          {senior.photo_url ? (
            <img 
              src={senior.photo_url} 
              alt={senior.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/50 flex items-center justify-center">
                <User className="w-10 h-10 text-[#C4785A]" />
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-serif text-xl text-white font-medium">
              {senior.nickname || senior.name}
            </h3>
            {senior.nickname && senior.nickname !== senior.name && (
              <p className="text-white/80 text-sm">{senior.name}</p>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex flex-wrap gap-2 text-sm text-[#6B6B6B] mb-3">
            {senior.birth_year && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Born {senior.birth_year}
              </span>
            )}
            {senior.birth_place && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {senior.birth_place}
              </span>
            )}
          </div>
          
          {senior.favorite_topics?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {senior.favorite_topics.slice(0, 3).map((topic) => (
                <span 
                  key={topic} 
                  className="text-xs px-2 py-1 bg-[#F5EDE6] text-[#C4785A] rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-3 border-t border-[#E8DFD5]">
            <span className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
              <BookOpen className="w-4 h-4" />
              {storiesCount} {storiesCount === 1 ? 'story' : 'stories'}
            </span>
            <span className="text-[#C4785A] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              <MessageCircle className="w-4 h-4" />
              Interview
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}