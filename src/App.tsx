import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { AuthForm } from './components/AuthForm';
import { NotificationsPanel } from './components/NotificationsPanel';
import { MyCrops } from './components/MyCrops';

export default function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleMenuClick = () => {
    setIsNavOpen(true);
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
  };

  const handleNotificationClick = () => {
    setIsNotificationsOpen(true);
  };

  const handleNotificationsClose = () => {
    setIsNotificationsOpen(false);
  };

  const handleNavClose = () => {
    setIsNavOpen(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleAuthSuccess = (token: string) => {
    setAccessToken(token);
    localStorage.setItem('access_token', token);
  };

  const handleLogout = async () => {
    try {
      const { supabase } = await import('./utils/supabase/client');
      
      await supabase.auth.signOut();
      setAccessToken(null);
      localStorage.removeItem('access_token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
          const { supabase } = await import('./utils/supabase/client');
          
          const { data, error } = await supabase.auth.getSession();
          if (data.session?.access_token && !error) {
            setAccessToken(data.session.access_token);
          } else {
            localStorage.removeItem('access_token');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('access_token');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const renderContent = () => {
    if (!accessToken) return null;

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard accessToken={accessToken} />;
      case 'crops':
        return <MyCrops accessToken={accessToken} />;
      case 'analytics':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics</h2>
            <p className="text-gray-600">Crop analytics and insights coming soon...</p>
          </div>
        );
      case 'support':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Support</h2>
            <p className="text-gray-600">Expert support and help center coming soon...</p>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
            <p className="text-gray-600">Farmer profile and settings coming soon...</p>
            <button 
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        );
      default:
        return <Dashboard accessToken={accessToken} />;
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <img 
            src="figma:asset/93a11ef0f4c1a2af6f65d747ec6e1d56f7092a96.png" 
            alt="KrishiBandhu Logo" 
            className="h-20 w-auto mx-auto mb-4"
          />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onMenuClick={handleMenuClick} 
        onProfileClick={handleProfileClick}
        onNotificationClick={handleNotificationClick}
      />
      
      <div className="flex flex-1">
        <Navigation
          isOpen={isNavOpen}
          onClose={handleNavClose}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        <main className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto p-4 lg:p-6 pb-20 lg:pb-6">
            {renderContent()}
          </div>
        </main>
      </div>
      
      <NotificationsPanel 
        isOpen={isNotificationsOpen} 
        onClose={handleNotificationsClose} 
      />
    </div>
  );
}