import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const PrivacyControls = ({ privacySettings, onPrivacyChange, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const privacyOptions = [
    {
      id: 'profilePhoto',
      label: 'Profile Photo',
      description: 'Allow others to see your profile picture',
      icon: 'Image',
      defaultValue: true
    },
    {
      id: 'learningSection',
      label: 'What I\'m Learning',
      description: 'Show your current courses and learning progress',
      icon: 'BookOpen',
      defaultValue: true
    },
    {
      id: 'projectsSection',
      label: 'What I\'m Building',
      description: 'Display your projects and GitHub links',
      icon: 'Code',
      defaultValue: true
    },
    {
      id: 'skillsSection',
      label: 'Skills & Interests',
      description: 'Share your skills and interest categories',
      icon: 'Target',
      defaultValue: true
    },
    {
      id: 'lookingForSection',
      label: 'Looking For Status',
      description: 'Show what type of connections you\'re seeking',
      icon: 'UserSearch',
      defaultValue: true
    },
    {
      id: 'contactInfo',
      label: 'Contact Information',
      description: 'Allow others to see your email and social links',
      icon: 'Mail',
      defaultValue: false
    },
    {
      id: 'academicInfo',
      label: 'Academic Information',
      description: 'Show your major, year, and academic details',
      icon: 'GraduationCap',
      defaultValue: true
    },
    {
      id: 'activityStatus',
      label: 'Activity Status',
      description: 'Show when you were last active on the platform',
      icon: 'Clock',
      defaultValue: false
    }
  ];

  const visibilityLevels = [
    {
      id: 'public',
      label: 'Public',
      description: 'Visible to all university students',
      icon: 'Globe',
      color: 'text-green-600'
    },
    {
      id: 'connections',
      label: 'Connections Only',
      description: 'Visible only to your connections',
      icon: 'Users',
      color: 'text-blue-600'
    },
    {
      id: 'private',
      label: 'Private',
      description: 'Only visible to you',
      icon: 'Lock',
      color: 'text-red-600'
    }
  ];

  const handlePrivacyToggle = (optionId) => {
    onPrivacyChange({
      ...privacySettings,
      [optionId]: !privacySettings?.[optionId]
    });
  };

  const handleVisibilityChange = (level) => {
    onPrivacyChange({
      ...privacySettings,
      profileVisibility: level
    });
  };

  const getVisibleSectionsCount = () => {
    return privacyOptions?.filter(option => privacySettings?.[option?.id])?.length;
  };

  const getCurrentVisibilityLevel = () => {
    return visibilityLevels?.find(level => level?.id === privacySettings?.profileVisibility) || visibilityLevels?.[0];
  };

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Icon name="Shield" size={20} className="text-primary mr-3" />
          <h3 className="text-lg font-semibold text-foreground">Privacy Controls</h3>
          <span className="ml-2 text-sm text-muted-foreground">
            ({getVisibleSectionsCount()}/{privacyOptions?.length} visible)
          </span>
        </div>
        <Icon
          name={isExpanded ? "ChevronUp" : "ChevronDown"}
          size={20}
          className="text-muted-foreground"
        />
      </div>
      {isExpanded && (
        <div className="px-6 pb-6">
          {/* Profile Visibility Level */}
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium text-foreground mb-3">Profile Visibility</h4>
            <div className="space-y-3">
              {visibilityLevels?.map((level) => {
                const isSelected = privacySettings?.profileVisibility === level?.id;
                return (
                  <div
                    key={level?.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-smooth ${
                      isSelected
                        ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    onClick={() => handleVisibilityChange(level?.id)}
                  >
                    <Icon
                      name={level?.icon}
                      size={16}
                      className={isSelected ? 'text-primary' : level?.color}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground text-sm">{level?.label}</span>
                        <Icon
                          name={isSelected ? "CheckCircle" : "Circle"}
                          size={16}
                          className={isSelected ? "text-primary" : "text-muted-foreground"}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{level?.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Visibility Controls */}
          <div className="mb-6">
            <h4 className="font-medium text-foreground mb-4">Section Visibility</h4>
            <div className="space-y-3">
              {privacyOptions?.map((option) => (
                <div
                  key={option?.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Icon name={option?.icon} size={16} className="text-muted-foreground" />
                    <div>
                      <h5 className="font-medium text-foreground text-sm">{option?.label}</h5>
                      <p className="text-xs text-muted-foreground">{option?.description}</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={privacySettings?.[option?.id] || false}
                    onChange={() => handlePrivacyToggle(option?.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Summary */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={16} className="text-primary mt-0.5" />
              <div>
                <h5 className="font-medium text-foreground text-sm mb-1">
                  Privacy Summary
                </h5>
                <p className="text-xs text-muted-foreground mb-2">
                  Your profile is set to <span className="font-medium">{getCurrentVisibilityLevel()?.label}</span> with{' '}
                  <span className="font-medium">{getVisibleSectionsCount()} out of {privacyOptions?.length}</span> sections visible.
                </p>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-muted-foreground">Visible: {getVisibleSectionsCount()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-muted-foreground">Hidden: {privacyOptions?.length - getVisibleSectionsCount()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Privacy Options */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="font-medium text-foreground mb-4">Additional Settings</h4>
            <div className="space-y-3">
              <Checkbox
                label="Allow search engines to index my profile"
                description="Your profile may appear in Google and other search results"
                checked={privacySettings?.searchEngineIndexing || false}
                onChange={(e) => onPrivacyChange({
                  ...privacySettings,
                  searchEngineIndexing: e?.target?.checked
                })}
              />
              
              <Checkbox
                label="Show me in discovery suggestions"
                description="Allow other students to discover your profile in their feed"
                checked={privacySettings?.discoveryEnabled !== false}
                onChange={(e) => onPrivacyChange({
                  ...privacySettings,
                  discoveryEnabled: e?.target?.checked
                })}
              />
              
              <Checkbox
                label="Allow direct messages from non-connections"
                description="Students you haven't connected with can still message you"
                checked={privacySettings?.allowDirectMessages !== false}
                onChange={(e) => onPrivacyChange({
                  ...privacySettings,
                  allowDirectMessages: e?.target?.checked
                })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyControls;