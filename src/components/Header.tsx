import { Menu, Bell, User } from 'lucide-react';
import { Button } from './ui/button';
import krishiBandhuLogo from 'figma:asset/93a11ef0f4c1a2af6f65d747ec6e1d56f7092a96.png';

interface HeaderProps {
  onMenuClick: () => void;
  onProfileClick: () => void;
  onNotificationClick: () => void;
}

export function Header({ onMenuClick, onProfileClick, onNotificationClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-green-100 px-4 py-3 lg:px-6 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden p-2"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6 text-green-700" />
        </Button>

        {/* Logo + Branding */}
        <div className="flex items-center space-x-4">
          <img 
            src={krishiBandhuLogo} 
            alt="KrishiBandhu Logo" 
            className="h-10 w-auto md:h-12 lg:h-16 object-contain"
          />
          <div className="hidden sm:block">
            <h1 className="text-xl md:text-2xl font-bold text-green-800">
              KrishiBandhu
            </h1>
            <p className="text-sm md:text-base text-green-600">
              Smart Crop Advisory
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2 relative" onClick={onNotificationClick}>
            <Bell className="h-5 w-5 md:h-6 md:w-6 text-green-700" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>
          <Button variant="ghost" size="sm" className="p-2" onClick={onProfileClick}>
            <User className="h-5 w-5 md:h-6 md:w-6 text-green-700" />
          </Button>
        </div>
      </div>
    </header>
  );
}
