import React from 'react';

const LoadingCard = () => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-card animate-pulse">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-muted rounded-full flex-shrink-0"></div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
          <div className="w-8 h-8 bg-muted rounded"></div>
        </div>
      </div>
      {/* Learning Section */}
      <div className="px-4 pb-3">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-4 h-4 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded w-24"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full"></div>
          <div className="h-3 bg-muted rounded w-4/5"></div>
        </div>
      </div>
      {/* Building Section */}
      <div className="px-4 pb-3">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-4 h-4 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded w-24"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full"></div>
          <div className="h-3 bg-muted rounded w-3/4"></div>
        </div>
      </div>
      {/* Skills Tags */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-1">
          {[1, 2, 3, 4]?.map((i) => (
            <div key={i} className="h-6 bg-muted rounded-md w-16"></div>
          ))}
        </div>
      </div>
      {/* Looking For Status */}
      <div className="px-4 pb-3">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-4 h-4 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded w-20"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-muted rounded-full"></div>
          <div className="h-3 bg-muted rounded w-32"></div>
        </div>
      </div>
      {/* Actions */}
      <div className="p-4 pt-0 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-3 bg-muted rounded w-20"></div>
            <div className="h-3 bg-muted rounded w-16"></div>
          </div>
          <div className="h-8 bg-muted rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingCard;