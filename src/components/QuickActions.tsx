import { 
  Droplets, 
  Bug, 
  Sprout, 
  Calculator, 
  MessageCircle, 
  MapPin 
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface QuickActionsProps {
  onAskExpert: () => void;
}

const actions = [
  {
    id: 'irrigation',
    icon: Droplets,
    label: 'Irrigation',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
  },
  {
    id: 'pest',
    icon: Bug,
    label: 'Pest Control',
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100',
  },
  {
    id: 'fertilizer',
    icon: Sprout,
    label: 'Fertilizer',
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100',
  },
  {
    id: 'calculator',
    icon: Calculator,
    label: 'Cost Calculator',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
  },
  {
    id: 'expert',
    icon: MessageCircle,
    label: 'Ask Expert',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
  },
  {
    id: 'market',
    icon: MapPin,
    label: 'Market Prices',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100',
  },
];

export function QuickActions({ onAskExpert }: QuickActionsProps) {
  const handleActionClick = (actionId: string) => {
    if (actionId === 'expert') {
      onAskExpert();
    } else {
      // TODO: Implement other actions
      console.log('Action clicked:', actionId);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Button
              key={action.id}
              variant="ghost"
              className={`h-20 flex-col space-y-2 ${action.bgColor} border border-gray-200`}
              onClick={() => handleActionClick(action.id)}
            >
              <IconComponent className={`h-6 w-6 ${action.color}`} />
              <span className="text-xs text-gray-700 text-center leading-tight">
                {action.label}
              </span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}