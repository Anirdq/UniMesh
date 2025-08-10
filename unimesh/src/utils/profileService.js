// src/utils/profileService.js
import { supabase } from '../lib/supabase';

export const profileService = {
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select(`
          *,
          user_skills (id, skill_name),
          user_interests (id, interest_name),
          user_classes (id, class_code, class_name, semester),
          user_projects (id, project_name, description, repository_url, demo_url, technologies)
        `)?.eq('id', userId)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateProfile(userId, profileData) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(profileData)?.eq('id', userId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async addSkill(userId, skillName) {
    try {
      const { data, error } = await supabase?.from('user_skills')?.insert({ user_id: userId, skill_name: skillName })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async removeSkill(skillId) {
    try {
      const { error } = await supabase?.from('user_skills')?.delete()?.eq('id', skillId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async addInterest(userId, interestName) {
    try {
      const { data, error } = await supabase?.from('user_interests')?.insert({ user_id: userId, interest_name: interestName })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async removeInterest(interestId) {
    try {
      const { error } = await supabase?.from('user_interests')?.delete()?.eq('id', interestId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async addClass(userId, classData) {
    try {
      const { data, error } = await supabase?.from('user_classes')?.insert({ user_id: userId, ...classData })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async removeClass(classId) {
    try {
      const { error } = await supabase?.from('user_classes')?.delete()?.eq('id', classId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async addProject(userId, projectData) {
    try {
      const { data, error } = await supabase?.from('user_projects')?.insert({ user_id: userId, ...projectData })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateProject(projectId, projectData) {
    try {
      const { data, error } = await supabase?.from('user_projects')?.update(projectData)?.eq('id', projectId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async removeProject(projectId) {
    try {
      const { error } = await supabase?.from('user_projects')?.delete()?.eq('id', projectId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async uploadProfilePicture(userId, file) {
    try {
      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${userId}/profile.${fileExt}`;
      
      const { error: uploadError } = await supabase?.storage?.from('profile-images')?.upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase?.storage?.from('profile-images')?.getPublicUrl(fileName);

      // Update profile with new picture URL
      const { data, error: updateError } = await supabase?.from('user_profiles')?.update({ profile_picture_url: publicUrl })?.eq('id', userId)?.select()?.single();

      if (updateError) throw updateError;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};