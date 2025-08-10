import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const BuildingSection = ({ projectsData, onProjectsChange, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    githubLink: '',
    image: null,
    technologies: [],
    status: 'in-progress'
  });
  const [newTech, setNewTech] = useState('');

  const statusOptions = [
    { value: 'planning', label: 'Planning', color: 'bg-muted-foreground' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-warning' },
    { value: 'completed', label: 'Completed', color: 'bg-success' },
    { value: 'on-hold', label: 'On Hold', color: 'bg-error' }
  ];

  const techSuggestions = [
    'React', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 'Java',
    'C++', 'HTML/CSS', 'MongoDB', 'PostgreSQL', 'Firebase', 'AWS',
    'Docker', 'Git', 'Redux', 'Express.js', 'Flutter', 'Swift'
  ];

  const handleAddProject = () => {
    if (newProject?.title?.trim() && newProject?.description?.trim()) {
      const projectToAdd = {
        ...newProject,
        id: Date.now(),
        createdAt: new Date()?.toISOString()?.split('T')?.[0]
      };
      
      onProjectsChange([...projectsData, projectToAdd]);
      setNewProject({
        title: '',
        description: '',
        githubLink: '',
        image: null,
        technologies: [],
        status: 'in-progress'
      });
    }
  };

  const handleRemoveProject = (id) => {
    onProjectsChange(projectsData?.filter(project => project?.id !== id));
  };

  const handleAddTechnology = () => {
    if (newTech?.trim() && !newProject?.technologies?.includes(newTech?.trim())) {
      setNewProject({
        ...newProject,
        technologies: [...newProject?.technologies, newTech?.trim()]
      });
      setNewTech('');
    }
  };

  const handleRemoveTechnology = (tech) => {
    setNewProject({
      ...newProject,
      technologies: newProject?.technologies?.filter(t => t !== tech)
    });
  };

  const handleImageUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file && file?.type?.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProject({
          ...newProject,
          image: e?.target?.result
        });
      };
      reader?.readAsDataURL(file);
    }
  };

  const getStatusInfo = (status) => {
    return statusOptions?.find(option => option?.value === status) || statusOptions?.[1];
  };

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Icon name="Code" size={20} className="text-primary mr-3" />
          <h3 className="text-lg font-semibold text-foreground">What I'm Building</h3>
          <span className="ml-2 text-sm text-muted-foreground">
            ({projectsData?.length} projects)
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
          {/* Current Projects */}
          <div className="space-y-6 mb-6">
            {projectsData?.map((project) => {
              const statusInfo = getStatusInfo(project?.status);
              return (
                <div key={project?.id} className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="font-medium text-foreground mr-3">{project?.title}</h4>
                        <span className={`px-2 py-1 text-xs text-white rounded-full ${statusInfo?.color}`}>
                          {statusInfo?.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{project?.description}</p>
                      
                      {project?.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project?.technologies?.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {project?.githubLink && (
                        <a
                          href={project?.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-smooth"
                        >
                          <Icon name="Github" size={16} className="mr-2" />
                          View on GitHub
                        </a>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {project?.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={project?.image}
                            alt={project?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveProject(project?.id)}
                        className="w-6 h-6 text-muted-foreground hover:text-error"
                      >
                        <Icon name="X" size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add New Project */}
          <div className="border-t border-border pt-6">
            <h4 className="font-medium text-foreground mb-4">Add New Project</h4>
            <div className="space-y-4">
              <Input
                label="Project Title"
                type="text"
                placeholder="e.g., Personal Portfolio Website"
                value={newProject?.title}
                onChange={(e) => setNewProject({ ...newProject, title: e?.target?.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe your project, its goals, and current status..."
                  value={newProject?.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e?.target?.value })}
                  className="w-full h-24 px-3 py-2 bg-input border border-border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  required
                />
              </div>

              <Input
                label="GitHub Link (Optional)"
                type="url"
                placeholder="https://github.com/username/project"
                value={newProject?.githubLink}
                onChange={(e) => setNewProject({ ...newProject, githubLink: e?.target?.value })}
              />

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Technologies Used
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {newProject?.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
                    >
                      {tech}
                      <button
                        onClick={() => handleRemoveTechnology(tech)}
                        className="ml-2 text-primary/60 hover:text-primary"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add technology"
                    value={newTech}
                    onChange={(e) => setNewTech(e?.target?.value)}
                    onKeyPress={(e) => e?.key === 'Enter' && (e?.preventDefault(), handleAddTechnology())}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleAddTechnology}
                    disabled={!newTech?.trim()}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {techSuggestions?.filter(tech => !newProject?.technologies?.includes(tech))?.slice(0, 6)?.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => {
                          setNewProject({
                            ...newProject,
                            technologies: [...newProject?.technologies, tech]
                          });
                        }}
                        className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-full transition-smooth"
                      >
                        + {tech}
                      </button>
                    ))}
                </div>
              </div>

              {/* Project Image */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project Image (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  {newProject?.image && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={newProject?.image}
                        alt="Project preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </div>
              </div>

              <Button
                onClick={handleAddProject}
                disabled={!newProject?.title?.trim() || !newProject?.description?.trim()}
                className="w-full sm:w-auto"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Add Project
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingSection;