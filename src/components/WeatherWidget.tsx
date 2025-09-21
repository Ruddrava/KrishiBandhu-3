import { Cloud, Droplets, Sun, Wind } from 'lucide-react';
import { Card } from './ui/card';

export function WeatherWidget() {
  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-blue-900">Today's Weather</h3>
        <Sun className="h-5 w-5 text-yellow-600" />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-semibold text-blue-900">28°C</span>
          <span className="text-sm text-blue-700">Sunny</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <Droplets className="h-3 w-3 text-blue-600" />
            <span className="text-blue-800">60%</span>
          </div>
          <div className="flex items-center space-x-1">
            <Wind className="h-3 w-3 text-blue-600" />
            <span className="text-blue-800">12 km/h</span>
          </div>
          <div className="flex items-center space-x-1">
            <Cloud className="h-3 w-3 text-blue-600" />
            <span className="text-blue-800">20%</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-blue-200">
          <p className="text-xs text-blue-700">
            Good weather for field work today
          </p>
        </div>
      </div>
    </Card>
  );
}