import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { geminiClient, mockEntities } from '../api/geminiClient';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, Plus, Loader2, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Link } from 'react-router-dom';

export default function AddSenior() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    birth_year: '',
    birth_place: '',
    photo_url: '',
    physical_description: '',
    notes: '',
    dementia_considerations: '',
    favorite_topics: []
  });
  const [newTopic, setNewTopic] = useState('');

  const createMutation = useMutation({
    mutationFn: (data) => mockEntities.Senior.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seniors'] });
      navigate(createPageUrl('Seniors'));
    }
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const { file_url } = await geminiClient.uploadFile({ file });
    setFormData(prev => ({ ...prev, photo_url: file_url }));
    setUploading(false);
  };

  const addTopic = () => {
    if (newTopic.trim() && !formData.favorite_topics.includes(newTopic.trim())) {
      setFormData(prev => ({
        ...prev,
        favorite_topics: [...prev.favorite_topics, newTopic.trim()]
      }));
      setNewTopic('');
    }
  };

  const removeTopic = (topic) => {
    setFormData(prev => ({
      ...prev,
      favorite_topics: prev.favorite_topics.filter(t => t !== topic)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      birth_year: formData.birth_year ? parseInt(formData.birth_year) : null
    };
    createMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link 
        to={createPageUrl('Seniors')} 
        className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#C4785A] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Seniors
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-[#E8DFD5] p-6 md:p-8"
      >
        <h1 className="font-serif text-2xl md:text-3xl text-[#3D3D3D] mb-2">Add a Senior</h1>
        <p className="text-[#6B6B6B] mb-8">Enter details about the family member whose stories you'll be preserving</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="flex justify-center">
            <div className="relative">
              <div className={`w-32 h-32 rounded-full border-2 border-dashed border-[#E8DFD5] flex items-center justify-center overflow-hidden bg-[#F5EDE6] ${!formData.photo_url && 'hover:border-[#C4785A] cursor-pointer'}`}>
                {formData.photo_url ? (
                  <img src={formData.photo_url} alt="Preview" className="w-full h-full object-cover" />
                ) : uploading ? (
                  <Loader2 className="w-8 h-8 text-[#C4785A] animate-spin" />
                ) : (
                  <label className="cursor-pointer flex flex-col items-center">
                    <User className="w-10 h-10 text-[#C4785A] mb-1" />
                    <span className="text-xs text-[#6B6B6B]">Add Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                )}
              </div>
              {formData.photo_url && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, photo_url: '' }))}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-[#3D3D3D]">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Margaret Elizabeth Johnson"
                className="mt-1 border-[#E8DFD5] focus:border-[#C4785A] focus:ring-[#C4785A]"
                required
              />
            </div>
            <div>
              <Label htmlFor="nickname" className="text-[#3D3D3D]">Nickname / Preferred Name</Label>
              <Input
                id="nickname"
                value={formData.nickname}
                onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                placeholder="e.g., Grandma Maggie"
                className="mt-1 border-[#E8DFD5] focus:border-[#C4785A] focus:ring-[#C4785A]"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="birth_year" className="text-[#3D3D3D]">Birth Year</Label>
              <Input
                id="birth_year"
                type="number"
                value={formData.birth_year}
                onChange={(e) => setFormData(prev => ({ ...prev, birth_year: e.target.value }))}
                placeholder="e.g., 1940"
                min="1900"
                max={new Date().getFullYear()}
                className="mt-1 border-[#E8DFD5] focus:border-[#C4785A] focus:ring-[#C4785A]"
              />
            </div>
            <div>
              <Label htmlFor="birth_place" className="text-[#3D3D3D]">Birthplace</Label>
              <Input
                id="birth_place"
                value={formData.birth_place}
                onChange={(e) => setFormData(prev => ({ ...prev, birth_place: e.target.value }))}
                placeholder="e.g., Bangkok, Thailand"
                className="mt-1 border-[#E8DFD5] focus:border-[#C4785A] focus:ring-[#C4785A]"
              />
            </div>
          </div>

          {/* Physical Description - NEW FIELD */}
          <div>
            <Label htmlFor="physical_description" className="text-[#3D3D3D]">Physical Appearance</Label>
            <p className="text-sm text-[#6B6B6B] mb-2">
              Describe their appearance for AI-generated images (gender, hair color, build, etc.)
            </p>
            <Textarea
              id="physical_description"
              value={formData.physical_description}
              onChange={(e) => setFormData(prev => ({ ...prev, physical_description: e.target.value }))}
              placeholder="e.g., Elderly woman with short gray hair, warm smile, petite build, often wearing floral dresses"
              className="mt-1 border-[#E8DFD5] focus:border-[#C4785A] focus:ring-[#C4785A] min-h-[80px]"
            />
          </div>

          {/* Favorite Topics */}
          <div>
            <Label className="text-[#3D3D3D]">Favorite Topics to Discuss</Label>
            <p className="text-sm text-[#6B6B6B] mb-2">What topics light them up? This helps with prompts.</p>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="e.g., Cooking, Gardening, War stories..."
                className="border-[#E8DFD5] focus:border-[#C4785A] focus:ring-[#C4785A]"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
              />
              <Button 
                type="button" 
                onClick={addTopic}
                variant="outline" 
                className="border-[#C4785A] text-[#C4785A] hover:bg-[#C4785A] hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.favorite_topics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.favorite_topics.map((topic) => (
                  <span 
                    key={topic} 
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#F5EDE6] text-[#C4785A] rounded-full text-sm"
                  >
                    {topic}
                    <button type="button" onClick={() => removeTopic(topic)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-[#3D3D3D]">Important Notes for Interviewers</Label>
            <p className="text-sm text-[#6B6B6B] mb-2">Any triggers to avoid, best times to talk, etc.</p>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="e.g., Avoid discussing the war period. Best to interview in the morning when she's most alert..."
              className="mt-1 border-[#E8DFD5] focus:border-[#C4785A] focus:ring-[#C4785A] min-h-[100px]"
            />
          </div>

          {/* Dementia Considerations */}
          <div>
            <Label htmlFor="dementia" className="text-[#3D3D3D]">Dementia Care Considerations</Label>
            <p className="text-sm text-[#6B6B6B] mb-2">Specific guidance for dementia-friendly conversations</p>
            <Textarea
              id="dementia"
              value={formData.dementia_considerations}
              onChange={(e) => setFormData(prev => ({ ...prev, dementia_considerations: e.target.value }))}
              placeholder="e.g., May need frequent reminders of who you are. Responds well to music from the 1950s. Keep sessions under 20 minutes..."
              className="mt-1 border-[#E8DFD5] focus:border-[#C4785A] focus:ring-[#C4785A] min-h-[100px]"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Link to={createPageUrl('Seniors')} className="flex-1">
              <Button type="button" variant="outline" className="w-full border-[#E8DFD5] text-[#6B6B6B] hover:bg-[#F5EDE6]">
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || !formData.name}
              className="flex-1 bg-[#C4785A] hover:bg-[#A86045] text-white"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Add Senior'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}