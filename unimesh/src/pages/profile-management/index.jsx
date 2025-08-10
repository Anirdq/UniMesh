import React, { useState, useEffect } from "react";
import { User, Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Header from "../../components/ui/Header";
import ProfilePhotoUpload from "./components/ProfilePhotoUpload";
import SkillsInterestsSection from "./components/SkillsInterestsSection";
import LearningSection from "./components/LearningSection";
import BuildingSection from "./components/BuildingSection";
import LookingForSection from "./components/LookingForSection";
import ProfilePreview from "./components/ProfilePreview";
import PrivacyControls from "./components/PrivacyControls";
import { useAuth } from "../../contexts/AuthContext";
import { profileService } from "../../utils/profileService";

export default function ProfileManagement() {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    id: '',
    full_name: '',
    email: '',
    university: '',
    major: '',
    academic_year: '',
    bio: '',
    looking_for: '',
    profile_picture_url: '',
    is_active: true
  });
  
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [classes, setClasses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: profileError } = await profileService?.getUserProfile(user?.id);
      
      if (profileError) {
        setError('Failed to load your profile. Please try again.');
        return;
      }
      
      if (data) {
        setProfile({
          id: data?.id || '',
          full_name: data?.full_name || '',
          email: data?.email || '',
          university: data?.university || '',
          major: data?.major || '',
          academic_year: data?.academic_year || '',
          bio: data?.bio || '',
          looking_for: data?.looking_for || '',
          profile_picture_url: data?.profile_picture_url || '',
          is_active: data?.is_active !== false
        });
        
        setSkills(data?.user_skills || []);
        setInterests(data?.user_interests || []);
        setClasses(data?.user_classes || []);
        setProjects(data?.user_projects || []);
      }
    } catch (err) {
      setError('Something went wrong while loading your profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { error: updateError } = await profileService?.updateProfile(user?.id, {
        full_name: profile?.full_name,
        university: profile?.university,
        major: profile?.major,
        academic_year: profile?.academic_year,
        bio: profile?.bio,
        looking_for: profile?.looking_for,
        is_active: profile?.is_active
      });
      
      if (updateError) {
        setError('Failed to save your profile. Please try again.');
        return;
      }
      
      setSuccess('Profile saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkillAdd = async (skillName) => {
    if (!user?.id || !skillName?.trim()) return;
    
    try {
      const { data, error } = await profileService?.addSkill(user?.id, skillName?.trim());
      
      if (error) {
        setError('Failed to add skill. Please try again.');
        return;
      }
      
      setSkills(prev => [...prev, data]);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleSkillRemove = async (skillId) => {
    try {
      const { error } = await profileService?.removeSkill(skillId);
      
      if (error) {
        setError('Failed to remove skill. Please try again.');
        return;
      }
      
      setSkills(prev => prev?.filter(skill => skill?.id !== skillId));
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleInterestAdd = async (interestName) => {
    if (!user?.id || !interestName?.trim()) return;
    
    try {
      const { data, error } = await profileService?.addInterest(user?.id, interestName?.trim());
      
      if (error) {
        setError('Failed to add interest. Please try again.');
        return;
      }
      
      setInterests(prev => [...prev, data]);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleInterestRemove = async (interestId) => {
    try {
      const { error } = await profileService?.removeInterest(interestId);
      
      if (error) {
        setError('Failed to remove interest. Please try again.');
        return;
      }
      
      setInterests(prev => prev?.filter(interest => interest?.id !== interestId));
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleClassAdd = async (classData) => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await profileService?.addClass(user?.id, classData);
      
      if (error) {
        setError('Failed to add class. Please try again.');
        return;
      }
      
      setClasses(prev => [...prev, data]);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleClassRemove = async (classId) => {
    try {
      const { error } = await profileService?.removeClass(classId);
      
      if (error) {
        setError('Failed to remove class. Please try again.');
        return;
      }
      
      setClasses(prev => prev?.filter(cls => cls?.id !== classId));
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleProjectAdd = async (projectData) => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await profileService?.addProject(user?.id, projectData);
      
      if (error) {
        setError('Failed to add project. Please try again.');
        return;
      }
      
      setProjects(prev => [...prev, data]);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleProjectUpdate = async (projectId, projectData) => {
    try {
      const { data, error } = await profileService?.updateProject(projectId, projectData);
      
      if (error) {
        setError('Failed to update project. Please try again.');
        return;
      }
      
      setProjects(prev => prev?.map(project => 
        project?.id === projectId ? data : project
      ));
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleProjectRemove = async (projectId) => {
    try {
      const { error } = await profileService?.removeProject(projectId);
      
      if (error) {
        setError('Failed to remove project. Please try again.');
        return;
      }
      
      setProjects(prev => prev?.filter(project => project?.id !== projectId));
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleProfilePictureUpload = async (file) => {
    if (!user?.id || !file) return;
    
    try {
      const { data, error } = await profileService?.uploadProfilePicture(user?.id, file);
      
      if (error) {
        setError('Failed to upload profile picture. Please try again.');
        return;
      }
      
      setProfile(prev => ({
        ...prev,
        profile_picture_url: data?.profile_picture_url
      }));
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onSearch={() => {}} />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Please sign in</h2>
            <p className="text-gray-600">Sign in to manage your profile</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onSearch={() => {}} />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onSearch={() => {}} />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
              <p className="text-gray-600 mt-2">Create your living, breathing story</p>
            </div>
            
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'profile', label: 'Basic Info' },
                  { id: 'skills', label: 'Skills & Interests' },
                  { id: 'learning', label: 'Learning' },
                  { id: 'building', label: 'Building' },
                  { id: 'preview', label: 'Preview' }
                ]?.map(tab => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab?.id
                        ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab?.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <ProfilePhotoUpload
                    currentPhoto={profile?.profile_picture_url}
                    onPhotoChange={handleProfilePictureUpload}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={profile?.full_name || ''}
                        onChange={(e) => setProfile(prev => ({ ...prev, full_name: e?.target?.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile?.email || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        University *
                      </label>
                      <input
                        type="text"
                        value={profile?.university || ''}
                        onChange={(e) => setProfile(prev => ({ ...prev, university: e?.target?.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your university"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Major
                      </label>
                      <input
                        type="text"
                        value={profile?.major || ''}
                        onChange={(e) => setProfile(prev => ({ ...prev, major: e?.target?.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your major"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Academic Year
                      </label>
                      <select
                        value={profile?.academic_year || ''}
                        onChange={(e) => setProfile(prev => ({ ...prev, academic_year: e?.target?.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select year</option>
                        <option value="freshman">Freshman</option>
                        <option value="sophomore">Sophomore</option>
                        <option value="junior">Junior</option>
                        <option value="senior">Senior</option>
                        <option value="graduate">Graduate</option>
                        <option value="phd">PhD</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profile?.bio || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e?.target?.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  <LookingForSection
                    lookingFor={profile?.looking_for || ''}
                    onUpdate={(value) => setProfile(prev => ({ ...prev, looking_for: value }))}
                  />
                  
                  <PrivacyControls
                    isActive={profile?.is_active}
                    onToggle={(value) => setProfile(prev => ({ ...prev, is_active: value }))}
                  />
                </div>
              )}

              {activeTab === 'skills' && (
                <SkillsInterestsSection
                  skillsData={{ skills, interests }}
                  onSkillsChange={{
                    onSkillAdd: handleSkillAdd,
                    onSkillRemove: handleSkillRemove,
                    onInterestAdd: handleInterestAdd,
                    onInterestRemove: handleInterestRemove
                  }}
                />
              )}

              {activeTab === 'learning' && (
                <LearningSection
                  learningData={classes}
                  onLearningChange={{
                    onClassAdd: handleClassAdd,
                    onClassRemove: handleClassRemove
                  }}
                />
              )}

              {activeTab === 'building' && (
                <BuildingSection
                  projectsData={projects}
                  onProjectsChange={{
                    onProjectAdd: handleProjectAdd,
                    onProjectUpdate: handleProjectUpdate,
                    onProjectRemove: handleProjectRemove
                  }}
                />
              )}

              {activeTab === 'preview' && (
                <ProfilePreview
                  profileData={profile}
                  skillsData={{ skills, interests }}
                  learningData={classes}
                  projectsData={projects}
                  lookingForData={profile?.looking_for}
                  privacySettings={{ isActive: profile?.is_active }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}