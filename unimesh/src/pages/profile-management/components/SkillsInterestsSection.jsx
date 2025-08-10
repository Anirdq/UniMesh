import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SkillsInterestsSection = ({ skillsData, onSkillsChange, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [newCategory, setNewCategory] = useState('technical');
  const [newLevel, setNewLevel] = useState('beginner');

  const categories = [
    { value: 'technical', label: 'Technical', icon: 'Code', color: 'bg-blue-500' },
    { value: 'creative', label: 'Creative', icon: 'Palette', color: 'bg-purple-500' },
    { value: 'academic', label: 'Academic', icon: 'BookOpen', color: 'bg-green-500' },
    { value: 'social', label: 'Social', icon: 'Users', color: 'bg-orange-500' },
    { value: 'language', label: 'Language', icon: 'Globe', color: 'bg-indigo-500' },
    { value: 'other', label: 'Other', icon: 'Star', color: 'bg-gray-500' }
  ];

  const skillLevels = [
    { value: 'beginner', label: 'Beginner', color: 'bg-red-500' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-500' },
    { value: 'advanced', label: 'Advanced', color: 'bg-blue-500' },
    { value: 'expert', label: 'Expert', color: 'bg-green-500' }
  ];

  const skillSuggestions = {
    technical: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'Docker', 'AWS'],
    creative: ['Photoshop', 'Illustrator', 'Figma', 'Video Editing', 'Photography', 'UI/UX Design'],
    academic: ['Research', 'Data Analysis', 'Technical Writing', 'Public Speaking', 'Critical Thinking'],
    social: ['Leadership', 'Team Management', 'Communication', 'Networking', 'Mentoring'],
    language: ['Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Arabic'],
    other: ['Project Management', 'Event Planning', 'Marketing', 'Sales', 'Customer Service']
  };

  const handleAddSkill = () => {
    if (newSkill?.trim()) {
      const skillToAdd = {
        id: Date.now(),
        name: newSkill?.trim(),
        category: newCategory,
        level: newLevel,
        addedAt: new Date()?.toISOString()?.split('T')?.[0]
      };
      
      onSkillsChange([...skillsData, skillToAdd]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (id) => {
    onSkillsChange(skillsData?.filter(skill => skill?.id !== id));
  };

  const handleUpdateSkillLevel = (id, newLevelValue) => {
    onSkillsChange(
      skillsData?.map(skill =>
        skill?.id === id ? { ...skill, level: newLevelValue } : skill
      )
    );
  };

  const getCategoryInfo = (categoryValue) => {
    return categories?.find(cat => cat?.value === categoryValue) || categories?.[0];
  };

  const getLevelInfo = (levelValue) => {
    return skillLevels?.find(level => level?.value === levelValue) || skillLevels?.[0];
  };

  const groupedSkills = skillsData?.reduce((acc, skill) => {
    if (!acc?.[skill?.category]) {
      acc[skill.category] = [];
    }
    acc?.[skill?.category]?.push(skill);
    return acc;
  }, {});

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Icon name="Target" size={20} className="text-primary mr-3" />
          <h3 className="text-lg font-semibold text-foreground">Skills & Interests</h3>
          <span className="ml-2 text-sm text-muted-foreground">
            ({skillsData?.length} skills)
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
          {/* Current Skills by Category */}
          <div className="space-y-6 mb-6">
            {categories?.map((category) => {
              const categorySkills = groupedSkills?.[category?.value] || [];
              if (categorySkills?.length === 0) return null;

              return (
                <div key={category?.value} className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className={`w-3 h-3 rounded-full ${category?.color} mr-3`}></div>
                    <Icon name={category?.icon} size={16} className="text-muted-foreground mr-2" />
                    <h4 className="font-medium text-foreground">{category?.label}</h4>
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({categorySkills?.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categorySkills?.map((skill) => {
                      const levelInfo = getLevelInfo(skill?.level);
                      return (
                        <div
                          key={skill?.id}
                          className="flex items-center justify-between bg-card rounded-lg p-3 border border-border"
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-foreground text-sm">
                                {skill?.name}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveSkill(skill?.id)}
                                className="w-5 h-5 text-muted-foreground hover:text-error"
                              >
                                <Icon name="X" size={12} />
                              </Button>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${levelInfo?.color}`}></div>
                              <Select
                                options={skillLevels}
                                value={skill?.level}
                                onChange={(value) => handleUpdateSkillLevel(skill?.id, value)}
                                className="text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add New Skill */}
          <div className="border-t border-border pt-6">
            <h4 className="font-medium text-foreground mb-4">Add New Skill</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  options={categories}
                  value={newCategory}
                  onChange={setNewCategory}
                />

                <Select
                  label="Skill Level"
                  options={skillLevels}
                  value={newLevel}
                  onChange={setNewLevel}
                />
              </div>

              <Input
                label="Skill Name"
                type="text"
                placeholder="e.g., JavaScript, Leadership, Photography"
                value={newSkill}
                onChange={(e) => setNewSkill(e?.target?.value)}
                onKeyPress={(e) => e?.key === 'Enter' && (e?.preventDefault(), handleAddSkill())}
              />

              {/* Skill Suggestions */}
              {newCategory && skillSuggestions?.[newCategory] && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Popular {getCategoryInfo(newCategory)?.label} Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {skillSuggestions?.[newCategory]?.filter(suggestion => 
                        !skillsData?.some(skill => 
                          skill?.name?.toLowerCase() === suggestion?.toLowerCase()
                        )
                      )?.slice(0, 8)?.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setNewSkill(suggestion)}
                          className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-full transition-smooth"
                        >
                          + {suggestion}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleAddSkill}
                disabled={!newSkill?.trim()}
                className="w-full sm:w-auto"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Add Skill
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsInterestsSection;