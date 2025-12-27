import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockEntities } from '../api/geminiClient';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { UserPlus, Users, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import SeniorCard from '../components/seniors/SeniorCard';

export default function Seniors() {
  const { data: seniors = [], isLoading } = useQuery({
    queryKey: ['seniors'],
    queryFn: () => mockEntities.Senior.list()
  });

  const { data: stories = [] } = useQuery({
    queryKey: ['stories'],
    queryFn: () => mockEntities.Story.list()
  });

  const getStoriesCount = (seniorId) => {
    return stories.filter(s => s.senior_id === seniorId).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C4785A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#3D3D3D] mb-2">Our Seniors</h1>
          <p className="text-[#6B6B6B]">The wonderful people whose stories we're preserving</p>
        </div>
        <Link to={createPageUrl('AddSenior')}>
          <Button className="bg-[#C4785A] hover:bg-[#A86045] text-white rounded-full px-6">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Senior
          </Button>
        </Link>
      </div>

      {seniors.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white rounded-2xl border border-[#E8DFD5]"
        >
          <div className="w-20 h-20 bg-[#F5EDE6] rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-[#C4785A]" />
          </div>
          <h2 className="font-serif text-2xl text-[#3D3D3D] mb-3">No seniors added yet</h2>
          <p className="text-[#6B6B6B] mb-6 max-w-md mx-auto">
            Start by adding a family member whose stories you'd like to preserve
          </p>
          <Link to={createPageUrl('AddSenior')}>
            <Button className="bg-[#C4785A] hover:bg-[#A86045] text-white rounded-full px-8">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Your First Senior
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {seniors.map((senior, index) => (
            <SeniorCard 
              key={senior.id} 
              senior={senior} 
              storiesCount={getStoriesCount(senior.id)}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}