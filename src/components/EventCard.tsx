import Image from 'next/image';
import { format } from 'date-fns';

interface EventCardProps {
  title: string;
  description: string;
  date: Date | string;
  tier: 'free' | 'silver' | 'gold' | 'platinum' ; 
  imageUrl?: string;
}

const tierColors = {
    free: 'bg-gray-100 text-gray-800',
    silver: 'bg-slate-200 text-slate-900',
    gold: 'bg-yellow-100 text-yellow-800',
    platinum: 'bg-indigo-100 text-indigo-800',
  };
  

  const tierLabels = {
    free: 'Free',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
  };
  

export function EventCard({ title, description, date, tier, imageUrl }: EventCardProps) {
  const formattedDate = format(new Date(date), 'PPP');
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="h-48 bg-gray-200 relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
    <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span>Event Image</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${tierColors[tier]}`}>
            {tierLabels[tier]}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {description}
        </p>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{formattedDate}</span>
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => {}}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
