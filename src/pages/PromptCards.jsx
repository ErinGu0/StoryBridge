import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockEntities } from '../api/geminiClient';
import { motion } from 'framer-motion';
import { Sparkles, Filter, Plus, Loader2, Shuffle, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import PromptCardDisplay from '../components/prompts/PromptCard';

const categories = [
  'all', 'childhood', 'family', 'career', 'love', 'adventures', 
  'traditions', 'heirlooms', 'music', 'food', 'challenges', 'wisdom'
];

export default function PromptCards() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dementiaOnly, setDementiaOnly] = useState(false);
  const [randomPrompt, setRandomPrompt] = useState(null);
  const queryClient = useQueryClient();

  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ['prompts'],
    queryFn: () => mockEntities.PromptCard.list()
  });

  const generatePromptsMutation = useMutation({
    mutationFn: async () => {
      const defaultPrompts = [
        {
          category: 'childhood',
          prompt_text: "What games did you play as a child?",
          follow_up_prompts: ["Who did you play with?", "Where was your favorite place to play?"],
          tips_for_interviewer: "If they mention toys, ask them to describe what they looked like",
          dementia_friendly: true,
          sensory_triggers: ["Old photos of toys", "Children's songs from their era"]
        },
        {
          category: 'childhood',
          prompt_text: "Tell me about your school. What was it like?",
          follow_up_prompts: ["Who was your favorite teacher?", "Did you walk to school?"],
          tips_for_interviewer: "School buildings and uniforms can trigger vivid memories",
          dementia_friendly: true,
          sensory_triggers: ["School bells", "Chalk smell"]
        },
        {
          category: 'family',
          prompt_text: "What did a typical Sunday look like in your family?",
          follow_up_prompts: ["Who prepared the meals?", "Did you have family traditions?"],
          tips_for_interviewer: "Family gatherings often bring back strong memories",
          dementia_friendly: true,
          sensory_triggers: ["Sunday dinner smells", "Church bells"]
        },
        {
          category: 'love',
          prompt_text: "How did you meet your spouse or partner?",
          follow_up_prompts: ["What was your first date like?", "When did you know they were special?"],
          tips_for_interviewer: "Love stories often bring joy - watch for smiles",
          dementia_friendly: true,
          sensory_triggers: ["Wedding photos", "Songs from their dating years"]
        },
        {
          category: 'career',
          prompt_text: "What was your first job? How did you get it?",
          follow_up_prompts: ["How much did you earn?", "What did you spend your first paycheck on?"],
          tips_for_interviewer: "Early work experiences often stay vivid",
          dementia_friendly: true,
          sensory_triggers: ["Old currency", "Work tools from their profession"]
        },
        {
          category: 'food',
          prompt_text: "What was your favorite meal growing up? Who made it best?",
          follow_up_prompts: ["Do you remember the recipe?", "What occasions was it made for?"],
          tips_for_interviewer: "Food memories are among the strongest - use this often",
          dementia_friendly: true,
          sensory_triggers: ["Cooking smells", "Old family recipes"]
        },
        {
          category: 'music',
          prompt_text: "What songs remind you of your younger days?",
          follow_up_prompts: ["Did you dance?", "Did you have a record player?"],
          tips_for_interviewer: "Consider playing the songs if they can name them",
          dementia_friendly: true,
          sensory_triggers: ["Music from 1940s-1960s", "Radio programs"]
        },
        {
          category: 'traditions',
          prompt_text: "What holidays were most special in your family?",
          follow_up_prompts: ["What decorations did you have?", "What foods were traditional?"],
          tips_for_interviewer: "Holiday memories often trigger detailed recollections",
          dementia_friendly: true,
          sensory_triggers: ["Holiday decorations", "Seasonal foods"]
        },
        {
          category: 'adventures',
          prompt_text: "What's the furthest you've ever traveled? Tell me about that trip.",
          follow_up_prompts: ["How did you get there?", "What surprised you most?"],
          tips_for_interviewer: "Travel stories often have rich details",
          dementia_friendly: true,
          sensory_triggers: ["Old travel photos", "Maps"]
        },
        {
          category: 'wisdom',
          prompt_text: "What's the best advice you ever received? Who gave it to you?",
          follow_up_prompts: ["Did you follow it?", "What advice would you give young people?"],
          tips_for_interviewer: "This validates their life experience",
          dementia_friendly: true,
          sensory_triggers: ["Photos of mentors", "Old letters"]
        },
        {
          category: 'heirlooms',
          prompt_text: "Is there an object in your family that has been passed down? What's its story?",
          follow_up_prompts: ["Where did it come from?", "Who will receive it next?"],
          tips_for_interviewer: "If possible, have them hold or see the object",
          dementia_friendly: true,
          sensory_triggers: ["Family heirlooms", "Old photographs"]
        },
        {
          category: 'challenges',
          prompt_text: "What's a difficult time you overcame? How did you get through it?",
          follow_up_prompts: ["Who helped you?", "What did you learn?"],
          tips_for_interviewer: "Be gentle - offer to skip if they seem distressed",
          dementia_friendly: false,
          sensory_triggers: []
        }
      ];
      await mockEntities.PromptCard.bulkCreate(defaultPrompts);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    }
  });

  const filteredPrompts = prompts.filter(p => {
    const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory;
    const dementiaMatch = !dementiaOnly || p.dementia_friendly;
    return categoryMatch && dementiaMatch;
  });

  const pickRandomPrompt = () => {
    if (filteredPrompts.length > 0) {
      const random = filteredPrompts[Math.floor(Math.random() * filteredPrompts.length)];
      setRandomPrompt(random);
    }
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#3D3D3D] mb-2">Conversation Prompts</h1>
          <p className="text-[#6B6B6B]">Gentle questions to spark memories and stories</p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={pickRandomPrompt}
            className="bg-[#8FAE8B] hover:bg-[#7A9A76] text-white rounded-full"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Random Prompt
          </Button>
          {prompts.length === 0 && (
            <Button 
              onClick={() => generatePromptsMutation.mutate()}
              disabled={generatePromptsMutation.isPending}
              className="bg-[#C4785A] hover:bg-[#A86045] text-white rounded-full"
            >
              {generatePromptsMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Generate Starter Prompts
            </Button>
          )}
        </div>
      </div>

      {/* Random Prompt Highlight */}
      {randomPrompt && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-[#C4785A] to-[#E8A98A] rounded-2xl p-6 mb-8 text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Try this prompt</span>
          </div>
          <p className="text-xl font-medium mb-2">"{randomPrompt.prompt_text}"</p>
          <span className="text-sm opacity-80">Category: {randomPrompt.category}</span>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[200px]">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="flex-wrap h-auto bg-[#F5EDE6] p-1 rounded-xl">
              {categories.slice(0, 7).map(cat => (
                <TabsTrigger 
                  key={cat} 
                  value={cat}
                  className="data-[state=active]:bg-white data-[state=active]:text-[#C4785A] rounded-lg capitalize text-sm"
                >
                  {cat === 'all' ? 'All' : cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        <Button
          variant={dementiaOnly ? "default" : "outline"}
          onClick={() => setDementiaOnly(!dementiaOnly)}
          className={`rounded-full ${dementiaOnly ? 'bg-[#8FAE8B] hover:bg-[#7A9A76]' : 'border-[#8FAE8B] text-[#8FAE8B] hover:bg-[#8FAE8B]/10'}`}
        >
          <Heart className="w-4 h-4 mr-2" />
          Dementia-Friendly Only
        </Button>
      </div>

      {/* More Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.slice(7).map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            onClick={() => setSelectedCategory(cat)}
            size="sm"
            className={`rounded-full capitalize ${
              selectedCategory === cat 
                ? 'bg-[#C4785A] hover:bg-[#A86045]' 
                : 'border-[#E8DFD5] text-[#6B6B6B] hover:bg-[#F5EDE6]'
            }`}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Prompts Grid */}
      {prompts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white rounded-2xl border border-[#E8DFD5]"
        >
          <div className="w-20 h-20 bg-[#F5EDE6] rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-[#C4785A]" />
          </div>
          <h2 className="font-serif text-2xl text-[#3D3D3D] mb-3">No prompts yet</h2>
          <p className="text-[#6B6B6B] mb-6 max-w-md mx-auto">
            Generate a starter set of conversation prompts to help guide your interviews
          </p>
          <Button 
            onClick={() => generatePromptsMutation.mutate()}
            disabled={generatePromptsMutation.isPending}
            className="bg-[#C4785A] hover:bg-[#A86045] text-white rounded-full px-8"
          >
            {generatePromptsMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Generate Starter Prompts
          </Button>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredPrompts.map((prompt, index) => (
            <PromptCardDisplay key={prompt.id} prompt={prompt} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}