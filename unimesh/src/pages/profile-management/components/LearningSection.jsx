import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const LearningSection = ({ learningData, onLearningChange, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newCourse, setNewCourse] = useState('');
  const [newProgress, setNewProgress] = useState(0);

  const progressOptions = [
    { value: 0, label: 'Just Started' },
    { value: 25, label: 'Beginner' },
    { value: 50, label: 'Intermediate' },
    { value: 75, label: 'Advanced' },
    { value: 100, label: 'Completed' }
  ];

  const courseSuggestions = [
    "Computer Science Fundamentals",
    "Data Structures and Algorithms",
    "Web Development",
    "Machine Learning",
    "Database Systems",
    "Software Engineering",
    "Mobile App Development",
    "Cybersecurity",
    "Artificial Intelligence",
    "Cloud Computing"
  ];

  const handleAddCourse = () => {
    if (newCourse?.trim()) {
      const newLearningItem = {
        id: Date.now(),
        course: newCourse?.trim(),
        progress: newProgress,
        startDate: new Date()?.toISOString()?.split('T')?.[0]
      };
      
      onLearningChange([...learningData, newLearningItem]);
      setNewCourse('');
      setNewProgress(0);
    }
  };

  const handleRemoveCourse = (id) => {
    onLearningChange(learningData?.filter(item => item?.id !== id));
  };

  const handleProgressChange = (id, newProgressValue) => {
    onLearningChange(
      learningData?.map(item =>
        item?.id === id ? { ...item, progress: newProgressValue } : item
      )
    );
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-success';
    if (progress >= 50) return 'bg-primary';
    if (progress >= 25) return 'bg-warning';
    return 'bg-muted-foreground';
  };

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Icon name="BookOpen" size={20} className="text-primary mr-3" />
          <h3 className="text-lg font-semibold text-foreground">What I'm Learning</h3>
          <span className="ml-2 text-sm text-muted-foreground">
            ({learningData?.length} courses)
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
          {/* Current Learning Items */}
          <div className="space-y-4 mb-6">
            {learningData?.map((item) => (
              <div key={item?.id} className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-foreground">{item?.course}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCourse(item?.id)}
                    className="w-6 h-6 text-muted-foreground hover:text-error"
                  >
                    <Icon name="X" size={14} />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium text-foreground">
                        {item?.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-smooth ${getProgressColor(item?.progress)}`}
                        style={{ width: `${item?.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Select
                    options={progressOptions}
                    value={item?.progress}
                    onChange={(value) => handleProgressChange(item?.id, value)}
                    placeholder="Update progress"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add New Course */}
          <div className="border-t border-border pt-6">
            <h4 className="font-medium text-foreground mb-4">Add New Course</h4>
            <div className="space-y-4">
              <div>
                <Input
                  label="Course or Topic"
                  type="text"
                  placeholder="e.g., Machine Learning Fundamentals"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e?.target?.value)}
                />
                
                {/* Course Suggestions */}
                {newCourse && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {courseSuggestions?.filter(suggestion => 
                          suggestion?.toLowerCase()?.includes(newCourse?.toLowerCase())
                        )?.slice(0, 3)?.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setNewCourse(suggestion)}
                            className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-full transition-smooth"
                          >
                            {suggestion}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <Select
                label="Current Progress"
                options={progressOptions}
                value={newProgress}
                onChange={setNewProgress}
                placeholder="Select your progress level"
              />

              <Button
                onClick={handleAddCourse}
                disabled={!newCourse?.trim()}
                className="w-full sm:w-auto"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Add Course
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningSection;