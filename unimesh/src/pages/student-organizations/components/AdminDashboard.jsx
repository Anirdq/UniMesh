import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const AdminDashboard = ({ organization, memberRequests, onApproveRequest, onRejectRequest, onCreateAnnouncement }) => {
  const [activeTab, setActiveTab] = useState('requests');
  const [announcementText, setAnnouncementText] = useState('');

  const tabs = [
    { id: 'requests', label: 'Member Requests', icon: 'UserPlus', count: memberRequests?.length },
    { id: 'members', label: 'Manage Members', icon: 'Users', count: organization?.memberCount },
    { id: 'announcements', label: 'Announcements', icon: 'Megaphone', count: 0 },
    { id: 'events', label: 'Events', icon: 'Calendar', count: 0 }
  ];

  const handleCreateAnnouncement = () => {
    if (announcementText?.trim()) {
      onCreateAnnouncement({
        text: announcementText,
        timestamp: new Date(),
        author: 'Current User'
      });
      setAnnouncementText('');
    }
  };

  const formatRequestTime = (timestamp) => {
    const now = new Date();
    const requestTime = new Date(timestamp);
    const diffInHours = Math.floor((now - requestTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Admin Dashboard</h2>
            <p className="text-sm text-muted-foreground">Manage {organization?.name}</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Icon name="Settings" size={16} className="mr-2" />
          Settings
        </Button>
      </div>
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 overflow-x-auto">
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
            <span>{tab?.label}</span>
            {tab?.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab?.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {tab?.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'requests' && (
          <div>
            <h3 className="font-medium text-card-foreground mb-4">Pending Member Requests</h3>
            {memberRequests?.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="UserCheck" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No pending requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {memberRequests?.map((request) => (
                  <div key={request?.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-background">
                        <Image 
                          src={request?.avatar} 
                          alt={request?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{request?.name}</p>
                        <p className="text-sm text-muted-foreground">{request?.major} • {formatRequestTime(request?.requestTime)}</p>
                        {request?.message && (
                          <p className="text-sm text-muted-foreground mt-1 italic">"{request?.message}"</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onRejectRequest(request?.id)}
                      >
                        <Icon name="X" size={16} className="mr-1" />
                        Reject
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => onApproveRequest(request?.id)}
                      >
                        <Icon name="Check" size={16} className="mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <h3 className="font-medium text-card-foreground mb-4">Member Management</h3>
            <div className="text-center py-8">
              <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Member management tools coming soon</p>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div>
            <h3 className="font-medium text-card-foreground mb-4">Create Announcement</h3>
            <div className="space-y-4">
              <textarea
                value={announcementText}
                onChange={(e) => setAnnouncementText(e?.target?.value)}
                placeholder="Write an announcement for your organization members..."
                className="w-full h-32 p-3 bg-background border border-border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleCreateAnnouncement}
                  disabled={!announcementText?.trim()}
                >
                  <Icon name="Send" size={16} className="mr-2" />
                  Post Announcement
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <h3 className="font-medium text-card-foreground mb-4">Event Management</h3>
            <div className="text-center py-8">
              <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Event management tools coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;