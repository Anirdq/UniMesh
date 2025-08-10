import React from 'react';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';

const EmptyState = ({ type, onAction }) => {
  const states = {
    noResults: {
      icon: 'Search',
      title: 'No students found',
      description: 'Try adjusting your filters or search criteria to find more students.',
      actionLabel: 'Clear Filters',
      actionIcon: 'RotateCcw'
    },
    noStudents: {
      icon: 'Users',
      title: 'Welcome to UniMesh!',
      description: 'Be the first to create your profile and start connecting with fellow students.',
      actionLabel: 'Create Profile',
      actionIcon: 'UserPlus'
    },
    error: {
      icon: 'AlertCircle',
      title: 'Something went wrong',
      description: 'We encountered an error while loading student profiles. Please try again.',
      actionLabel: 'Retry',
      actionIcon: 'RefreshCw'
    },
    loading: {
      icon: 'Loader2',
      title: 'Finding students...',
      description: 'We\'re searching for students that match your interests.',
      actionLabel: null,
      actionIcon: null
    }
  };

  const state = states?.[type] || states?.noResults;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Icon 
          name={state?.icon} 
          size={24} 
          className={cn("text-muted-foreground", type === 'loading' && "animate-spin")}
        />
      </div>
      <h3 className="text-lg font-semibold text-card-foreground mb-2">
        {state?.title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {state?.description}
      </p>
      {state?.actionLabel && (
        <Button
          variant="default"
          onClick={onAction}
          iconName={state?.actionIcon}
          iconPosition="left"
          iconSize={16}
        >
          {state?.actionLabel}
        </Button>
      )}
      {type === 'noResults' && (
        <div className="mt-8 p-4 bg-muted rounded-lg max-w-md">
          <h4 className="text-sm font-medium text-card-foreground mb-2">Tips for better results:</h4>
          <ul className="text-sm text-muted-foreground space-y-1 text-left">
            <li>• Try broader search terms</li>
            <li>• Remove some filters</li>
            <li>• Check your spelling</li>
            <li>• Expand your major or year selection</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmptyState;