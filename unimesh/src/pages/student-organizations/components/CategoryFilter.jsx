import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange, organizationCounts }) => {
  const categoryIcons = {
    all: 'Grid3X3',
    academic: 'GraduationCap',
    cultural: 'Palette',
    recreational: 'Gamepad2',
    professional: 'Briefcase',
    service: 'Heart'
  };

  const categoryColors = {
    all: 'text-foreground',
    academic: 'text-blue-600',
    cultural: 'text-purple-600',
    recreational: 'text-green-600',
    professional: 'text-orange-600',
    service: 'text-pink-600'
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories?.map((category) => {
        const isSelected = selectedCategory === category?.value;
        const count = organizationCounts?.[category?.value] || 0;
        
        return (
          <button
            key={category?.value}
            onClick={() => onCategoryChange(category?.value)}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
              isSelected
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            <Icon 
              name={categoryIcons?.[category?.value]} 
              size={16} 
              className={`mr-2 ${isSelected ? '' : categoryColors?.[category?.value]}`}
            />
            <span>{category?.label}</span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              isSelected 
                ? 'bg-primary-foreground/20 text-primary-foreground' 
                : 'bg-background text-muted-foreground'
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;