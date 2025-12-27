import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockEntities } from '../api/geminiClient';
import WelcomeHero from '../components/dashboard/WelcomeHero';
import QuickStats from '../components/dashboard/QuickStats';
import QuickActions from '../components/dashboard/QuickActions';
import RecentStories from '../components/dashboard/RecentStories';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { data: seniors = [], isLoading: loadingSeniors } = useQuery({
    queryKey: ['seniors'],
    queryFn: () => mockEntities.Senior.list()
  });

  const { data: stories = [], isLoading: loadingStories } = useQuery({
    queryKey: ['stories'],
    queryFn: () => mockEntities.Story.list('-created_date', 20)
  });

  const { data: sessions = [], isLoading: loadingSessions } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => mockEntities.InterviewSession.list()
  });

  const isLoading = loadingSeniors || loadingStories || loadingSessions;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C4785A] animate-spin mx-auto mb-4" />
          <p className="text-[#6B6B6B]">Loading your stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <WelcomeHero />
      <QuickStats seniors={seniors} stories={stories} sessions={sessions} />
      <QuickActions />
      <RecentStories stories={stories} seniors={seniors} />
    </div>
  );
}