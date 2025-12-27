import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Clock, Sparkles } from 'lucide-react';

export default function QuickStats({ seniors = [], stories = [], sessions = [] }) {
  const stats = [
    {
      label: 'Seniors',
      value: seniors.length,
      icon: Users,
      color: 'bg-[#8FAE8B]',
      lightColor: 'bg-[#B8D4B4]/20'
    },
    {
      label: 'Stories Captured',
      value: stories.length,
      icon: BookOpen,
      color: 'bg-[#C4785A]',
      lightColor: 'bg-[#E8A98A]/20'
    },
    {
      label: 'Interview Hours',
      value: Math.round(sessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) / 60),
      icon: Clock,
      color: 'bg-[#D4A5A5]',
      lightColor: 'bg-[#D4A5A5]/20'
    },
    {
      label: 'AI Images Created',
      value: stories.reduce((acc, s) => acc + (s.generated_images?.length || 0), 0),
      icon: Sparkles,
      color: 'bg-[#7B9EBD]',
      lightColor: 'bg-[#7B9EBD]/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`${stat.lightColor} rounded-2xl p-5 border border-white/50`}
          >
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-semibold text-[#3D3D3D]">{stat.value}</p>
            <p className="text-[#6B6B6B] text-sm mt-1">{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}