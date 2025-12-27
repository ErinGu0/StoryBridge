import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { MessageCircle, UserPlus, Sparkles, BookOpen, GraduationCap } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      title: 'Start Interview',
      description: 'Begin a new storytelling session',
      icon: MessageCircle,
      page: 'Interview',
      color: 'from-[#C4785A] to-[#E8A98A]'
    },
    {
      title: 'Add Senior',
      description: 'Register a new family member',
      icon: UserPlus,
      page: 'AddSenior',
      color: 'from-[#8FAE8B] to-[#B8D4B4]'
    },
    {
      title: 'Browse Prompts',
      description: 'Find conversation starters',
      icon: Sparkles,
      page: 'PromptCards',
      color: 'from-[#D4A5A5] to-[#E8C4C4]'
    },
    {
      title: 'Training',
      description: 'Learn interview techniques',
      icon: GraduationCap,
      page: 'Training',
      color: 'from-[#7B9EBD] to-[#A5C4DD]'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              to={createPageUrl(action.page)}
              className="block p-5 rounded-2xl bg-white border border-[#E8DFD5] hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-[#3D3D3D] mb-1">{action.title}</h3>
              <p className="text-sm text-[#6B6B6B]">{action.description}</p>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}