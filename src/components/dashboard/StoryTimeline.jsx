import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

export default function StoryTimeline({ stories = [] }) {
  const mockStories = [
    {
      id: 1,
      year: '1950s',
      title: 'Childhood in the Countryside',
      description: 'Growing up on a farm with my siblings, waking up at dawn to milk the cows.',
      location: 'Rural Ohio',
      duration: '45 min',
      people: ['Mother', 'Father', '3 siblings'],
      color: 'bg-[#E8A98A]',
      imageCount: 3
    },
    {
      id: 2,
      year: '1960s',
      title: 'College Years & First Love',
      description: 'Studying literature at university and meeting my future spouse at a campus protest.',
      location: 'University of Michigan',
      duration: '60 min',
      people: ['College friends', 'Future spouse'],
      color: 'bg-[#B8D4B4]',
      imageCount: 5
    },
    {
      id: 3,
      year: '1970s',
      title: 'Starting a Family',
      description: 'Our first home, raising children, and building a career in teaching.',
      location: 'Chicago, IL',
      duration: '75 min',
      people: ['Spouse', 'Children'],
      color: 'bg-[#D4A5A5]',
      imageCount: 4
    },
    {
      id: 4,
      year: '1980s',
      title: 'Travel Adventures',
      description: 'Backpacking through Europe and experiencing different cultures.',
      location: 'Various countries',
      duration: '90 min',
      people: ['Spouse', 'Travel companions'],
      color: 'bg-[#7B9EBD]',
      imageCount: 6
    }
  ];

  const displayStories = stories.length > 0 ? stories : mockStories;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#3D3D3D]">Story Timeline</h2>
          <p className="text-[#6B6B6B] mt-1">Journey through preserved memories across the decades</p>
        </div>
        {displayStories.length === 0 && (
          <button className="bg-[#8FAE8B] hover:bg-[#7A9A76] text-white font-medium py-2 px-6 rounded-xl transition-colors">
            Start First Interview
          </button>
        )}
      </div>

      {/* Timeline */}
      {displayStories.length > 0 ? (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#E8A98A] via-[#B8D4B4] via-[#D4A5A5] to-[#7B9EBD]" />
          
          {/* Timeline items */}
          <div className="space-y-8">
            {displayStories.map((story, index) => (
              <div key={story.id} className="relative flex items-start">
                {/* Timeline dot */}
                <div className={`absolute left-5 w-3 h-3 rounded-full border-4 border-white ${story.color}`} />
                
                {/* Content card */}
                <div className="ml-12 bg-gray-50 rounded-xl p-5 flex-1 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-white border border-gray-300 text-gray-700">
                        {story.year}
                      </span>
                      <h3 className="text-xl font-bold text-[#3D3D3D] mt-2">{story.title}</h3>
                      <p className="text-[#6B6B6B] mt-2">{story.description}</p>
                      
                      {/* Story details */}
                      <div className="flex flex-wrap gap-4 mt-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {story.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {story.duration}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-1" />
                          {story.people.join(', ')}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {story.imageCount} images
                        </div>
                      </div>
                    </div>
                    
                    {/* View button */}
                    <button className="text-[#8FAE8B] hover:text-[#7A9A76] font-medium text-sm px-4 py-2 border border-[#8FAE8B] hover:border-[#7A9A76] rounded-lg transition-colors">
                      View Story
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No stories yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Preserving precious memories, one story at a time
          </p>
          <button className="bg-[#8FAE8B] hover:bg-[#7A9A76] text-white font-medium py-3 px-8 rounded-xl text-lg transition-colors">
            Start First Interview
          </button>
          <p className="text-gray-400 text-sm mt-8">
            1% of profits donated to reforestation
          </p>
        </div>
      )}
    </div>
  );
}