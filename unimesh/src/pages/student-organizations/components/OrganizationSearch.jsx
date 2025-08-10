import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const OrganizationSearch = ({ onSearch, onFilterToggle, isFilterOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="flex items-center space-x-3 mb-6">
      <div className="flex-1 relative">
        <Input
          type="search"
          placeholder="Search organizations by name, description, or tags..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 pr-10"
        />
        <Icon 
          name="Search" 
          size={16} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>
      
      <button
        onClick={onFilterToggle}
        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
          isFilterOpen
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
        }`}
      >
        <Icon name="Filter" size={16} className="mr-2" />
        <span className="hidden sm:inline">Filters</span>
      </button>
    </div>
  );
};

export default OrganizationSearch;