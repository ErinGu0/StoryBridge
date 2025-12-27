import React, { useState } from 'react';
import { Sparkles, RefreshCw, Loader2, ChevronRight, Lightbulb } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { geminiClient } from '../../api/geminiClient';

export default function AIPromptSuggestions({ 
  senior, 
  currentTopic, 
  recentConversation,
  onSelectPrompt,
  topicFocus 
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateSuggestions = async () => {
    setLoading(true);
    
    try {
      const prompt = `You are helping conduct a gentle interview with a senior named ${senior?.name || 'an elderly person'}.

Interview Focus: ${topicFocus || 'General life stories'}
    
${senior?.favorite_topics?.length > 0 ? `Their favorite topics include: ${senior.favorite_topics.join(', ')}` : ''}
${senior?.dementia_considerations ? `Important: ${senior.dementia_considerations}` : ''}
${currentTopic ? `Current topic being discussed: ${currentTopic}` : ''}
${recentConversation ? `Recent conversation excerpt: "${recentConversation}"` : ''}

Generate exactly 4 gentle, open-ended questions that:
1. Relate to the interview focus: ${topicFocus || 'their life experiences'}
2. Are easy to understand and not overwhelming
3. Encourage storytelling and memory recall
4. Build naturally on the conversation and topic focus

Return ONLY the questions, one per line, with no numbers, bullets, or extra formatting.`;

      const response = await geminiClient.generateText(prompt);
      
      // Parse the response into individual questions
      const questions = response
        .split('\n')
        .map(q => q.trim())
        .filter(q => q.length > 10 && !q.match(/^[0-9]+[\.)]/)) // Remove empty lines and numbered prefixes
        .map(q => q.replace(/^[-•*]\s*/, '')) // Remove bullet points
        .slice(0, 4); // Take first 4 questions

      setSuggestions(questions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setSuggestions([
        "What's a favorite memory from your childhood?",
        "Can you tell me about a special tradition in your family?",
        "What was a typical day like when you were younger?",
        "Is there a story you love to share with family?"
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#8FAE8B]/10 to-[#B8D4B4]/10 rounded-2xl border border-[#8FAE8B]/20 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#8FAE8B] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-medium text-[#3D3D3D]">AI Suggestions</h3>
        </div>
        <Button
          onClick={generateSuggestions}
          disabled={loading}
          size="sm"
          variant="outline"
          className="border-[#8FAE8B] text-[#8FAE8B] hover:bg-[#8FAE8B] hover:text-white rounded-full"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate
            </>
          )}
        </Button>
      </div>

      {suggestions.length > 0 ? (
        <div className="space-y-2 animate-fadeIn">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              style={{
                animation: `slideInLeft 0.3s ease-out ${idx * 0.1}s forwards`,
                opacity: 0
              }}
              onClick={() => onSelectPrompt(suggestion)}
              className="w-full text-left p-3 bg-white/70 hover:bg-white rounded-xl text-sm text-[#3D3D3D] flex items-center gap-3 group transition-all"
            >
              <Lightbulb className="w-4 h-4 text-[#8FAE8B] flex-shrink-0" />
              <span className="flex-1">{suggestion}</span>
              <ChevronRight className="w-4 h-4 text-[#6B6B6B] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#6B6B6B] text-center py-4">
          Click "Generate" to get AI-powered conversation suggestions
        </p>
      )}

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}