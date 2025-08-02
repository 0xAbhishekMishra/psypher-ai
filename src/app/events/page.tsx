import { Metadata } from 'next';
import { EventsList } from '@/components/EventsList';

export const metadata: Metadata = {
  title: 'Events | Psypher AI',
  description: 'Browse and discover upcoming events',
};

export default function EventsPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Upcoming Events</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover and join our exciting events and workshops
          </p>
        </div>
        
        <EventsList />
      </div>
    </div>
  );
}
