import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Loader2, Sparkles, TrendingUp } from 'lucide-react';

interface RecommendationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
}

interface Recommendation {
  crop: string;
  suitability: number;
  reason: string;
  expectedYield: string;
  plantingTime: string;
  harvestTime: string;
}

export function RecommendationsModal({ isOpen, onClose, accessToken }: RecommendationsModalProps) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [formData, setFormData] = useState({
    location: '',
    season: '',
    soilType: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { projectId } = await import('../utils/supabase/info');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1aa6be21/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setRecommendations(result.recommendations);
      } else {
        console.error('Recommendations error:', result.error);
      }
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSuitabilityColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-green-600" />
            <span>AI Crop Recommendations</span>
          </DialogTitle>
        </DialogHeader>

        {recommendations.length === 0 ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Village, District, State"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <Select value={formData.season} onValueChange={(value) => setFormData(prev => ({ ...prev, season: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="winter">Winter (Rabi)</SelectItem>
                  <SelectItem value="summer">Summer (Zaid)</SelectItem>
                  <SelectItem value="monsoon">Monsoon (Kharif)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="soilType">Soil Type</Label>
              <Select value={formData.soilType} onValueChange={(value) => setFormData(prev => ({ ...prev, soilType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clay">Clay</SelectItem>
                  <SelectItem value="loam">Loam</SelectItem>
                  <SelectItem value="sandy">Sandy</SelectItem>
                  <SelectItem value="clay-loam">Clay Loam</SelectItem>
                  <SelectItem value="sandy-loam">Sandy Loam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Getting Recommendations...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get AI Recommendations
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Recommended Crops</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setRecommendations([]);
                  setFormData({ location: '', season: '', soilType: '' });
                }}
              >
                New Search
              </Button>
            </div>

            {recommendations.map((rec, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-lg text-gray-900">{rec.crop}</h4>
                  <Badge className={getSuitabilityColor(rec.suitability)}>
                    {rec.suitability}% Suitable
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Expected Yield:</span>
                    <p className="text-green-600">{rec.expectedYield}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Planting Time:</span>
                    <p className="text-blue-600">{rec.plantingTime}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Harvest Time:</span>
                    <p className="text-orange-600">{rec.harvestTime}</p>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className="mt-3 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    // TODO: Add crop to farmer's collection
                    console.log('Adding crop:', rec.crop);
                  }}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Add to My Crops
                </Button>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}