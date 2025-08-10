import React from 'react';
import Icon from '../../../components/AppIcon';

const UniversityBadge = () => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-2 flex items-center space-x-2">
        <Icon name="Shield" size={16} className="text-primary" />
        <span className="text-sm font-medium text-primary">University Verified Platform</span>
      </div>
    </div>
  );
};

export default UniversityBadge;