import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Lock, 
  Settings, 
  Camera,
  Edit3,
  Save,
  X,
  Trash2,
  Shield,
  LogOut
} from 'lucide-react';

interface ProfileProps {
  accessToken: string;
  onLogout: () => void;
}

export function Profile({ onLogout }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // User profile data - will be loaded from API in real implementation
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    farmSize: '',
    farmingExperience: '',
    cropsGrown: [] as string[],
    language: 'english',
    notifications: {
      weather: true,
      harvest: true,
      marketing: false,
      expert: true,
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage('Error changing password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (type: string, enabled: boolean) => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: enabled
      }
    }));
  };

  const farmingStats = [
    { label: 'Active Crops', value: profileData.cropsGrown.length.toString() || '0', icon: '🌱' },
    { label: 'Total Area', value: profileData.farmSize ? `${profileData.farmSize} acres` : '0 acres', icon: '🏞️' },
    { label: 'Years Farming', value: profileData.farmingExperience || '0', icon: '📅' },
    { label: 'Harvest Cycles', value: profileData.farmingExperience ? (parseInt(profileData.farmingExperience) * 2).toString() : '0', icon: '🌾' },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" alt={profileData.name || 'User'} />
              <AvatarFallback className="text-2xl font-semibold bg-green-100 text-green-700">
                {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('') : 'U'}
              </AvatarFallback>
            </Avatar>
            <Button 
              size="sm" 
              className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8"
              variant="secondary"
            >
              <Camera className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {profileData.name || 'Please add your name'}
                </h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {profileData.location || 'Add your farm location'}
                </p>
                <p className="text-green-600 font-medium mt-1">
                  {profileData.farmingExperience && profileData.farmSize 
                    ? `Farming since ${new Date().getFullYear() - parseInt(profileData.farmingExperience)} • ${profileData.farmSize} acres`
                    : 'Complete your farm details'
                  }
                </p>
              </div>
              
              <Button 
                variant={isEditing ? "outline" : "default"}
                onClick={() => setIsEditing(!isEditing)}
                className="shrink-0"
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t">
          {farmingStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Success/Error Message */}
      {message && (
        <Alert className={message.includes('successfully') ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <AlertDescription className={message.includes('successfully') ? "text-green-800" : "text-red-800"}>
            {message}
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Personal Info</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className={`pl-10 ${!isEditing ? "bg-gray-50" : ""}`}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className={`pl-10 ${!isEditing ? "bg-gray-50" : ""}`}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <Select 
                  value={profileData.language} 
                  onValueChange={(value: string) => handleInputChange('language', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
                    <SelectItem value="gujarati">ગુજરાતી (Gujarati)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="location">Farm Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="location"
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={!isEditing}
                  className={`pl-10 min-h-[80px] ${!isEditing ? "bg-gray-50" : ""}`}
                  placeholder="Enter your complete farm address"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Farm Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="farmSize">Farm Size (acres)</Label>
                <Input
                  id="farmSize"
                  value={profileData.farmSize}
                  onChange={(e) => handleInputChange('farmSize', e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  value={profileData.farmingExperience}
                  onChange={(e) => handleInputChange('farmingExperience', e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Label>Primary Crops</Label>
              <div className="flex flex-wrap gap-2">
                {profileData.cropsGrown.map((crop, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {crop}
                  </span>
                ))}
                {isEditing && (
                  <Button variant="outline" size="sm" className="rounded-full">
                    + Add Crop
                  </Button>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveProfile} disabled={loading}>
                  {loading ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
              </div>

              <Button onClick={handlePasswordChange} disabled={loading}>
                {loading ? (
                  <>Updating...</>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Sign out of all devices</div>
                  <div className="text-sm text-gray-600">This will sign you out from all logged-in devices</div>
                </div>
                <Button variant="outline">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out All
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <div className="font-medium text-red-900">Delete Account</div>
                  <div className="text-sm text-red-600">Permanently delete your account and all data</div>
                </div>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Weather Alerts</div>
                  <div className="text-sm text-gray-600">Get notified about weather changes affecting your crops</div>
                </div>
                <Switch 
                  checked={profileData.notifications.weather}
                  onCheckedChange={(checked: boolean) => handleNotificationChange('weather', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Harvest Reminders</div>
                  <div className="text-sm text-gray-600">Receive notifications about optimal harvest timing</div>
                </div>
                <Switch 
                  checked={profileData.notifications.harvest}
                  onCheckedChange={(checked: boolean) => handleNotificationChange('harvest', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Marketing Opportunities</div>
                  <div className="text-sm text-gray-600">Get alerts about crop pricing and market opportunities</div>
                </div>
                <Switch 
                  checked={profileData.notifications.marketing}
                  onCheckedChange={(checked: boolean) => handleNotificationChange('marketing', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Expert Consultations</div>
                  <div className="text-sm text-gray-600">Notifications about available expert consultations</div>
                </div>
                <Switch 
                  checked={profileData.notifications.expert}
                  onCheckedChange={(checked: boolean) => handleNotificationChange('expert', checked)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-600">Sign Out</h3>
                <p className="text-gray-600 mt-1">Sign out from your KrishiBandhu account</p>
              </div>
              <Button 
                variant="destructive" 
                onClick={onLogout}
                className="shrink-0"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}