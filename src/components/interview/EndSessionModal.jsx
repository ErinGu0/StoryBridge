import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, BookOpen, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { geminiClient } from '../../api/geminiClient';

export default function EndSessionModal({ 
  isOpen, 
  onClose, 
  senior, 
  notes, 
  duration, 
  generatedImages,
  onSaveSession 
}) {
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [sessionData, setSessionData] = useState({
    mood_notes: '',
    follow_up_topics: ''
  });
  const [storyData, setStoryData] = useState({
    title: '',
    life_chapter: '',
    year_approximate: '',
    location: ''
  });
  const [processedStory, setProcessedStory] = useState(null);

  const processWithAI = async () => {
    setProcessing(true);
    
    const prompt = `You are helping preserve a senior's story. Based on these interview notes, create a well-organized narrative.

Interview notes:
"${notes}"

${senior?.name ? `The storyteller is ${senior.name}.` : ''}

Please:
1. Clean up the fragmented notes into a flowing narrative
2. Preserve the authentic voice and emotions
3. Add appropriate historical context if you can infer the time period
4. Identify key themes, people mentioned, and location if mentioned
5. Create a brief summary (2-3 sentences)

Keep the story genuine - don't add fictional details.`;

    const response = await geminiClient.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          summary: { type: "string" },
          full_content: { type: "string" },
          ai_context: { type: "string" },
          themes: { type: "array", items: { type: "string" } },
          people_mentioned: { type: "array", items: { type: "string" } },
          suggested_life_chapter: { type: "string" },
          suggested_year: { type: "number" },
          suggested_location: { type: "string" }
        }
      }
    });

    setProcessedStory(response);
    setStoryData(prev => ({
      ...prev,
      title: response.title || prev.title,
      life_chapter: response.suggested_life_chapter || prev.life_chapter,
      year_approximate: response.suggested_year?.toString() || prev.year_approximate,
      location: response.suggested_location || prev.location
    }));
    
    setProcessing(false);
    setStep(2);
  };

  const handleSave = async () => {
    setProcessing(true);
    
    await onSaveSession({
      sessionData: {
        ...sessionData,
        follow_up_topics: sessionData.follow_up_topics.split(',').map(t => t.trim()).filter(Boolean),
        duration_minutes: Math.round(duration / 60)
      },
      storyData: {
        ...storyData,
        year_approximate: storyData.year_approximate ? parseInt(storyData.year_approximate) : null,
        summary: processedStory?.summary,
        full_content: processedStory?.full_content || notes,
        raw_transcript: notes,
        ai_context: processedStory?.ai_context,
        themes: processedStory?.themes,
        people_mentioned: processedStory?.people_mentioned,
        generated_images: generatedImages,
        status: 'needs_review'
      }
    });

    setProcessing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-2xl">
            <CheckCircle className="w-6 h-6 text-[#8FAE8B]" />
            Save Interview Session
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-[#F5EDE6] rounded-xl p-4 text-center">
              <p className="text-[#3D3D3D] font-medium">
                Session Duration: {Math.round(duration / 60)} minutes
              </p>
              <p className="text-sm text-[#6B6B6B] mt-1">
                {notes.length} characters of notes captured
              </p>
            </div>

            <div>
              <Label className="text-[#3D3D3D]">How did the session go?</Label>
              <Textarea
                value={sessionData.mood_notes}
                onChange={(e) => setSessionData(prev => ({ ...prev, mood_notes: e.target.value }))}
                placeholder="How was their mood? Were they engaged? Any concerns?"
                className="mt-2 border-[#E8DFD5] focus:border-[#C4785A]"
              />
            </div>

            <div>
              <Label className="text-[#3D3D3D]">Topics to explore next time</Label>
              <Input
                value={sessionData.follow_up_topics}
                onChange={(e) => setSessionData(prev => ({ ...prev, follow_up_topics: e.target.value }))}
                placeholder="Comma-separated: war years, first job, wedding..."
                className="mt-2 border-[#E8DFD5] focus:border-[#C4785A]"
              />
            </div>

            <Button
              onClick={processWithAI}
              disabled={processing || !notes.trim()}
              className="w-full bg-[#8FAE8B] hover:bg-[#7A9A76] text-white"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Process Notes into Story
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {processedStory && (
              <div className="bg-[#E8FFF0] rounded-xl p-4 border border-[#B4FFB8]">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#148B1A]" />
                  <span className="text-sm font-medium text-[#148B1A]">AI Processed</span>
                </div>
                <p className="text-sm text-[#3D3D3D] italic">"{processedStory.summary}"</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#3D3D3D]">Story Title</Label>
                <Input
                  value={storyData.title}
                  onChange={(e) => setStoryData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Give this story a title"
                  className="mt-2 border-[#E8DFD5] focus:border-[#C4785A]"
                />
              </div>
              <div>
                <Label className="text-[#3D3D3D]">Life Chapter</Label>
                <Select
                  value={storyData.life_chapter}
                  onValueChange={(v) => setStoryData(prev => ({ ...prev, life_chapter: v }))}
                >
                  <SelectTrigger className="mt-2 border-[#E8DFD5]">
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="childhood">Childhood</SelectItem>
                    <SelectItem value="teen_years">Teen Years</SelectItem>
                    <SelectItem value="young_adult">Young Adult</SelectItem>
                    <SelectItem value="career">Career</SelectItem>
                    <SelectItem value="family_life">Family Life</SelectItem>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#3D3D3D]">Approximate Year</Label>
                <Input
                  value={storyData.year_approximate}
                  onChange={(e) => setStoryData(prev => ({ ...prev, year_approximate: e.target.value }))}
                  placeholder="e.g., 1955"
                  type="number"
                  className="mt-2 border-[#E8DFD5] focus:border-[#C4785A]"
                />
              </div>
              <div>
                <Label className="text-[#3D3D3D]">Location</Label>
                <Input
                  value={storyData.location}
                  onChange={(e) => setStoryData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Where did this take place?"
                  className="mt-2 border-[#E8DFD5] focus:border-[#C4785A]"
                />
              </div>
            </div>

            <p className="text-sm text-[#6B6B6B]">
              ℹ️ The story will be saved as "needs review" so family can verify and add details later.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 border-[#E8DFD5]"
              >
                Back
              </Button>
              <Button
                onClick={handleSave}
                disabled={processing || !storyData.title}
                className="flex-1 bg-[#C4785A] hover:bg-[#A86045] text-white"
              >
                {processing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <BookOpen className="w-4 h-4 mr-2" />
                )}
                Save Story
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}