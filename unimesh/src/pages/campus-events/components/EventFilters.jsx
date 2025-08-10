import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventFilters = ({ 
  selectedCategory, 
  onCategoryChange, 
  selectedFilter, 
  onFilterChange,
  searchQuery,
  onSearchChange,
  className = '' 
}) => {
  const categories = [
    { id: 'all', label: 'All Events', icon: 'Calendar' },
    { id: 'academic', label: 'Academic', icon: 'BookOpen' },
    { id: 'social', label: 'Social', icon: 'Users' },
    { id: 'sports', label: 'Sports', icon: 'Trophy' },
    { id: 'career', label: 'Career', icon: 'Briefcase' },
    { id: 'cultural', label: 'Cultural', icon: 'Music' }
  ];

  const quickFilters = [
    { id: 'all', label: 'All Events', icon: 'Calendar' },
    { id: 'thisWeek', label: 'This Week', icon: 'Clock' },
    { id: 'myRSVPs', label: 'My RSVPs', icon: 'Check' },
    { id: 'myOrganizations', label: 'My Organizations', icon: 'Users' }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Icon 
          name="Search" 
          size={16} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
        />
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e?.target?.value)}
          className="w-full h-10 pl-10 pr-4 bg-muted border border-border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>
      {/* Category Filters */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Categories</h4>
        <div className="flex flex-wrap gap-2 lg:grid lg:grid-cols-1 lg:gap-1">
          {categories?.map((category) => (
            <Button
              key={category?.id}
              variant={selectedCategory === category?.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onCategoryChange(category?.id)}
              className="justify-start lg:w-full"
            >
              <Icon name={category?.icon} size={14} className="mr-2" />
              {category?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Quick Filters */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Quick Filters</h4>
        <div className="flex flex-wrap gap-2 lg:grid lg:grid-cols-1 lg:gap-1">
          {quickFilters?.map((filter) => (
            <Button
              key={filter?.id}
              variant={selectedFilter === filter?.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange(filter?.id)}
              className="justify-start lg:w-full"
            >
              <Icon name={filter?.icon} size={14} className="mr-2" />
              {filter?.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventFilters;