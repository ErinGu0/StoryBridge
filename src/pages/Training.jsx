import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, ChevronRight, ChevronLeft, BookOpen, Heart, 
  MessageCircle, Lightbulb, AlertCircle, Clock, Users, Eye, 
  Ear, Hand, Brain, CheckCircle, ExternalLink
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';

const modules = [
  {
    id: 'intro',
    title: 'Introduction to Memory Interviews',
    icon: BookOpen,
    color: 'from-[#C4785A] to-[#E8A98A]',
    slides: [
      {
        title: 'Welcome to StoryBridge Training',
        content: `You're about to learn how to conduct meaningful interviews that preserve precious memories. This training is based on research in reminiscence therapy, dementia care, and oral history preservation.`,
        keyPoints: [
          'Interviews should feel like natural conversations',
          'The goal is connection, not perfection',
          'Every story matters, no matter how small'
        ],
        research: 'Studies show that reminiscence activities improve quality of life and reduce depression in older adults (Woods et al., 2018)'
      },
      {
        title: 'Why This Matters',
        content: `Research consistently shows that grandparent-grandchild relationships benefit both generations. Sharing stories strengthens family bonds and gives seniors a sense of purpose and legacy.`,
        keyPoints: [
          'Grandchildren gain identity and resilience from family stories',
          'Seniors experience improved mood and cognitive engagement',
          'Families preserve cultural heritage and values'
        ],
        research: 'Intergenerational storytelling has been shown to improve self-esteem in both generations (Kaminski et al., 2023)'
      }
    ]
  },
  {
    id: 'dementia',
    title: 'Dementia-Friendly Communication',
    icon: Heart,
    color: 'from-[#8FAE8B] to-[#B8D4B4]',
    slides: [
      {
        title: 'Understanding Memory Changes',
        content: `People with dementia often retain long-term memories better than recent ones. This makes storytelling about the past an ideal activity - they may struggle to remember yesterday but vividly recall their childhood.`,
        keyPoints: [
          'Long-term memory is often preserved longer than short-term',
          'Emotional memories remain strong',
          'Procedural memories (how to do things) persist',
          'Sensory cues can unlock forgotten memories'
        ],
        research: 'Autobiographical memory retrieval activates emotional centers that remain functional in early-to-moderate dementia (Irish et al., 2011)'
      },
      {
        title: 'Communication Strategies',
        content: `Adapting your communication style can make a significant difference in how comfortable and engaged the person feels.`,
        keyPoints: [
          'Speak slowly and clearly, but not condescendingly',
          'Use simple, direct sentences',
          'Allow extra time for responses (up to 30 seconds)',
          'Focus on feelings rather than facts',
          'Accept their reality - don\'t correct or argue'
        ],
        tips: [
          { icon: Eye, text: 'Maintain gentle eye contact' },
          { icon: Ear, text: 'Listen more than you speak' },
          { icon: Hand, text: 'Offer a comforting touch if appropriate' },
          { icon: Brain, text: 'Watch for signs of fatigue or distress' }
        ]
      },
      {
        title: 'When Stories Get Confused',
        content: `It's common for people with dementia to mix up timelines, combine different memories, or repeat stories. This is okay - the emotional truth of the story matters more than factual accuracy.`,
        keyPoints: [
          'Don\'t correct or contradict',
          'Focus on the emotions being expressed',
          'Family can verify facts later',
          'Repeated stories are often the most meaningful ones',
          'Confusion is not failure - it\'s the nature of memory'
        ],
        research: 'Validation therapy shows that accepting the emotional reality of dementia patients reduces agitation and improves engagement (Neal & Barton Wright, 2003)'
      }
    ]
  },
  {
    id: 'sensory',
    title: 'Using Sensory Triggers',
    icon: Lightbulb,
    color: 'from-[#D4A5A5] to-[#E8C4C4]',
    slides: [
      {
        title: 'The Power of Sensory Memory',
        content: `Our senses are directly connected to memory centers in the brain. A familiar smell, sound, or texture can unlock memories that words alone cannot reach.`,
        keyPoints: [
          'Smell is the most powerful memory trigger',
          'Music from youth activates deep memories',
          'Touch and texture evoke procedural memories',
          'Photos work best when from their era, not recent'
        ],
        research: 'The olfactory bulb has direct connections to the amygdala and hippocampus, explaining why smells trigger vivid memories (Herz, 2016)'
      },
      {
        title: 'Practical Sensory Tools',
        content: `Build a "memory kit" with items that can help spark conversations and memories.`,
        items: [
          { category: 'Smells', examples: 'Lavender, coffee, baking spices, old books, perfume they wore' },
          { category: 'Sounds', examples: 'Music from 1940s-60s, radio shows, nature sounds, bells' },
          { category: 'Touch', examples: 'Fabrics (silk, wool), old tools, coins, jewelry' },
          { category: 'Taste', examples: 'Childhood foods, traditional recipes, familiar sweets' },
          { category: 'Sight', examples: 'Old photos, newspapers, magazines from their youth' }
        ]
      },
      {
        title: 'Music as Medicine',
        content: `Music is particularly powerful for people with dementia. Songs from ages 10-30 are often remembered even when other memories fade.`,
        keyPoints: [
          'Create a playlist of songs from their youth',
          'Play music before starting the interview',
          'Ask about songs at their wedding, dances, or school',
          'Humming or singing together can open up conversation'
        ],
        research: 'Music therapy in dementia care shows significant benefits for mood, behavior, and even temporary cognitive improvement (Svansdottir & Snaedal, 2006)'
      }
    ]
  },
  {
    id: 'prompting',
    title: 'Effective Prompting Techniques',
    icon: MessageCircle,
    color: 'from-[#7B9EBD] to-[#A5C4DD]',
    slides: [
      {
        title: 'Open vs. Closed Questions',
        content: `The way you phrase questions determines how much detail you'll receive. Open-ended questions invite stories; closed questions give yes/no answers.`,
        comparison: [
          { closed: 'Did you like school?', open: 'Tell me about your school days...' },
          { closed: 'Was your mother a good cook?', open: 'What did your kitchen smell like growing up?' },
          { closed: 'Did you travel much?', open: 'Take me on a journey you remember...' }
        ]
      },
      {
        title: 'The CARE Framework',
        content: `Use this framework when a senior is struggling to continue a story:`,
        framework: [
          { letter: 'C', word: 'Context', prompt: 'Where were you when this happened?' },
          { letter: 'A', word: 'Actions', prompt: 'What did you do next?' },
          { letter: 'R', word: 'Reactions', prompt: 'How did that make you feel?' },
          { letter: 'E', word: 'Environment', prompt: 'What could you see, hear, or smell?' }
        ]
      },
      {
        title: 'Real-Time Prompting Tips',
        content: `When using StoryBridge's AI prompting during recording, the system will suggest questions based on what's being discussed. Here's how to use them effectively:`,
        keyPoints: [
          'Wait for natural pauses before asking AI-suggested questions',
          'Adapt the suggested wording to sound natural',
          'If a prompt doesn\'t resonate, skip it - don\'t force it',
          'Sensory prompts (smells, sounds) often work when they\'re stuck',
          'When they repeat themselves, gently redirect with a new prompt'
        ]
      }
    ]
  },
  {
    id: 'session',
    title: 'Managing the Session',
    icon: Clock,
    color: 'from-[#9B8AA5] to-[#C4B8CE]',
    slides: [
      {
        title: 'Session Structure',
        content: `A well-structured session helps both you and the senior feel comfortable and prepared.`,
        structure: [
          { phase: 'Warm-up', time: '5 min', description: 'Chat casually, offer tea, look at photos together' },
          { phase: 'Opening', time: '2 min', description: 'Explain what you\'ll do today, ask permission to record' },
          { phase: 'Main Interview', time: '15-20 min', description: 'Follow the prompts, go where they lead' },
          { phase: 'Wind Down', time: '3 min', description: 'Thank them, summarize what you heard, preview next time' }
        ]
      },
      {
        title: 'Recognizing Fatigue',
        content: `Seniors, especially those with dementia, tire easily. Watch for these signs and take a break or end the session:`,
        signs: [
          'Increased confusion or agitation',
          'Repetitive movements or statements',
          'Looking away or closing eyes frequently',
          'Shorter answers or trailing off',
          'Physical signs: yawning, shifting, rubbing eyes'
        ],
        keyPoints: [
          'Keep sessions under 20-25 minutes',
          'Multiple short sessions are better than one long one',
          'End on a positive note',
          'Schedule for their best time of day (often morning)'
        ]
      },
      {
        title: 'Handling Difficult Emotions',
        content: `Stories may bring up sadness, grief, or difficult memories. This is normal and can be therapeutic.`,
        keyPoints: [
          'Allow silence and tears - don\'t rush to fix it',
          'Acknowledge their feelings: "That sounds really hard"',
          'Offer to pause or change topics if they prefer',
          'Have tissues available',
          'End with a happier memory if possible'
        ],
        research: 'Expressing emotions about past events, even sad ones, can be therapeutic and reduce anxiety (Pennebaker, 1997)'
      }
    ]
  }
];

