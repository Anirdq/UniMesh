import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const OrganizationDetail = ({ organization, onClose, onJoin, currentUser }) => {
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: 'About', icon: 'Info' },
    { id: 'members', label: 'Members', icon: 'Users' },
    { id: 'events', label: 'Events', icon: 'Calendar' },
    { id: 'announcements', label: 'Updates', icon: 'Bell' }
  ];

  const mockMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "President",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      major: "Computer Science",
      year: "Senior"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Vice President",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      major: "Business Administration",
      year: "Junior"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Secretary",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      major: "Marketing",
      year: "Sophomore"
    }
  ];

  const mockEvents = [
    {
      id: 1,
      title: "Weekly General Meeting",
      date: "2025-01-15",
      time: "7:00 PM",
      location: "Student Center Room 201",
      attendees: 25
    },
    {
      id: 2,
      title: "Networking Workshop",
      date: "2025-01-20",
      time: "6:00 PM",
      location: "Business Building Auditorium",
      attendees: 45
    }
  ];

  const mockAnnouncements = [
    {
      id: 1,
      title: "New Member Orientation",
      content: "Welcome to all our new members! Join us for orientation this Friday.",
      author: "Sarah Johnson",
      timestamp: new Date(Date.now() - 86400000)
    },
    {
      id: 2,
      title: "Upcoming Elections",
      content: "Officer elections will be held next month. Nominations are now open.",
      author: "Michael Chen",
      timestamp: new Date(Date.now() - 172800000)
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAnnouncementTime = (timestamp) => {
    const now = new Date();
    const announcementTime = new Date(timestamp);
    const diffInHours = Math.floor((now - announcementTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
      <div className="bg-card rounded-lg shadow-interactive max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
              <Image 
                src={organization?.logo} 
                alt={`${organization?.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-card-foreground">{organization?.name}</h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-muted-foreground">
                  {organization?.memberCount} members
                </span>
                <span className="text-sm text-muted-foreground">
                  {organization?.category}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {!organization?.isJoined && (
              <Button onClick={() => onJoin(organization)}>
                <Icon name="Plus" size={16} className="mr-2" />
                {organization?.joinType === 'open' ? 'Join' : 'Request to Join'}
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 px-6 pt-4 overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-smooth ${
                activeTab === tab?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} className="mr-2" />
              {tab?.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-card-foreground mb-3">About Us</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {organization?.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-card-foreground mb-3">Mission Statement</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To foster innovation, collaboration, and professional development among students while creating meaningful connections that last beyond university years.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-card-foreground mb-3">Meeting Schedule</h3>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Icon name="Calendar" size={16} />
                  <span>Every Wednesday at 7:00 PM</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground mt-2">
                  <Icon name="MapPin" size={16} />
                  <span>Student Center Room 201</span>
                </div>
              </div>

              {organization?.tags && organization?.tags?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-card-foreground mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {organization?.tags?.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div>
              <h3 className="font-semibold text-card-foreground mb-4">Leadership Team</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mockMembers?.map((member) => (
                  <div key={member?.id} className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-background">
                      <Image 
                        src={member?.avatar} 
                        alt={member?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-card-foreground truncate">{member?.name}</p>
                      <p className="text-sm text-primary">{member?.role}</p>
                      <p className="text-xs text-muted-foreground">{member?.major} • {member?.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <h3 className="font-semibold text-card-foreground mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {mockEvents?.map((event) => (
                  <div key={event?.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-card-foreground">{event?.title}</h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Icon name="Calendar" size={14} />
                            <span>{formatDate(event?.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Icon name="Clock" size={14} />
                            <span>{event?.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 mt-1 text-sm text-muted-foreground">
                          <Icon name="MapPin" size={14} />
                          <span>{event?.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{event?.attendees} attending</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          RSVP
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div>
              <h3 className="font-semibold text-card-foreground mb-4">Recent Updates</h3>
              <div className="space-y-4">
                {mockAnnouncements?.map((announcement) => (
                  <div key={announcement?.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-card-foreground">{announcement?.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatAnnouncementTime(announcement?.timestamp)}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{announcement?.content}</p>
                    <p className="text-xs text-muted-foreground">By {announcement?.author}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetail;