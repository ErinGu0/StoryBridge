import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockEntities } from '../api/geminiClient';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, User, MapPin, Calendar, BookOpen, MessageCircle, 
  AlertCircle, Heart, Loader2, Edit
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function SeniorProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const seniorId = urlParams.get('id');

  const { data: senior, isLoading: loadingSenior } = useQuery({
    queryKey: ['senior', seniorId],
    queryFn: () => mockEntities.Senior.filter({ id: seniorId }),
    enabled: !!seniorId,
    select: (data) => data[0]
  });

  const { data: stories = [] } = useQuery({
    queryKey: ['stories', seniorId],
    queryFn: () => mockEntities.Story.filter({ senior_id: seniorId }),
    enabled: !!seniorId
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions', seniorId],
    queryFn: () => mockEntities.InterviewSession.filter({ senior_id: seniorId }),
    enabled: !!seniorId
  });

  if (loadingSenior) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C4785A] animate-spin" />
      </div>
    );
  }

  if (!senior) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="font-serif text-2xl text-[#3D3D3D] mb-4">Senior not found</h1>
        <Link to={createPageUrl('Seniors')}>
          <Button className="bg-[#C4785A] hover:bg-[#A86045]">
            Back to Seniors
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link 
        to={createPageUrl('Seniors')} 
        className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#C4785A] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Seniors
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-[#E8DFD5] overflow-hidden"
      >
        {/* Header */}
        <div className="relative h-48 bg-gradient-to-br from-[#C4785A] via-[#D4896A] to-[#E8A98A]">
          <div className="absolute -bottom-16 left-6">
            <div className="w-32 h-32 rounded-2xl border-4 border-white bg-[#F5EDE6] overflow-hidden shadow-lg">
              {senior.photo_url ? (
                <img src={senior.photo_url} alt={senior.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-12 h-12 text-[#C4785A]" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-20 pb-6 px-6">
          {/* Name & Basic Info */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="font-serif text-3xl text-[#3D3D3D]">
                {senior.nickname || senior.name}
              </h1>
              {senior.nickname && senior.nickname !== senior.name && (
                <p className="text-[#6B6B6B]">{senior.name}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-2 text-[#6B6B6B]">
                {senior.birth_year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Born {senior.birth_year}
                  </span>
                )}
                {senior.birth_place && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {senior.birth_place}
                  </span>
                )}
              </div>
            </div>
            
            <Link to={createPageUrl(`Interview?senior=${seniorId}`)}>
              <Button className="bg-[#C4785A] hover:bg-[#A86045] text-white rounded-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Interview
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#F5EDE6] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#C4785A]">{stories.length}</p>
              <p className="text-sm text-[#6B6B6B]">Stories</p>
            </div>
            <div className="bg-[#F5EDE6] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#8FAE8B]">{sessions.length}</p>
              <p className="text-sm text-[#6B6B6B]">Sessions</p>
            </div>
            <div className="bg-[#F5EDE6] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#D4A5A5]">
                {Math.round(sessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0))}
              </p>
              <p className="text-sm text-[#6B6B6B]">Minutes</p>
            </div>
          </div>

          {/* Favorite Topics */}
          {senior.favorite_topics?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-[#3D3D3D] mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#C4785A]" />
                Favorite Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {senior.favorite_topics.map((topic) => (
                  <Badge key={topic} className="bg-[#E8A98A]/20 text-[#C4785A] border-none">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {senior.notes && (
            <div className="mb-6 bg-[#FFF8E8] rounded-xl p-4 border border-[#FFE5B4]">
              <h3 className="font-medium text-[#3D3D3D] mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#8B6914]" />
                Important Notes for Interviewers
              </h3>
              <p className="text-[#6B6B6B] text-sm">{senior.notes}</p>
            </div>
          )}

          {/* Dementia Considerations */}
          {senior.dementia_considerations && (
            <div className="mb-6 bg-[#E8FFF0] rounded-xl p-4 border border-[#B4FFB8]">
              <h3 className="font-medium text-[#3D3D3D] mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#148B1A]" />
                Dementia Care Considerations
              </h3>
              <p className="text-[#6B6B6B] text-sm">{senior.dementia_considerations}</p>
            </div>
          )}

          {/* Recent Stories */}
          {stories.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-[#3D3D3D] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#C4785A]" />
                  Stories
                </h3>
                <Link 
                  to={createPageUrl(`Stories`)} 
                  className="text-sm text-[#C4785A] hover:text-[#A86045]"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {stories.slice(0, 5).map((story) => (
                  <Link
                    key={story.id}
                    to={createPageUrl(`StoryDetail?id=${story.id}`)}
                    className="block p-4 bg-[#F5EDE6] rounded-xl hover:bg-[#EDE5DD] transition-colors"
                  >
                    <h4 className="font-medium text-[#3D3D3D]">{story.title}</h4>
                    {story.summary && (
                      <p className="text-sm text-[#6B6B6B] mt-1 line-clamp-2">{story.summary}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}