import { 
  Home, 
  Leaf, 
  TrendingUp, 
  MessageSquare, 
  User,
  X
} from 'lucide-react';
import { Button } from './ui/button';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'crops', label: 'My Crops', icon: Leaf },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'support', label: 'Support', icon: MessageSquare },
  { id: 'profile', label: 'Profile', icon: User },
];

export function Navigation({ isOpen, onClose, activeTab, onTabChange }: NavigationProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Navigation sidebar */}
      <nav className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r border-green-100 z-50 transform transition-transform duration-300 ease-in-out
        lg:static lg:inset-auto lg:transform-none lg:z-auto lg:translate-x-0 lg:h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end p-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Navigation items */}
        <div className="flex flex-col h-full">
          <div className="px-4 py-6 space-y-2 flex-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start h-12 text-left ${
                    isActive 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-800'
                  }`}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose();
                  }}
                >
                  <IconComponent className={`h-5 w-5 mr-3 ${
                    isActive ? 'text-white' : 'text-gray-500'
                  }`} />
                  {item.label}
                </Button>
              );
            })}
          </div>
          
          {/* Bottom section */}
          <div className="p-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-medium text-green-800 mb-1">Need Help?</h4>
              <p className="text-xs text-green-600 mb-3">
                Get expert advice for your crops
              </p>
              <Button 
                size="sm" 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Contact Expert
              </Button>
            </div>
          </div>
        </div>

      </nav>
      
      {/* Bottom navigation for mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 z-30">
        <div className="grid grid-cols-5 py-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`flex-col h-16 space-y-1 rounded-none ${
                  isActive 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-500'
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <IconComponent className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}