import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProfilePreview = ({ 
  profileData, 
  learningData, 
  projectsData, 
  skillsData, 
  lookingForData, 
  privacySettings,
  className = '' 
}) => {
  const categories = [
    { value: 'technical', label: 'Technical', icon: 'Code', color: 'bg-blue-500' },
    { value: 'creative', label: 'Creative', icon: 'Palette', color: 'bg-purple-500' },
    { value: 'academic', label: 'Academic', icon: 'BookOpen', color: 'bg-green-500' },
    { value: 'social', label: 'Social', icon: 'Users', color: 'bg-orange-500' },
    { value: 'language', label: 'Language', icon: 'Globe', color: 'bg-indigo-500' },
    { value: 'other', label: 'Other', icon: 'Star', color: 'bg-gray-500' }
  ];

  const presetOptions = [
    { id: 'study-partner', label: 'Study Partner', icon: 'BookOpen' },
    { id: 'project-teammate', label: 'Project Teammate', icon: 'Users' },
    { id: 'research-collaborator', label: 'Research Collaborator', icon: 'Search' },
    { id: 'mentor', label: 'Mentor', icon: 'UserCheck' },
    { id: 'mentee', label: 'Mentee', icon: 'Heart' },
    { id: 'networking', label: 'Networking', icon: 'Network' },
    { id: 'social-connections', label: 'Social Connections', icon: 'Coffee' },
    { id: 'skill-exchange', label: 'Skill Exchange', icon: 'ArrowLeftRight' }
  ];

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-success';
    if (progress >= 50) return 'bg-primary';
    if (progress >= 25) return 'bg-warning';
    return 'bg-muted-foreground';
  };

  const getCategoryInfo = (categoryValue) => {
    return categories?.find(cat => cat?.value === categoryValue) || categories?.[0];
  };

  const getPresetInfo = (presetId) => {
    return presetOptions?.find(option => option?.id === presetId);
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
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Profile Preview</h3>
          <div className="flex items-center space-x-2">
            <Icon name="Eye" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Live Preview</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          This is how your profile appears to other students
        </p>
      </div>
      <div className="p-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-muted border-2 border-border flex-shrink-0">
            {profileData?.photo && privacySettings?.profilePhoto ? (
              <Image
                src={profileData?.photo}
                alt="Profile photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon name="User" size={32} className="text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-foreground mb-1">
              {profileData?.name || 'Your Name'}
            </h2>
            {privacySettings?.academicInfo && (
              <p className="text-sm text-muted-foreground mb-2">
                {profileData?.major || 'Computer Science'} • {profileData?.year || 'Junior'}
              </p>
            )}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              {privacySettings?.activityStatus && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Active now</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={14} />
                <span>University Campus</span>
              </div>
            </div>
          </div>
          
          <Button variant="primary" size="sm">
            <Icon name="UserPlus" size={16} className="mr-2" />
            Connect
          </Button>
        </div>

        {/* Looking For Section */}
        {privacySettings?.lookingForSection && lookingForData?.isVisible && (
          lookingForData?.presets?.length > 0 || lookingForData?.custom?.length > 0
        ) && (
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center mb-3">
              <Icon name="UserSearch" size={16} className="text-primary mr-2" />
              <h4 className="font-medium text-foreground">Looking For</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {lookingForData?.presets?.map((presetId) => {
                const preset = getPresetInfo(presetId);
                return preset ? (
                  <span
                    key={presetId}
                    className="inline-flex items-center px-3 py-1 text-sm bg-primary text-primary-foreground rounded-full"
                  >
                    <Icon name={preset?.icon} size={14} className="mr-1" />
                    {preset?.label}
                  </span>
                ) : null;
              })}
              {lookingForData?.custom?.map((status, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full"
                >
                  {status}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Learning Section */}
        {privacySettings?.learningSection && learningData?.length > 0 && (
          <div>
            <div className="flex items-center mb-3">
              <Icon name="BookOpen" size={16} className="text-muted-foreground mr-2" />
              <h4 className="font-medium text-foreground">What I'm Learning</h4>
            </div>
            <div className="space-y-3">
              {learningData?.slice(0, 3)?.map((item) => (
                <div key={item?.id} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground text-sm">{item?.course}</span>
                    <span className="text-xs text-muted-foreground">{item?.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${getProgressColor(item?.progress)}`}
                      style={{ width: `${item?.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {learningData?.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{learningData?.length - 3} more courses
                </p>
              )}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {privacySettings?.projectsSection && projectsData?.length > 0 && (
          <div>
            <div className="flex items-center mb-3">
              <Icon name="Code" size={16} className="text-muted-foreground mr-2" />
              <h4 className="font-medium text-foreground">What I'm Building</h4>
            </div>
            <div className="space-y-3">
              {projectsData?.slice(0, 2)?.map((project) => (
                <div key={project?.id} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-foreground text-sm mb-1">{project?.title}</h5>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {project?.description}
                      </p>
                      {project?.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project?.technologies?.slice(0, 3)?.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                          {project?.technologies?.length > 3 && (
                            <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                              +{project?.technologies?.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {project?.image && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden ml-3">
                        <Image
                          src={project?.image}
                          alt={project?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {projectsData?.length > 2 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{projectsData?.length - 2} more projects
                </p>
              )}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {privacySettings?.skillsSection && skillsData?.length > 0 && (
          <div>
            <div className="flex items-center mb-3">
              <Icon name="Target" size={16} className="text-muted-foreground mr-2" />
              <h4 className="font-medium text-foreground">Skills & Interests</h4>
            </div>
            <div className="space-y-3">
              {categories?.slice(0, 3)?.map((category) => {
                const categorySkills = groupedSkills?.[category?.value] || [];
                if (categorySkills?.length === 0) return null;

                return (
                  <div key={category?.value} className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <div className={`w-2 h-2 rounded-full ${category?.color} mr-2`}></div>
                      <span className="font-medium text-foreground text-sm">{category?.label}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({categorySkills?.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {categorySkills?.slice(0, 4)?.map((skill) => (
                        <span
                          key={skill?.id}
                          className="px-2 py-0.5 text-xs bg-card border border-border text-foreground rounded-full"
                        >
                          {skill?.name}
                        </span>
                      ))}
                      {categorySkills?.length > 4 && (
                        <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                          +{categorySkills?.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Contact Information */}
        {privacySettings?.contactInfo && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-center space-x-4">
              <Button variant="outline" size="sm">
                <Icon name="Mail" size={16} className="mr-2" />
                Message
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="Calendar" size={16} className="mr-2" />
                Schedule
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePreview;