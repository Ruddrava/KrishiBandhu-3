import { Leaf, TrendingUp, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CropCardProps {
  name: string;
  status: 'excellent' | 'good' | 'attention';
  growth: string;
  nextAction: string;
  daysToHarvest: number;
  imageUrl: string;
}

export function CropCard({ 
  name, 
  status, 
  growth, 
  nextAction, 
  daysToHarvest, 
  imageUrl 
}: CropCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'attention':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={imageUrl}
            alt={`${name} crop`}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900 truncate">{name}</h4>
            <Badge className={`text-xs ${getStatusColor(status)}`}>
              {status}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-green-700">
              <TrendingUp className="h-3 w-3" />
              <span>{growth}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-blue-700">
              <Calendar className="h-3 w-3" />
              <span>{daysToHarvest} days to harvest</span>
            </div>
            
            <div className="flex items-center space-x-2 text-orange-700">
              <Leaf className="h-3 w-3" />
              <span className="text-xs">{nextAction}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}