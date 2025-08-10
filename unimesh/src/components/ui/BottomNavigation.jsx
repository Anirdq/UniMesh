import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomNavigation = ({ notifications = [], className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Discover',
      path: '/discovery-feed',
      icon: 'Compass',
      badge: 0,
      tooltip: 'Find collaborators and connections'
    },
    {
      label: 'Messages',
      path: '/messaging-hub',
      icon: 'MessageCircle',
      badge: notifications?.filter(n => n?.type === 'message' && !n?.read)?.length,
      tooltip: 'Direct messages and group chats'
    },
    {
      label: 'Events',
      path: '/campus-events',
      icon: 'Calendar',
      badge: notifications?.filter(n => n?.type === 'event' && !n?.read)?.length,
      tooltip: 'Campus activities and RSVP'
    },
    {
      label: 'Organizations',
      path: '/student-organizations',
      icon: 'Users',
      badge: notifications?.filter(n => n?.type === 'organization' && !n?.read)?.length,
      tooltip: 'Student clubs and groups'
    }
  ];

  const handleTabClick = (path) => {
    navigate(path);
  };

  const isActiveTab = (path) => {
    return location?.pathname === path;
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-navigation safe-area-inset-bottom ${className}`}>
        <div className="flex items-center justify-around h-16 px-2">
          {navigationItems?.map((item) => {
            const isActive = isActiveTab(item?.path);
            return (
              <button
                key={item?.path}
                onClick={() => handleTabClick(item?.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full px-2 py-2 transition-smooth relative ${
                  isActive 
                    ? 'text-primary' :'text-muted-foreground hover:text-foreground'
                }`}
                title={item?.tooltip}
              >
                <div className="relative">
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    className={`transition-smooth ${isActive ? 'text-primary' : ''}`}
                  />
                  {item?.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-error text-error-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center pulse-gentle">
                      {item?.badge > 9 ? '9+' : item?.badge}
                    </span>
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium transition-smooth ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {item?.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
      {/* Desktop Header Navigation */}
      <nav className={`hidden lg:flex items-center space-x-1 ${className}`}>
        {navigationItems?.map((item) => {
          const isActive = isActiveTab(item?.path);
          return (
            <button
              key={item?.path}
              onClick={() => handleTabClick(item?.path)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-smooth relative ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={item?.tooltip}
            >
              <Icon 
                name={item?.icon} 
                size={16} 
                className="mr-2"
              />
              {item?.label}
              {item?.badge > 0 && (
                <span className="ml-2 bg-error text-error-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center pulse-gentle">
                  {item?.badge > 9 ? '9+' : item?.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default BottomNavigation;