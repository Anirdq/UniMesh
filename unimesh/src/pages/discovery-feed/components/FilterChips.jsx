import React from 'react';
import { cn } from '../../../utils/cn';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ activeFilters, onFilterChange, onAdvancedFilter }) => {
  const quickFilters = [
    { id: 'all', label: 'All Students', icon: 'Users' },
    { id: 'computer-science', label: 'Computer Science', icon: 'Code' },
    { id: 'engineering', label: 'Engineering', icon: 'Cog' },
    { id: 'business', label: 'Business', icon: 'Briefcase' },
    { id: 'design', label: 'Design', icon: 'Palette' },
    { id: 'online', label: 'Online Now', icon: 'Circle' },
    { id: 'looking-for-study', label: 'Study Partners', icon: 'BookOpen' },
    { id: 'looking-for-project', label: 'Project Teams', icon: 'Wrench' }
  ];

  const handleFilterClick = (filterId) => {
    if (filterId === 'all') {
      onFilterChange([]);
    } else {
      const newFilters = activeFilters?.includes(filterId)
        ? activeFilters?.filter(f => f !== filterId)
        : [...activeFilters, filterId];
      onFilterChange(newFilters);
    }
  };

  const isActive = (filterId) => {
    if (filterId === 'all') {
      return activeFilters?.length === 0;
    }
    return activeFilters?.includes(filterId);
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-card-foreground">Quick Filters</h3>
          <button
            onClick={onAdvancedFilter}
            className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-smooth"
          >
            <Icon name="SlidersHorizontal" size={16} />
            <span>Advanced</span>
          </button>
        </div>
        
        <div className="flex overflow-x-auto scrollbar-hide space-x-2 pb-1">
          {quickFilters?.map((filter) => (
            <button
              key={filter?.id}
              onClick={() => handleFilterClick(filter?.id)}
              className={cn("flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-smooth", 
                isActive(filter?.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              )}
            >
              <Icon 
                name={filter?.icon} 
                size={14} 
                className={cn(filter?.id === 'online' && isActive(filter?.id) && 'text-success')}
              />
              <span>{filter?.label}</span>
            </button>
          ))}
        </div>

        {/* Active Filters Count */}
        {activeFilters?.length > 0 && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <span className="text-sm text-muted-foreground">
              {activeFilters?.length} filter{activeFilters?.length !== 1 ? 's' : ''} active
            </span>
            <button
              onClick={() => onFilterChange([])}
              className="text-sm text-error hover:text-error/80 transition-smooth"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterChips;