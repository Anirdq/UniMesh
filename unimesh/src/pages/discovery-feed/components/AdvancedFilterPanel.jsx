import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AdvancedFilterPanel = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
  const [filters, setFilters] = useState({
    major: currentFilters?.major || '',
    year: currentFilters?.year || '',
    skills: currentFilters?.skills || [],
    interests: currentFilters?.interests || [],
    lookingFor: currentFilters?.lookingFor || [],
    availability: currentFilters?.availability || '',
    location: currentFilters?.location || '',
    classes: currentFilters?.classes || '',
    projectType: currentFilters?.projectType || [],
    ...currentFilters
  });

  const majorOptions = [
    { value: '', label: 'All Majors' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'business', label: 'Business Administration' },
    { value: 'design', label: 'Design' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'biology', label: 'Biology' },
    { value: 'psychology', label: 'Psychology' },
    { value: 'economics', label: 'Economics' }
  ];

  const yearOptions = [
    { value: '', label: 'All Years' },
    { value: 'freshman', label: 'Freshman' },
    { value: 'sophomore', label: 'Sophomore' },
    { value: 'junior', label: 'Junior' },
    { value: 'senior', label: 'Senior' },
    { value: 'graduate', label: 'Graduate Student' }
  ];

  const availabilityOptions = [
    { value: '', label: 'Any Availability' },
    { value: 'online', label: 'Online Now' },
    { value: 'active-today', label: 'Active Today' },
    { value: 'active-week', label: 'Active This Week' }
  ];

  const skillCategories = [
    {
      category: 'Programming',
      skills: ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'Machine Learning']
    },
    {
      category: 'Design',
      skills: ['UI/UX Design', 'Graphic Design', 'Figma', 'Adobe Creative Suite', 'Prototyping']
    },
    {
      category: 'Business',
      skills: ['Marketing', 'Finance', 'Project Management', 'Data Analysis', 'Strategy']
    },
    {
      category: 'Academic',
      skills: ['Research', 'Writing', 'Statistics', 'Laboratory Skills', 'Public Speaking']
    }
  ];

  const lookingForOptions = [
    'Study Partner',
    'Project Collaborator',
    'Research Partner',
    'Mentor',
    'Mentee',
    'Networking',
    'Internship Buddy',
    'Career Advice'
  ];

  const projectTypes = [
    'Web Development',
    'Mobile App',
    'Research Project',
    'Startup Idea',
    'Academic Paper',
    'Design Portfolio',
    'Data Science',
    'Machine Learning',
    'Game Development',
    'Social Impact'
  ];

  const handleSkillToggle = (skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev?.skills?.includes(skill)
        ? prev?.skills?.filter(s => s !== skill)
        : [...prev?.skills, skill]
    }));
  };

  const handleLookingForToggle = (option) => {
    setFilters(prev => ({
      ...prev,
      lookingFor: prev?.lookingFor?.includes(option)
        ? prev?.lookingFor?.filter(o => o !== option)
        : [...prev?.lookingFor, option]
    }));
  };

  const handleProjectTypeToggle = (type) => {
    setFilters(prev => ({
      ...prev,
      projectType: prev?.projectType?.includes(type)
        ? prev?.projectType?.filter(t => t !== type)
        : [...prev?.projectType, type]
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      major: '',
      year: '',
      skills: [],
      interests: [],
      lookingFor: [],
      availability: '',
      location: '',
      classes: '',
      projectType: []
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
      <div className="bg-card border border-border rounded-lg shadow-interactive w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-card-foreground">Advanced Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 max-h-96 overflow-y-auto">
          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Major"
              options={majorOptions}
              value={filters?.major}
              onChange={(value) => setFilters(prev => ({ ...prev, major: value }))}
            />
            <Select
              label="Academic Year"
              options={yearOptions}
              value={filters?.year}
              onChange={(value) => setFilters(prev => ({ ...prev, year: value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Current Classes"
              type="text"
              placeholder="e.g., CS 101, Math 201"
              value={filters?.classes}
              onChange={(e) => setFilters(prev => ({ ...prev, classes: e?.target?.value }))}
              description="Comma-separated class codes"
            />
            <Select
              label="Availability"
              options={availabilityOptions}
              value={filters?.availability}
              onChange={(value) => setFilters(prev => ({ ...prev, availability: value }))}
            />
          </div>

          {/* Skills */}
          <div>
            <label className="text-sm font-medium text-card-foreground mb-3 block">Skills</label>
            <div className="space-y-4">
              {skillCategories?.map((category) => (
                <div key={category?.category}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">{category?.category}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {category?.skills?.map((skill) => (
                      <Checkbox
                        key={skill}
                        label={skill}
                        checked={filters?.skills?.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        size="sm"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Looking For */}
          <div>
            <label className="text-sm font-medium text-card-foreground mb-3 block">Looking For</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {lookingForOptions?.map((option) => (
                <Checkbox
                  key={option}
                  label={option}
                  checked={filters?.lookingFor?.includes(option)}
                  onChange={() => handleLookingForToggle(option)}
                  size="sm"
                />
              ))}
            </div>
          </div>

          {/* Project Types */}
          <div>
            <label className="text-sm font-medium text-card-foreground mb-3 block">Project Types</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {projectTypes?.map((type) => (
                <Checkbox
                  key={type}
                  label={type}
                  checked={filters?.projectType?.includes(type)}
                  onChange={() => handleProjectTypeToggle(type)}
                  size="sm"
                />
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <Input
              label="Location"
              type="text"
              placeholder="e.g., Campus, Dorm, City"
              value={filters?.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e?.target?.value }))}
              description="Filter by location or proximity"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Reset All
            </Button>
            <Button variant="default" onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilterPanel;