import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const LookingForSection = ({ lookingForData, onLookingForChange, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [customStatus, setCustomStatus] = useState('');

  const presetOptions = [
    {
      id: 'study-partner',
      label: 'Study Partner',
      description: 'Looking for someone to study with for upcoming exams or coursework',
      icon: 'BookOpen',
      color: 'bg-blue-500'
    },
    {
      id: 'project-teammate',
      label: 'Project Teammate',
      description: 'Need collaborators for academic or personal projects',
      icon: 'Users',
      color: 'bg-green-500'
    },
    {
      id: 'research-collaborator',
      label: 'Research Collaborator',
      description: 'Seeking partners for research projects or academic papers',
      icon: 'Search',
      color: 'bg-purple-500'
    },
    {
      id: 'mentor',
      label: 'Mentor',
      description: 'Looking for guidance from experienced students or professionals',
      icon: 'UserCheck',
      color: 'bg-orange-500'
    },
    {
      id: 'mentee',
      label: 'Mentee',
      description: 'Willing to mentor and guide other students',
      icon: 'Heart',
      color: 'bg-pink-500'
    },
    {
      id: 'networking',
      label: 'Networking',
      description: 'Interested in building professional connections',
      icon: 'Network',
      color: 'bg-indigo-500'
    },
    {
      id: 'social-connections',
      label: 'Social Connections',
      description: 'Looking to make friends and social connections on campus',
      icon: 'Coffee',
      color: 'bg-yellow-500'
    },
    {
      id: 'skill-exchange',
      label: 'Skill Exchange',
      description: 'Interested in teaching skills in exchange for learning others',
      icon: 'ArrowLeftRight',
      color: 'bg-teal-500'
    }
  ];

  const handlePresetToggle = (optionId) => {
    const isSelected = lookingForData?.presets?.includes(optionId);
    const newPresets = isSelected
      ? lookingForData?.presets?.filter(id => id !== optionId)
      : [...lookingForData?.presets, optionId];
    
    onLookingForChange({
      ...lookingForData,
      presets: newPresets
    });
  };

  const handleAddCustomStatus = () => {
    if (customStatus?.trim() && !lookingForData?.custom?.includes(customStatus?.trim())) {
      onLookingForChange({
        ...lookingForData,
        custom: [...lookingForData?.custom, customStatus?.trim()]
      });
      setCustomStatus('');
    }
  };

  const handleRemoveCustomStatus = (statusToRemove) => {
    onLookingForChange({
      ...lookingForData,
      custom: lookingForData?.custom?.filter(status => status !== statusToRemove)
    });
  };

  const handleVisibilityChange = (isVisible) => {
    onLookingForChange({
      ...lookingForData,
      isVisible
    });
  };

  const getSelectedCount = () => {
    return lookingForData?.presets?.length + lookingForData?.custom?.length;
  };

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Icon name="UserSearch" size={20} className="text-primary mr-3" />
          <h3 className="text-lg font-semibold text-foreground">Looking For</h3>
          <span className="ml-2 text-sm text-muted-foreground">
            ({getSelectedCount()} selected)
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
          {/* Visibility Toggle */}
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <Checkbox
              label="Show 'Looking For' status on my profile"
              description="Other students will be able to see what you're looking for"
              checked={lookingForData?.isVisible}
              onChange={(e) => handleVisibilityChange(e?.target?.checked)}
            />
          </div>

          {/* Preset Options */}
          <div className="mb-6">
            <h4 className="font-medium text-foreground mb-4">Quick Options</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presetOptions?.map((option) => {
                const isSelected = lookingForData?.presets?.includes(option?.id);
                return (
                  <div
                    key={option?.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-smooth ${
                      isSelected
                        ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    onClick={() => handlePresetToggle(option?.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full ${option?.color} mt-1 flex-shrink-0`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium text-foreground text-sm">{option?.label}</h5>
                          <Icon
                            name={isSelected ? "CheckCircle" : "Circle"}
                            size={16}
                            className={isSelected ? "text-primary" : "text-muted-foreground"}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{option?.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Status */}
          <div className="border-t border-border pt-6">
            <h4 className="font-medium text-foreground mb-4">Custom Status</h4>
            
            {/* Current Custom Statuses */}
            {lookingForData?.custom?.length > 0 && (
              <div className="mb-4 space-y-2">
                {lookingForData?.custom?.map((status, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-muted/30 rounded-lg p-3"
                  >
                    <span className="text-sm text-foreground">{status}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCustomStatus(status)}
                      className="w-6 h-6 text-muted-foreground hover:text-error"
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Custom Status */}
            <div className="space-y-3">
              <Input
                label="Add Custom Status"
                type="text"
                placeholder="e.g., Looking for startup co-founder, Need help with calculus"
                value={customStatus}
                onChange={(e) => setCustomStatus(e?.target?.value)}
                onKeyPress={(e) => e?.key === 'Enter' && (e?.preventDefault(), handleAddCustomStatus())}
                description="Describe what specific type of connection or help you're seeking"
              />

              <Button
                onClick={handleAddCustomStatus}
                disabled={!customStatus?.trim()}
                variant="outline"
                size="sm"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Add Custom Status
              </Button>
            </div>
          </div>

          {/* Summary */}
          {getSelectedCount() > 0 && (
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={16} className="text-primary mt-0.5" />
                <div>
                  <h5 className="font-medium text-foreground text-sm mb-1">
                    Profile Status Summary
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    You have {getSelectedCount()} active status{getSelectedCount() !== 1 ? 'es' : ''} 
                    {lookingForData?.isVisible ? ' visible to other students' : ' (currently hidden)'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LookingForSection;