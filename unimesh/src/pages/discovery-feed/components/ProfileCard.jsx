import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import ConnectModal from './ConnectModal';

const ProfileCard = ({ profile, onConnect }) => {
  const navigate = useNavigate();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleConnect = (message) => {
    onConnect(profile?.id, message);
    setShowConnectModal(false);
  };

  const handleCardClick = (e) => {
    // Prevent expansion when clicking on buttons or interactive elements
    if (e?.target?.closest('button') || e?.target?.closest('.interactive')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const handleViewProfile = () => {
    navigate('/profile-management', { state: { profileId: profile?.id } });
  };

  const truncateText = (text, maxLength) => {
    if (text?.length <= maxLength) return text;
    return text?.substring(0, maxLength) + '...';
  };

  return (
    <>
      <div 
        className="bg-card border border-border rounded-lg shadow-card hover:shadow-interactive transition-smooth cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Header */}
        <div className="p-4 pb-3">
          <div className="flex items-start space-x-3">
            <div className="relative flex-shrink-0">
              <Image
                src={profile?.avatar}
                alt={profile?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {profile?.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-card rounded-full"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-card-foreground truncate">{profile?.name}</h3>
              <p className="text-sm text-muted-foreground">{profile?.major}</p>
              <p className="text-xs text-muted-foreground">{profile?.year} • {profile?.university}</p>
            </div>
            <div className="interactive">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleViewProfile}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="ExternalLink" size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Learning Section */}
        <div className="px-4 pb-3">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="BookOpen" size={14} className="text-primary" />
            <span className="text-sm font-medium text-card-foreground">What I'm Learning</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {isExpanded ? (profile?.user_classes?.map(c => c?.class_name)?.join(', ') || 'No classes listed') : truncateText(profile?.user_classes?.map(c => c?.class_name)?.join(', ') || 'No classes listed', 80)}
          </p>
        </div>

        {/* Building Section */}
        <div className="px-4 pb-3">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Wrench" size={14} className="text-secondary" />
            <span className="text-sm font-medium text-card-foreground">What I'm Building</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {isExpanded ? (profile?.user_projects?.map(p => p?.project_name)?.join(', ') || 'No projects listed') : truncateText(profile?.user_projects?.map(p => p?.project_name)?.join(', ') || 'No projects listed', 80)}
          </p>
        </div>

        {/* Skills Tags */}
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-1">
            {profile?.user_skills?.slice(0, isExpanded ? profile?.user_skills?.length : 4)?.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
              >
                {skill?.skill_name}
              </span>
            ))}
            {!isExpanded && profile?.user_skills?.length > 4 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                +{profile?.user_skills?.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Looking For Status */}
        <div className="px-4 pb-3">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Search" size={14} className="text-accent" />
            <span className="text-sm font-medium text-card-foreground">Looking For</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              profile?.looking_for ? 'bg-success' : 'bg-muted-foreground'
            }`}></div>
            <span className="text-sm text-muted-foreground">{profile?.looking_for || 'Open to connections'}</span>
          </div>
          {isExpanded && (
            <p className="text-sm text-muted-foreground mt-1">{profile?.bio || ''}</p>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-4 pb-3 border-t border-border pt-3">
            <div className="space-y-3">
              {/* Classes */}
              {profile?.user_classes && profile?.user_classes?.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="GraduationCap" size={14} className="text-primary" />
                    <span className="text-sm font-medium text-card-foreground">Current Classes</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {profile?.user_classes?.map((cls, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                      >
                        {cls?.class_code}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests */}
              {profile?.user_interests && profile?.user_interests?.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Heart" size={14} className="text-error" />
                    <span className="text-sm font-medium text-card-foreground">Interests</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {profile?.user_interests?.map((interest, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-error/10 text-error text-xs rounded-md"
                      >
                        {interest?.interest_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 pt-0 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={12} />
                <span>0 connections</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={12} />
                <span>{profile?.university}</span>
              </div>
            </div>
            <div className="interactive">
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowConnectModal(true)}
                iconName="UserPlus"
                iconPosition="left"
                iconSize={14}
              >
                Connect
              </Button>
            </div>
          </div>
        </div>

        {/* Expand/Collapse Indicator */}
        <div className="px-4 pb-2">
          <div className="flex justify-center">
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="text-muted-foreground"
            />
          </div>
        </div>
      </div>
      {/* Connect Modal */}
      <ConnectModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnect={handleConnect}
        profile={profile}
      />
    </>
  );
};

export default ProfileCard;