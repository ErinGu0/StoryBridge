import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockEntities } from '../api/geminiClient';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, MapPin, Filter, User, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { format } from 'date-fns';

const chapterColors = {
  childhood: 'bg-[#FFE5B4] text-[#8B6914] border-[#FFE5B4]',
  teen_years: 'bg-[#B4E5FF] text-[#14648B] border-[#B4E5FF]',
  young_adult: 'bg-[#FFB4D4] text-[#8B1454] border-[#FFB4D4]',
  career: 'bg-[#B4FFB8] text-[#148B1A] border-[#B4FFB8]',
  family_life: 'bg-[#E5B4FF] text-[#54148B] border-[#E5B4FF]',
  retirement: 'bg-[#FFD4B4] text-[#8B4514] border-[#FFD4B4]',
  other: 'bg-[#E0E0E0] text-[#505050] border-[#E0E0E0]'
};

const lifeChapters = ['all', 'childhood', 'teen_years', 'young_adult', 'career', 'family_life', 'retirement', 'other'];

export default function Stories() {
  const [selectedSenior, setSelectedSenior] = useState('all');
  const [selectedChapter, setSelectedChapter] = useState('all');

  const { data: stories = [], isLoading: loadingStories } = useQuery({
    queryKey: ['stories'],
    queryFn: () => mockEntities.Story.list('-year_approximate')
  });

  const { data: seniors = [] } = useQuery({
    queryKey: ['seniors'],
    queryFn: () => mockEntities.Senior.list()
  });

  const getSeniorName = (seniorId) => {
    const senior = seniors.find(s => s.id === seniorId);
    return senior?.nickname || senior?.name || 'Unknown';
  };

  const filteredStories = stories.filter(story => {
    const seniorMatch = selectedSenior === 'all' || story.senior_id === selectedSenior;
    const chapterMatch = selectedChapter === 'all' || story.life_chapter === selectedChapter;
    return seniorMatch && chapterMatch && !story.is_gap;
  });

  // Group stories by decade for timeline view
  const groupedByDecade = filteredStories.reduce((acc, story) => {
    const decade = story.year_approximate ? Math.floor(story.year_approximate / 10) * 10 : 'Unknown';
    if (!acc[decade]) acc[decade] = [];
    acc[decade].push(story);
    return acc;
  }, {});

  const sortedDecades = Object.keys(groupedByDecade).sort((a, b) => {
    if (a === 'Unknown') return 1;
    if (b === 'Unknown') return -1;
    return parseInt(a) - parseInt(b);
  });

  if (loadingStories) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C4785A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#3D3D3D] mb-2">Story Timeline</h1>
          <p className="text-[#6B6B6B]">Journey through preserved memories across the decades</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={selectedSenior} onValueChange={setSelectedSenior}>
            <SelectTrigger className="w-[180px] border-[#E8DFD5]">
              <User className="w-4 h-4 mr-2 text-[#6B6B6B]" />
              <SelectValue placeholder="All Seniors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Seniors</SelectItem>
              {seniors.map(senior => (
                <SelectItem key={senior.id} value={senior.id}>
                  {senior.nickname || senior.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedChapter} onValueChange={setSelectedChapter}>
            <SelectTrigger className="w-[180px] border-[#E8DFD5]">
              <Filter className="w-4 h-4 mr-2 text-[#6B6B6B]" />
              <SelectValue placeholder="Life Chapter" />
            </SelectTrigger>
            <SelectContent>
              {lifeChapters.map(chapter => (
                <SelectItem key={chapter} value={chapter}>
                  {chapter === 'all' ? 'All Chapters' : chapter.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredStories.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white rounded-2xl border border-[#E8DFD5]"
        >
          <div className="w-20 h-20 bg-[#F5EDE6] rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-[#C4785A]" />
          </div>
          <h2 className="font-serif text-2xl text-[#3D3D3D] mb-3">No stories yet</h2>
          <p className="text-[#6B6B6B] mb-6 max-w-md mx-auto">
            Start an interview session to capture your first story
          </p>
          <Link to={createPageUrl('Interview')}>
            <Button className="bg-[#C4785A] hover:bg-[#A86045] text-white rounded-full px-8">
              Start First Interview
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C4785A] via-[#8FAE8B] to-[#D4A5A5]" />

          {sortedDecades.map((decade, decadeIndex) => (
            <div key={decade} className="mb-12">
              {/* Decade marker */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: decadeIndex * 0.1 }}
                className="relative flex items-center mb-6"
              >
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 -translate-x-1/2">
                  <div className="w-12 h-12 rounded-full bg-[#C4785A] flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">
                      {decade === 'Unknown' ? '?' : `${decade}s`}
                    </span>
                  </div>
                </div>
                <div className="ml-16 md:ml-0 md:text-center md:w-full">
                  <h2 className="font-serif text-xl text-[#3D3D3D] md:hidden">
                    {decade === 'Unknown' ? 'Undated Stories' : `The ${decade}s`}
                  </h2>
                </div>
              </motion.div>

              {/* Stories for this decade */}
              <div className="space-y-6 ml-12 md:ml-0">
                {groupedByDecade[decade].map((story, storyIndex) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, x: storyIndex % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: decadeIndex * 0.1 + storyIndex * 0.05 }}
                    className={`md:w-[calc(50%-2rem)] ${storyIndex % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}
                  >
                    <Link 
                      to={createPageUrl(`StoryDetail?id=${story.id}`)}
                      className="block bg-white rounded-2xl border border-[#E8DFD5] overflow-hidden hover:shadow-lg hover:border-[#C4785A]/30 transition-all duration-300 group"
                    >
                      {story.generated_images?.[0]?.url && (
                        <div className="aspect-video overflow-hidden bg-[#F5EDE6]">
                          <img 
                            src={story.generated_images[0].url} 
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-xs px-2 py-1 rounded-full border ${chapterColors[story.life_chapter] || chapterColors.other}`}>
                            {story.life_chapter?.replace('_', ' ') || 'Memory'}
                          </span>
                          <span className="text-xs text-[#6B6B6B]">
                            {getSeniorName(story.senior_id)}
                          </span>
                        </div>
                        
                        <h3 className="font-serif text-lg text-[#3D3D3D] mb-2 group-hover:text-[#C4785A] transition-colors">
                          {story.title}
                        </h3>
                        
                        <p className="text-[#6B6B6B] text-sm line-clamp-2 mb-3">
                          {story.summary || story.full_content?.substring(0, 150)}
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
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}