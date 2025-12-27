import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockEntities, geminiClient } from '../api/geminiClient';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Loader2, MessageCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import InterviewHeader from '../components/interview/InterviewHeader';
import AIPromptSuggestions from '../components/interview/AIPromptSuggestions';
import ConversationNotes from '../components/interview/ConversationNotes';
import ImageGenerator from '../components/interview/ImageGenerator';
import BreakModal from '../components/interview/BreakModal';
import EndSessionModal from '../components/interview/EndSessionModal';
import RecordingPanel from '../components/interview/RecordingPanel';
import LiveAISuggestion from '../components/interview/LiveAISuggestion';

export default function Interview() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedSeniorId = urlParams.get('senior');

  const [selectedSeniorId, setSelectedSeniorId] = useState(preselectedSeniorId || '');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [topicFocus, setTopicFocus] = useState('');
  const [showTopicStep, setShowTopicStep] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [duration, setDuration] = useState(0);
  const [notes, setNotes] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [breaksCount, setBreaksCount] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [liveAISuggestion, setLiveAISuggestion] = useState(null);
  
  const timerRef = useRef(null);

  const { data: seniors = [], isLoading } = useQuery({
    queryKey: ['seniors'],
    queryFn: () => mockEntities.Senior.list()
  });

  const selectedSenior = seniors.find(s => s.id === selectedSeniorId);

  // Timer
  useEffect(() => {
    if (sessionStarted && !isPaused && !showBreakModal) {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionStarted, isPaused, showBreakModal]);

  const createSessionMutation = useMutation({
    mutationFn: async ({ sessionData, storyData }) => {
      // Create the story
      const story = await mockEntities.Story.create({
        senior_id: selectedSeniorId,
        ...storyData
      });

      // Create the session record
      await mockEntities.InterviewSession.create({
        senior_id: selectedSeniorId,
        interviewer_name: 'Family Member',
        session_date: new Date().toISOString().split('T')[0],
        ...sessionData,
        stories_created: [story.id],
        breaks_taken: breaksCount,
        status: 'completed'
      });

      return story;
    },
    onSuccess: (story) => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      navigate(createPageUrl(`StoryDetail?id=${story.id}`));
    }
  });

  const startSessionWithTopic = () => {
    setSessionStarted(true);
    setShowTopicStep(false);
    setDuration(0);
  };

  const handleBreak = () => {
    setShowBreakModal(true);
    setBreaksCount(prev => prev + 1);
  };

  const handleResumeFromBreak = () => {
    setShowBreakModal(false);
  };

  const handleImageGenerated = (image) => {
    setGeneratedImages(prev => [...prev, image]);
  };

  const handleSaveSession = async (data) => {
    await createSessionMutation.mutateAsync(data);
  };

  const handleTranscriptUpdate = (text) => {
    setNotes(prev => prev + text);
  };

  const handleAISuggestion = (suggestion) => {
    setLiveAISuggestion(suggestion);
  };

  const dismissSuggestion = () => {
    setLiveAISuggestion(null);
  };

  const useSuggestion = (text) => {
    setCurrentPrompt(text);
    setLiveAISuggestion(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C4785A] animate-spin" />
      </div>
    );
    }

    // Topic Selection Step
    if (showTopicStep) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Link 
          to={createPageUrl('Home')} 
          className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#C4785A] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#E8DFD5] p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#F5EDE6] rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-[#C4785A]" />
            </div>
            <h1 className="font-serif text-2xl md:text-3xl text-[#3D3D3D] mb-2">What story will you explore today?</h1>
            <p className="text-[#6B6B6B]">Tell me what topic or time period you'd like to focus on</p>
          </div>

          <div className="space-y-4 mb-6">
            <label className="text-sm font-medium text-[#3D3D3D] block">
              Interview Topic or Focus
            </label>
            <textarea
              value={topicFocus}
              onChange={(e) => setTopicFocus(e.target.value)}
              placeholder="e.g., 'Their childhood in Poland', 'How they met their spouse', 'Their first job', 'Growing up during the war'..."
              className="w-full p-4 border border-[#E8DFD5] rounded-xl resize-none h-32 focus:outline-none focus:ring-2 focus:ring-[#C4785A]"
            />
          </div>

          {selectedSenior?.favorite_topics && (
            <div className="mb-6">
              <p className="text-sm text-[#6B6B6B] mb-2">They love talking about:</p>
              <div className="flex flex-wrap gap-2">
                {selectedSenior.favorite_topics.map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTopicFocus(topic)}
                    className="px-3 py-1 bg-[#F5EDE6] text-[#6B6B6B] rounded-full text-sm hover:bg-[#C4785A] hover:text-white transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => setShowTopicStep(false)}
              variant="outline"
              className="flex-1 border-[#E8DFD5]"
            >
              Back
            </Button>
            <Button
              onClick={startSessionWithTopic}
              className="flex-1 bg-[#C4785A] hover:bg-[#A86045] text-white"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Interview
            </Button>
          </div>
        </motion.div>
      </div>
    );
    }

    // Pre-session: Senior Selection
    if (!sessionStarted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Link 
          to={createPageUrl('Home')} 
          className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#C4785A] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#E8DFD5] p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#F5EDE6] rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-[#C4785A]" />
            </div>
            <h1 className="font-serif text-2xl md:text-3xl text-[#3D3D3D] mb-2">Start an Interview</h1>
            <p className="text-[#6B6B6B]">Select who you'll be interviewing today</p>
          </div>

          {seniors.length === 0 ? (
            <div className="text-center py-8 bg-[#FFF8E8] rounded-xl">
              <AlertCircle className="w-10 h-10 text-[#8B6914] mx-auto mb-3" />
              <p className="text-[#3D3D3D] mb-4">No seniors added yet</p>
              <Link to={createPageUrl('AddSenior')}>
                <Button className="bg-[#C4785A] hover:bg-[#A86045] text-white rounded-full">
                  Add a Senior First
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-[#3D3D3D] mb-2 block">
                  Select Senior
                </label>
                <Select value={selectedSeniorId} onValueChange={setSelectedSeniorId}>
                  <SelectTrigger className="w-full border-[#E8DFD5]">
                    <SelectValue placeholder="Choose who to interview..." />
                  </SelectTrigger>
                  <SelectContent>
                    {seniors.map(senior => (
                      <SelectItem key={senior.id} value={senior.id}>
                        <div className="flex items-center gap-2">
                          {senior.photo_url ? (
                            <img src={senior.photo_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-[#C4785A]" />
                          )}
                          {senior.nickname || senior.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSenior && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#F5EDE6] rounded-xl p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white">
                      {selectedSenior.photo_url ? (
                        <img src={selectedSenior.photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-8 h-8 text-[#C4785A]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-[#3D3D3D]">
                        {selectedSenior.nickname || selectedSenior.name}
                      </h3>
                      {selectedSenior.favorite_topics?.length > 0 && (
                        <p className="text-sm text-[#6B6B6B] mt-1">
                          Loves to talk about: {selectedSenior.favorite_topics.slice(0, 3).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedSenior.notes && (
                    <div className="mt-3 p-3 bg-white/70 rounded-lg">
                      <p className="text-sm text-[#6B6B6B]">
                        <strong className="text-[#C4785A]">Note:</strong> {selectedSenior.notes}
                      </p>
                    </div>
                  )}

                  {selectedSenior.dementia_considerations && (
                    <div className="mt-3 p-3 bg-[#E8FFF0] rounded-lg border border-[#B4FFB8]">
                      <p className="text-sm text-[#148B1A]">
                        <strong>Care notes:</strong> {selectedSenior.dementia_considerations}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              <Button
                onClick={() => setShowTopicStep(true)}
                disabled={!selectedSeniorId}
                className="w-full bg-[#C4785A] hover:bg-[#A86045] text-white rounded-full py-6 text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Begin Interview Session
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // Active Session
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <InterviewHeader
        senior={selectedSenior}
        duration={duration}
        isPaused={isPaused}
        onPause={() => setIsPaused(true)}
        onResume={() => setIsPaused(false)}
        onBreak={handleBreak}
        onEnd={() => setShowEndModal(true)}
      />

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        {/* Main Notes Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live AI Suggestion */}
          {liveAISuggestion && (
            <LiveAISuggestion
              suggestion={liveAISuggestion}
              onDismiss={dismissSuggestion}
              onUse={useSuggestion}
            />
          )}
          
          <ConversationNotes notes={notes} onNotesChange={setNotes} />
        </div>

        {/* Sidebar Tools */}
        <div className="space-y-6">
          {/* Recording Panel */}
          <RecordingPanel
            isRecording={isRecording}
            onStartRecording={() => setIsRecording(true)}
            onStopRecording={() => setIsRecording(false)}
            onTranscriptUpdate={handleTranscriptUpdate}
            senior={selectedSenior}
            onAISuggestion={handleAISuggestion}
            topicFocus={topicFocus}
          />
          
          <AIPromptSuggestions
            senior={selectedSenior}
            currentTopic={currentPrompt}
            recentConversation={notes.slice(-200)}
            onSelectPrompt={setCurrentPrompt}
            topicFocus={topicFocus}
          />

          <ImageGenerator
            onImageGenerated={handleImageGenerated}
            contextHint={notes.slice(-100)}
          />

          {/* Current Prompt Display */}
          {currentPrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#C4785A] text-white rounded-2xl p-5"
            >
              <p className="text-sm opacity-80 mb-2">Try asking:</p>
              <p className="font-medium">"{currentPrompt}"</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      <BreakModal
        isOpen={showBreakModal}
        onClose={() => setShowBreakModal(false)}
        onResume={handleResumeFromBreak}
      />

      <EndSessionModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        senior={selectedSenior}
        notes={notes}
        duration={duration}
        generatedImages={generatedImages}
        onSaveSession={handleSaveSession}
      />
    </div>
  );
}