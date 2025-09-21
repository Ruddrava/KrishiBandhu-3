import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { Calendar, MapPin, Droplets, Thermometer, Plus, Edit2, Trash2, Eye, AlertTriangle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Crop {
  id: string;
  name: string;
  variety: string;
  plantedDate: string;
  expectedHarvest: string;
  area: number;
  location: string;
  status: 'planted' | 'growing' | 'flowering' | 'ready' | 'harvested';
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  progress: number;
  lastWatered: string;
  notes: string;
  imageUrl?: string;
}

const cropTypes = [
  'Rice', 'Wheat', 'Corn', 'Sugarcane', 'Cotton', 'Soybeans', 'Tomatoes', 
  'Potatoes', 'Onions', 'Beans', 'Peas', 'Carrots', 'Cabbage', 'Spinach'
];

const statusColors = {
  planted: 'bg-blue-100 text-blue-800',
  growing: 'bg-green-100 text-green-800',
  flowering: 'bg-purple-100 text-purple-800',
  ready: 'bg-orange-100 text-orange-800',
  harvested: 'bg-gray-100 text-gray-800'
};

const healthColors = {
  excellent: 'bg-green-100 text-green-800',
  good: 'bg-blue-100 text-blue-800',
  fair: 'bg-yellow-100 text-yellow-800',
  poor: 'bg-red-100 text-red-800'
};

interface MyCropsProps {
  accessToken: string;
}

export function MyCrops({ accessToken }: MyCropsProps) {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Form state for adding/editing crops
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    plantedDate: '',
    expectedHarvest: '',
    area: '',
    location: '',
    status: 'planted' as const,
    healthStatus: 'good' as const,
    notes: ''
  });

  useEffect(() => {
    loadCrops();
  }, [accessToken]);

  const loadCrops = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1aa6be21/crops`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCrops(data.crops || []);
      }
    } catch (error) {
      console.error('Error loading crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCrop = async () => {
    try {
      const cropData = {
        ...formData,
        area: parseFloat(formData.area),
        progress: calculateProgress(formData.plantedDate, formData.expectedHarvest),
        lastWatered: new Date().toISOString().split('T')[0]
      };

      const url = editingCrop 
        ? `https://${projectId}.supabase.co/functions/v1/make-server-1aa6be21/crops/${editingCrop.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-1aa6be21/crops`;

      const response = await fetch(url, {
        method: editingCrop ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cropData)
      });

      if (response.ok) {
        await loadCrops();
        resetForm();
        setIsAddModalOpen(false);
        setEditingCrop(null);
      }
    } catch (error) {
      console.error('Error saving crop:', error);
    }
  };

  const deleteCrop = async (cropId: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1aa6be21/crops/${cropId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await loadCrops();
      }
    } catch (error) {
      console.error('Error deleting crop:', error);
    }
  };

  const calculateProgress = (plantedDate: string, expectedHarvest: string) => {
    const planted = new Date(plantedDate);
    const harvest = new Date(expectedHarvest);
    const now = new Date();
    
    const totalDays = (harvest.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24);
    const daysPassed = (now.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24);
    
    return Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      variety: '',
      plantedDate: '',
      expectedHarvest: '',
      area: '',
      location: '',
      status: 'planted',
      healthStatus: 'good',
      notes: ''
    });
  };

  const openEditModal = (crop: Crop) => {
    setFormData({
      name: crop.name,
      variety: crop.variety,
      plantedDate: crop.plantedDate,
      expectedHarvest: crop.expectedHarvest,
      area: crop.area.toString(),
      location: crop.location,
      status: crop.status,
      healthStatus: crop.healthStatus,
      notes: crop.notes
    });
    setEditingCrop(crop);
    setIsAddModalOpen(true);
  };

  const getDaysToHarvest = (expectedHarvest: string) => {
    const harvest = new Date(expectedHarvest);
    const now = new Date();
    const diffTime = harvest.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-green-800">My Crops</h1>
          <p className="text-green-600">Manage and track your crop progress</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="bg-green-600 hover:bg-green-700"
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="bg-green-600 hover:bg-green-700"
          >
            List
          </Button>
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  resetForm();
                  setEditingCrop(null);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Crop
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCrop ? 'Edit Crop' : 'Add New Crop'}
                </DialogTitle>
                <DialogDescription>
                  {editingCrop ? 'Update your crop information' : 'Add a new crop to your farm management system'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Crop Name</Label>
                  <Select 
                    value={formData.name} 
                    onValueChange={(value) => setFormData({...formData, name: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropTypes.map(crop => (
                        <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variety">Variety</Label>
                  <Input
                    id="variety"
                    value={formData.variety}
                    onChange={(e) => setFormData({...formData, variety: e.target.value})}
                    placeholder="e.g., Basmati, Hybrid"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plantedDate">Planted Date</Label>
                  <Input
                    id="plantedDate"
                    type="date"
                    value={formData.plantedDate}
                    onChange={(e) => setFormData({...formData, plantedDate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedHarvest">Expected Harvest</Label>
                  <Input
                    id="expectedHarvest"
                    type="date"
                    value={formData.expectedHarvest}
                    onChange={(e) => setFormData({...formData, expectedHarvest: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Area (acres)</Label>
                  <Input
                    id="area"
                    type="number"
                    step="0.1"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    placeholder="0.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Field name or location"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: any) => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planted">Planted</SelectItem>
                      <SelectItem value="growing">Growing</SelectItem>
                      <SelectItem value="flowering">Flowering</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="harvested">Harvested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="healthStatus">Health Status</Label>
                  <Select 
                    value={formData.healthStatus} 
                    onValueChange={(value: any) => setFormData({...formData, healthStatus: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Any additional notes about this crop"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingCrop(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={saveCrop}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!formData.name || !formData.plantedDate}
                >
                  {editingCrop ? 'Update' : 'Add'} Crop
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{crops.length}</div>
            <div className="text-sm text-green-700">Total Crops</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {crops.filter(c => c.status === 'growing').length}
            </div>
            <div className="text-sm text-blue-700">Growing</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {crops.filter(c => c.status === 'ready').length}
            </div>
            <div className="text-sm text-orange-700">Ready to Harvest</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {crops.reduce((acc, crop) => acc + crop.area, 0).toFixed(1)}
            </div>
            <div className="text-sm text-green-700">Total Acres</div>
          </CardContent>
        </Card>
      </div>

      {/* Crops Display */}
      {crops.length === 0 ? (
        <Card className="border-green-200">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No crops yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first crop to track its progress</p>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Crop
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.map((crop) => (
            <Card key={crop.id} className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-green-800">{crop.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openEditModal(crop)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteCrop(crop.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{crop.variety}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={statusColors[crop.status]}>
                    {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                  </Badge>
                  <Badge className={healthColors[crop.healthStatus]}>
                    {crop.healthStatus.charAt(0).toUpperCase() + crop.healthStatus.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{Math.round(crop.progress)}%</span>
                  </div>
                  <Progress value={crop.progress} className="h-2" />
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{crop.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{getDaysToHarvest(crop.expectedHarvest)} days to harvest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    <span>Last watered: {crop.lastWatered}</span>
                  </div>
                </div>

                {crop.healthStatus === 'poor' && (
                  <div className="flex items-center gap-2 text-red-600 text-sm p-2 bg-red-50 rounded">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Needs attention</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-green-200">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {crops.map((crop) => (
                <div key={crop.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-green-800">{crop.name}</h3>
                        <p className="text-sm text-gray-600">{crop.variety} • {crop.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={statusColors[crop.status]}>
                          {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">{crop.area} acres</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditModal(crop)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteCrop(crop.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}