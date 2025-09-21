import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Bell, AlertTriangle, CloudRain, Leaf, MessageCircle, X } from 'lucide-react';
import { Badge } from './ui/badge';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'weather' | 'crop' | 'expert' | 'system';
  timestamp: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Weather Alert',
    message: 'Heavy rainfall expected in your area for the next 2 days. Consider protecting your crops.',
    type: 'weather',
    timestamp: '2 hours ago',
    isRead: false
  },
  {
    id: '2',
    title: 'Crop Recommendation',
    message: 'Based on current soil conditions, consider planting wheat in the next week.',
    type: 'crop',
    timestamp: '5 hours ago',
    isRead: false
  },
  {
    id: '3',
    title: 'Expert Consultation',
    message: 'Dr. Sharma has responded to your query about pest management.',
    type: 'expert',
    timestamp: '1 day ago',
    isRead: true
  },
  {
    id: '4',
    title: 'System Update',
    message: 'New features added to crop analytics dashboard. Check them out!',
    type: 'system',
    timestamp: '2 days ago',
    isRead: true
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'weather':
      return <CloudRain className="h-5 w-5 text-blue-600" />;
    case 'crop':
      return <Leaf className="h-5 w-5 text-green-600" />;
    case 'expert':
      return <MessageCircle className="h-5 w-5 text-purple-600" />;
    case 'system':
      return <Bell className="h-5 w-5 text-gray-600" />;
    default:
      return <Bell className="h-5 w-5 text-gray-600" />;
  }
};

const getNotificationBadgeColor = (type: string) => {
  switch (type) {
    case 'weather':
      return 'bg-blue-100 text-blue-800';
    case 'crop':
      return 'bg-green-100 text-green-800';
    case 'expert':
      return 'bg-purple-100 text-purple-800';
    case 'system':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-green-600" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {unreadCount}
                </Badge>
              )}
            </DialogTitle>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-green-600 hover:text-green-700"
              >
                Mark all read
              </Button>
            )}
          </div>
          <DialogDescription>
            View and manage your farm notifications including weather alerts, crop recommendations, and expert consultation updates.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  notification.isRead 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-green-200 shadow-sm'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${
                        notification.isRead ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <p className={`text-sm mb-2 ${
                      notification.isRead ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {notification.timestamp}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getNotificationBadgeColor(notification.type)}`}
                      >
                        {notification.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="border-t pt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={onClose}
            >
              View All Notifications
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}