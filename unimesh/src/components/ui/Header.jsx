import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ user, notifications = [], onSearch, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  
  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  const unreadNotifications = notifications?.filter(n => !n?.read)?.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef?.current && !profileMenuRef?.current?.contains(event?.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationRef?.current && !notificationRef?.current?.contains(event?.target)) {
        setIsNotificationOpen(false);
      }
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim() && onSearch) {
      onSearch(searchQuery?.trim());
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification?.type === 'message') {
      navigate('/messaging-hub');
    } else if (notification?.type === 'event') {
      navigate('/campus-events');
    } else if (notification?.type === 'connection') {
      navigate('/discovery-feed');
    }
    setIsNotificationOpen(false);
  };

  const formatNotificationTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 bg-card border-b border-border z-header ${className}`}>
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div 
            className="flex items-center cursor-pointer transition-smooth hover:opacity-80"
            onClick={() => navigate('/discovery-feed')}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
              <span className="text-primary-foreground font-bold text-lg">U</span>
            </div>
            <span className="text-xl font-semibold text-foreground hidden sm:block">UniMesh</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4 lg:mx-8" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative">
            <div className={`relative transition-all duration-300 ${isSearchExpanded ? 'w-full' : 'w-10 lg:w-full'}`}>
              <input
                type="text"
                placeholder="Search students, events, organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                onFocus={() => setIsSearchExpanded(true)}
                className={`w-full h-10 pl-10 pr-4 bg-muted border border-border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 ${
                  !isSearchExpanded ? 'lg:opacity-100 opacity-0 lg:pointer-events-auto pointer-events-none' : 'opacity-100 pointer-events-auto'
                }`}
              />
              <Icon 
                name="Search" 
                size={16} 
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer lg:cursor-default ${
                  !isSearchExpanded ? 'lg:pointer-events-none pointer-events-auto' : 'pointer-events-none'
                }`}
                onClick={() => !isSearchExpanded && setIsSearchExpanded(true)}
              />
            </div>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center pulse-gentle">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </Button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-interactive z-dropdown">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-popover-foreground">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications?.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <Icon name="Bell" size={24} className="mx-auto mb-2 opacity-50" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications?.slice(0, 10)?.map((notification) => (
                      <div
                        key={notification?.id}
                        className={`p-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted transition-smooth ${
                          !notification?.read ? 'bg-muted/50' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${!notification?.read ? 'bg-primary' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-popover-foreground truncate">
                              {notification?.title}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {notification?.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatNotificationTime(notification?.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {notifications?.length > 10 && (
                  <div className="p-3 border-t border-border">
                    <Button variant="ghost" size="sm" className="w-full">
                      View all notifications
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="rounded-full p-0 w-10 h-10"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img 
                    src={user?.avatar} 
                    alt={user?.name || 'Profile'} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary-foreground font-medium text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
            </Button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-interactive z-dropdown">
                <div className="p-4 border-b border-border">
                  <p className="font-medium text-popover-foreground">{user?.name || 'Student'}</p>
                  <p className="text-sm text-muted-foreground">{user?.email || 'student@university.edu'}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate('/profile-management');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-smooth flex items-center"
                  >
                    <Icon name="User" size={16} className="mr-3" />
                    Profile Management
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-smooth flex items-center"
                  >
                    <Icon name="Settings" size={16} className="mr-3" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-smooth flex items-center"
                  >
                    <Icon name="HelpCircle" size={16} className="mr-3" />
                    Help & Support
                  </button>
                  <div className="border-t border-border my-2"></div>
                  <button
                    onClick={() => {
                      navigate('/login-register');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-error hover:bg-muted transition-smooth flex items-center"
                  >
                    <Icon name="LogOut" size={16} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;