export default function Training() {
  const [currentModule, setCurrentModule] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);

  const module = modules[currentModule];
  const slide = module.slides[currentSlide];
  const totalSlides = module.slides.length;
  const isLastSlide = currentSlide === totalSlides - 1;
  const isFirstSlide = currentSlide === 0;

  const nextSlide = () => {
    if (isLastSlide) {
      if (!completedModules.includes(module.id)) {
        setCompletedModules(prev => [...prev, module.id]);
      }
      if (currentModule < modules.length - 1) {
        setCurrentModule(prev => prev + 1);
        setCurrentSlide(0);
      }
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (isFirstSlide) {
      if (currentModule > 0) {
        setCurrentModule(prev => prev - 1);
        setCurrentSlide(modules[currentModule - 1].slides.length - 1);
      }
    } else {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const progress = ((currentModule * 100 + (currentSlide + 1) * (100 / totalSlides)) / modules.length);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C4785A] to-[#E8A98A] flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl text-[#3D3D3D]">Caregiver Training</h1>
            <p className="text-[#6B6B6B]">Research-based interview techniques</p>
          </div>
        </div>
        <Progress value={progress} className="h-2 mt-4" />
        <p className="text-sm text-[#6B6B6B] mt-2">
          Module {currentModule + 1} of {modules.length} • Slide {currentSlide + 1} of {totalSlides}
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Module Navigation */}
        <div className="lg:col-span-1">
          <Card className="border-[#E8DFD5]">
            <CardContent className="p-4">
              <h3 className="font-medium text-[#3D3D3D] mb-3">Modules</h3>
              <div className="space-y-2">
                {modules.map((mod, idx) => {
                  const Icon = mod.icon;
                  const isCompleted = completedModules.includes(mod.id);
                  const isCurrent = idx === currentModule;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => { setCurrentModule(idx); setCurrentSlide(0); }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        isCurrent 
                          ? 'bg-gradient-to-r ' + mod.color + ' text-white' 
                          : 'hover:bg-[#F5EDE6]'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isCurrent ? 'bg-white/20' : 'bg-[#F5EDE6]'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-[#8FAE8B]'}`} />
                        ) : (
                          <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-[#C4785A]'}`} />
                        )}
                      </div>
                      <span className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-[#3D3D3D]'}`}>
                        {mod.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Slide Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentModule}-${currentSlide}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-[#E8DFD5] overflow-hidden">
                {/* Slide Header */}
                <div className={`bg-gradient-to-r ${module.color} p-6 text-white`}>
                  <h2 className="font-serif text-2xl">{slide.title}</h2>
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Main Content */}
                  <p className="text-[#3D3D3D] text-lg leading-relaxed">{slide.content}</p>

                  {/* Key Points */}
                  {slide.keyPoints && (
                    <div className="bg-[#F5EDE6] rounded-xl p-5">
                      <h4 className="font-medium text-[#3D3D3D] mb-3">Key Points</h4>
                      <ul className="space-y-2">
                        {slide.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[#6B6B6B]">
                            <CheckCircle className="w-5 h-5 text-[#8FAE8B] flex-shrink-0 mt-0.5" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tips with Icons */}
                  {slide.tips && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {slide.tips.map((tip, idx) => {
                        const TipIcon = tip.icon;
                        return (
                          <div key={idx} className="text-center p-4 bg-[#E8FFF0] rounded-xl">
                            <TipIcon className="w-8 h-8 text-[#8FAE8B] mx-auto mb-2" />
                            <p className="text-sm text-[#3D3D3D]">{tip.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Question Comparison */}
                  {slide.comparison && (
                    <div className="space-y-3">
                      {slide.comparison.map((comp, idx) => (
                        <div key={idx} className="grid md:grid-cols-2 gap-3">
                          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                            <span className="text-xs text-red-600 font-medium">❌ Closed</span>
                            <p className="text-[#3D3D3D] mt-1">"{comp.closed}"</p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                            <span className="text-xs text-green-600 font-medium">✓ Open</span>
                            <p className="text-[#3D3D3D] mt-1">"{comp.open}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CARE Framework */}
                  {slide.framework && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {slide.framework.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 bg-[#F5EDE6] rounded-xl">
                          <div className="w-12 h-12 rounded-full bg-[#C4785A] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                            {item.letter}
                          </div>
                          <div>
                            <p className="font-medium text-[#3D3D3D]">{item.word}</p>
                            <p className="text-sm text-[#6B6B6B] mt-1">"{item.prompt}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Session Structure */}
                  {slide.structure && (
                    <div className="space-y-3">
                      {slide.structure.map((phase, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-[#F5EDE6] rounded-xl">
                          <div className="w-16 text-center">
                            <span className="text-sm font-medium text-[#C4785A]">{phase.time}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-[#3D3D3D]">{phase.phase}</p>
                            <p className="text-sm text-[#6B6B6B]">{phase.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Warning Signs */}
                  {slide.signs && (
                    <div className="bg-[#FFF8E8] rounded-xl p-5 border border-[#FFE5B4]">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-[#8B6914]" />
                        <h4 className="font-medium text-[#3D3D3D]">Watch for these signs</h4>
                      </div>
                      <ul className="space-y-2">
                        {slide.signs.map((sign, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[#6B6B6B]">
                            <span className="text-[#8B6914]">•</span>
                            {sign}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Sensory Items */}
                  {slide.items && (
                    <div className="space-y-3">
                      {slide.items.map((item, idx) => (
                        <div key={idx} className="p-4 bg-[#F5EDE6] rounded-xl">
                          <p className="font-medium text-[#C4785A]">{item.category}</p>
                          <p className="text-[#6B6B6B] text-sm mt-1">{item.examples}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Research Citation */}
                  {slide.research && (
                    <div className="flex items-start gap-3 p-4 bg-[#E8F0FF] rounded-xl border border-[#B4D4FF]">
                      <ExternalLink className="w-5 h-5 text-[#144A8B] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-[#144A8B] font-medium mb-1">Research Note</p>
                        <p className="text-sm text-[#3D3D3D]">{slide.research}</p>
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* Navigation */}
                <div className="border-t border-[#E8DFD5] p-4 flex justify-between">
                  <Button
                    onClick={prevSlide}
                    variant="outline"
                    disabled={currentModule === 0 && isFirstSlide}
                    className="border-[#E8DFD5]"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={nextSlide}
                    disabled={currentModule === modules.length - 1 && isLastSlide}
                    className="bg-[#C4785A] hover:bg-[#A86045] text-white"
                  >
                    {isLastSlide ? 'Next Module' : 'Next'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}