'use client';

import { useEffect, useState } from 'react';
import { EventCard } from './EventCard';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  tier: 'free' | 'silver' | 'gold' | 'platinum';
  image_url?: string;
}

// Helper function to get display name for tiers
const getTierDisplayName = (tier: string) => {
  switch (tier) {
    case 'free': return 'Free';
    case 'silver': return 'Silver';
    case 'gold': return 'Gold';
    case 'platinum': return 'Platinum';
    default: return tier;
  }
};

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState('free');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please Sign in or Sign up.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter((event) => event.tier === selectedTier || event.tier === 'free');
    setFilteredEvents(filtered);
  }, [events, selectedTier]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={() => {
            const fetchEvents = async () => {
              try {
                const response = await fetch('/api/events');
                if (!response.ok) {
                  throw new Error('Failed to fetch events');
                }
                const data = await response.json();
                setEvents(data);
                setError(null);
              } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to load events. Please try again.');
              } finally {
                setIsLoading(false);
              }
            };
            fetchEvents();
          }}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {events.length === 0 
            ? 'No events found.' 
            : `No ${getTierDisplayName(selectedTier).toLowerCase()} or free events available.`
          }
        </p>
        {events.length > 0 && selectedTier !== 'free' && (
          <button 
            onClick={() => window.location.href = '/events'}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Show All Events
          </button>
        )}
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
        <p className="mt-1 text-sm text-gray-500">There are no upcoming events at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {events.map((event) => (
       <EventCard
       key={event.id}
       title={event.title}
       description={event.description}
       date={event.event_date}
       tier={event.tier}
       imageUrl={event.image_url}
       />
     
      ))}
    </div>
  );
}
