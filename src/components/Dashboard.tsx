import { useState } from 'react';
import { CropCard } from './CropCard';
import { WeatherWidget } from './WeatherWidget';
import { QuickActions } from './QuickActions';
import { RecommendationsModal } from './RecommendationsModal';
import { ConsultationModal } from './ConsultationModal';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';

const cropData = [
  {
    name: 'Wheat',
    status: 'excellent' as const,
    growth: 'Growing well',
    nextAction: 'Water in 2 days',
    daysToHarvest: 45,
    imageUrl: 'https://images.unsplash.com/photo-1671366419402-990423b74119?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx3aGVhdCUyMHJpY2UlMjBjb3JuJTIwY3JvcCUyMGZpZWxkfGVufDF8fHx8MTc1ODM5NzEwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    name: 'Rice',
    status: 'good' as const,
    growth: 'Moderate growth',
    nextAction: 'Apply fertilizer',
    daysToHarvest: 60,
    imageUrl: 'https://images.unsplash.com/photo-1707721691170-bf913a7a6231?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXJtZXIlMjBhZ3JpY3VsdHVyZSUyMGZpZWxkJTIwY3JvcHN8ZW58MXx8fHwxNzU4Mzk3MDk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

interface DashboardProps {
  accessToken: string;
}

export function Dashboard({ accessToken }: DashboardProps) {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h2 className="text-xl font-semibold mb-2">Welcome back, Farmer!</h2>
            <p className="text-green-100">Here's what's happening with your crops today</p>
          </div>
          <Button 
            onClick={() => setShowRecommendations(true)}
            className="bg-white text-green-700 hover:bg-green-50 self-start sm:self-auto"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Get AI Recommendations
          </Button>
        </div>
      </div>

      {/* Alert */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          Weather forecast shows rain in 3 days. Consider adjusting irrigation schedule.
        </AlertDescription>
      </Alert>

      {/* Stats overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-semibold text-green-600">2</div>
          <div className="text-sm text-gray-600">Active Crops</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-semibold text-blue-600">5.2</div>
          <div className="text-sm text-gray-600">Acres Total</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-semibold text-orange-600">45</div>
          <div className="text-sm text-gray-600">Days to Harvest</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-2xl font-semibold text-green-600">+12%</span>
          </div>
          <div className="text-sm text-gray-600">Expected Yield</div>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - Crops */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-gray-900">Your Crops</h3>
          {cropData.map((crop, index) => (
            <CropCard key={index} {...crop} />
          ))}
        </div>

        {/* Right column - Weather & Actions */}
        <div className="space-y-6">
          <WeatherWidget />
          <QuickActions onAskExpert={() => setShowConsultation(true)} />
        </div>
      </div>

      {/* Modals */}
      <RecommendationsModal 
        isOpen={showRecommendations}
        onClose={() => setShowRecommendations(false)}
        accessToken={accessToken}
      />
      
      <ConsultationModal 
        isOpen={showConsultation}
        onClose={() => setShowConsultation(false)}
        accessToken={accessToken}
      />
    </div>
  );
}