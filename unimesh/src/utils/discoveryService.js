// src/utils/discoveryService.js
import { supabase } from '../lib/supabase';

export const discoveryService = {
  async getStudentProfiles(filters = {}) {
    try {
      let query = supabase?.from('user_profiles')?.select(`
          *,
          user_skills (skill_name),
          user_interests (interest_name),
          user_classes (class_code, class_name),
          user_projects (project_name, description)
        `)?.eq('is_active', true)?.neq('id', filters?.excludeUserId || '');

      // Apply filters
      if (filters?.university) {
        query = query?.ilike('university', `%${filters?.university}%`);
      }
      if (filters?.major) {
        query = query?.ilike('major', `%${filters?.major}%`);
      }
      if (filters?.academicYear) {
        query = query?.eq('academic_year', filters?.academicYear);
      }
      if (filters?.lookingFor) {
        query = query?.ilike('looking_for', `%${filters?.lookingFor}%`);
      }

      const { data, error } = await query?.limit(filters?.limit || 20);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async searchStudents(searchTerm, filters = {}) {
    try {
      let query = supabase?.from('user_profiles')?.select(`
          *,
          user_skills (skill_name),
          user_interests (interest_name),
          user_classes (class_code, class_name),
          user_projects (project_name, description)
        `)?.eq('is_active', true)?.neq('id', filters?.excludeUserId || '');

      if (searchTerm) {
        query = query?.or(`
          full_name.ilike.%${searchTerm}%,
          major.ilike.%${searchTerm}%,
          bio.ilike.%${searchTerm}%,
          looking_for.ilike.%${searchTerm}%
        `);
      }

      const { data, error } = await query?.limit(filters?.limit || 20);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async sendConnectionRequest(requesterId, requesteeId, message = '') {
    try {
      const { data, error } = await supabase?.from('connections')?.insert({
          requester_id: requesterId,
          requestee_id: requesteeId,
          message,
          status: 'pending'
        })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getConnectionStatus(userId, otherUserId) {
    try {
      const { data, error } = await supabase?.from('connections')?.select('*')?.or(`
          and(requester_id.eq.${userId},requestee_id.eq.${otherUserId}),
          and(requester_id.eq.${otherUserId},requestee_id.eq.${userId})
        `)?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      return { data: data || null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getPendingConnectionRequests(userId) {
    try {
      const { data, error } = await supabase?.from('connections')?.select(`
          *,
          requester:user_profiles!connections_requester_id_fkey (
            id, full_name, major, profile_picture_url
          )
        `)?.eq('requestee_id', userId)?.eq('status', 'pending');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async respondToConnection(connectionId, accept) {
    try {
      const { data, error } = await supabase?.from('connections')?.update({ 
          status: accept ? 'accepted' : 'declined',
          updated_at: new Date()?.toISOString()
        })?.eq('id', connectionId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getMyConnections(userId) {
    try {
      const { data, error } = await supabase?.from('connections')?.select(`
          *,
          requester:user_profiles!connections_requester_id_fkey (
            id, full_name, major, profile_picture_url, looking_for
          ),
          requestee:user_profiles!connections_requestee_id_fkey (
            id, full_name, major, profile_picture_url, looking_for
          )
        `)?.or(`requester_id.eq.${userId},requestee_id.eq.${userId}`)?.eq('status', 'accepted');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};