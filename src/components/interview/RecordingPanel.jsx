import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Pause, Play, Square, Volume2, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { geminiClient } from '../../api/geminiClient';

export default function RecordingPanel({ 
  isRecording, 
  onStartRecording, 
  onStopRecording, 
  onTranscriptUpdate,
  senior,
  onAISuggestion,
  topicFocus
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [lastAnalyzedText, setLastAnalyzedText] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  
  const timerRef = useRef(null);
  const analyzeTimeoutRef = useRef(null);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      return;
    }
    setRecognitionSupported(true);
  }, []);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
        setAudioLevel(Math.random() * 100);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setAudioLevel(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  const analyzeConversation = async (text) => {
    if (text.length < 50 || text === lastAnalyzedText) return;
    
    setAnalyzing(true);
    setLastAnalyzedText(text);

    const prompt = `You are an interview assistant helping conduct a gentle interview with a senior${senior?.name ? ` named ${senior.name}` : ''}.

Interview Topic Focus: ${topicFocus || 'General life stories'}

Recent conversation transcript:
"${text.slice(-500)}"

${senior?.dementia_considerations ? `Important considerations: ${senior.dementia_considerations}` : ''}
${senior?.favorite_topics?.length ? `Topics they enjoy: ${senior.favorite_topics.join(', ')}` : ''}

Based on this conversation, provide ONE helpful prompt for the interviewer related to the topic focus. Consider:
1. If they're struggling to remember, suggest a sensory prompt (smell, sound, touch)
2. If they mentioned something interesting about the topic, suggest a follow-up
3. If they drift from the topic, gently redirect
4. Keep prompts gentle and open-ended

Return just the prompt text, nothing else. Make it natural and conversational.`;

    const response = await geminiClient.generateText(prompt);
    
    if (response) {
      onAISuggestion({
        text: response,
        type: 'follow_up'
      });
    }

    setAnalyzing(false);
  };

  const startRecording = () => {
    setDuration(0);
    setLiveTranscript('');
    onStartRecording();
    
    // Manual transcription simulation
    const simulateTranscription = setInterval(() => {
      if (!isRecording || isPaused) {
        clearInterval(simulateTranscription);
        return;
      }
      const newText = "They were telling me about their childhood... ";
      setLiveTranscript(prev => prev + newText);
      onTranscriptUpdate(newText);
      
      if (analyzeTimeoutRef.current) clearTimeout(analyzeTimeoutRef.current);
      analyzeTimeoutRef.current = setTimeout(() => {
        analyzeConversation(liveTranscript + newText);
      }, 5000);
    }, 3000);
  };

  const stopRecording = () => {
    onStopRecording();
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8DFD5] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isRecording ? 'bg-red-500' : 'bg-[#C4785A]'
          }`}>
            {isRecording ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Mic className="w-4 h-4 text-white" />
              </motion.div>
            ) : (
              <MicOff className="w-4 h-4 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-[#3D3D3D]">
              {isRecording ? 'Recording' : 'Voice Recording'}
            </h3>
            {isRecording && (
              <p className="text-sm text-[#6B6B6B]">{formatDuration(duration)}</p>
            )}
          </div>
        </div>

        {analyzing && (
          <div className="flex items-center gap-2 text-[#8FAE8B]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">Analyzing...</span>
          </div>
        )}
      </div>

      {isRecording && (
        <div className="mb-4">
          <div className="flex items-center gap-1 h-8 justify-center">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-[#C4785A] rounded-full"
                animate={{
                  height: isPaused ? 4 : Math.max(4, (audioLevel / 100) * 32 * Math.random())
                }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
          >
            <Mic className="w-4 h-4 mr-2" />
            Start Recording
          </Button>
        ) : (
          <>
            <Button
              onClick={togglePause}
              variant="outline"
              className="flex-1 border-[#E8DFD5]"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              )}
            </Button>
            <Button
              onClick={stopRecording}
              className="flex-1 bg-[#3D3D3D] hover:bg-[#2D2D2D] text-white"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          </>
        )}
      </div>

      {!recognitionSupported && (
        <p className="text-xs text-[#6B6B6B] mt-3 text-center">
          Voice transcription not available in this browser. You can still type notes manually.
        </p>
      )}

      {recognitionSupported && (
        <p className="text-xs text-[#6B6B6B] mt-3 text-center">
          🎙️ Speech is automatically transcribed and AI analyzes for prompts
        </p>
      )}
    </div>
  );
}