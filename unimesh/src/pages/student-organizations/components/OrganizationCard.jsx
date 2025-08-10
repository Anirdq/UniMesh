import React from 'react';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const OrganizationCard = ({ organization, onJoin, onViewDetails, currentUser }) => {
  const {
    id,
    name,
    logo,
    category,
    memberCount,
    description,
    isJoined,
    joinType,
    activityLevel,
    lastActivity,
    tags
  } = organization;

  const getActivityColor = (level) => {
    switch (level) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getActivityIcon = (level) => {
    switch (level) {
      case 'high': return 'TrendingUp';
      case 'medium': return 'Minus';
      case 'low': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800',
      cultural: 'bg-purple-100 text-purple-800',
      recreational: 'bg-green-100 text-green-800',
      professional: 'bg-orange-100 text-orange-800',
      service: 'bg-pink-100 text-pink-800'
    };
    return colors?.[category] || 'bg-gray-100 text-gray-800';
  };

  const handleJoinClick = (e) => {
    e?.stopPropagation();
    onJoin(organization);
  };

  const formatLastActivity = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInHours = Math.floor((now - activityTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  return (
    <div 
      className={cn("bg-card border border-border rounded-lg p-6 hover:shadow-interactive transition-smooth cursor-pointer")}
      onClick={() => onViewDetails(organization)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <Image 
              src={logo} 
              alt={`${name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-card-foreground text-lg truncate">
              {name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getCategoryColor(category))}>
                {category}
              </span>
              <div className="flex items-center text-muted-foreground text-sm">
                <Icon name="Users" size={14} className="mr-1" />
                <span>{memberCount} members</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Activity Indicator */}
        <div className="flex items-center space-x-1">
          <Icon 
            name={getActivityIcon(activityLevel)} 
            size={16} 
            className={cn(getActivityColor(activityLevel))}
          />
          <span className={cn("text-xs", getActivityColor(activityLevel))}>
            {formatLastActivity(lastActivity)}
          </span>
        </div>
      </div>
      {/* Description */}
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {description}
      </p>
      {/* Tags */}
      {tags && tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags?.slice(0, 3)?.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
          {tags?.length > 3 && (
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
              +{tags?.length - 3} more
            </span>
          )}
        </div>
      )}
      {/* Action Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center text-muted-foreground text-sm">
          <Icon name="Calendar" size={14} className="mr-1" />
          <span>Weekly meetings</span>
        </div>
        
        {isJoined ? (
          <Button variant="outline" size="sm" disabled>
            <Icon name="Check" size={16} className="mr-2" />
            Joined
          </Button>
        ) : (
          <Button 
            variant={joinType === 'open' ? 'default' : 'outline'} 
            size="sm"
            onClick={handleJoinClick}
          >
            {joinType === 'open' ? (
              <>
                <Icon name="Plus" size={16} className="mr-2" />
                Join
              </>
            ) : (
              <>
                <Icon name="Send" size={16} className="mr-2" />
                Request
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrganizationCard;