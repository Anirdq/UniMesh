// src/utils/organizationsService.js
import { supabase } from '../lib/supabase';

export const organizationsService = {
  async getOrganizations(filters = {}) {
    try {
      let query = supabase?.from('organizations')?.select(`
          *,
          admin:user_profiles (id, full_name, profile_picture_url),
          organization_members (id, user_id, role)
        `)?.eq('is_active', true)?.order('name', { ascending: true });

      // Apply filters
      if (filters?.category) {
        query = query?.eq('category', filters?.category);
      }
      if (filters?.search) {
        query = query?.or(`
          name.ilike.%${filters?.search}%,
          description.ilike.%${filters?.search}%
        `);
      }

      const { data, error } = await query?.limit(filters?.limit || 50);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getOrganizationById(organizationId) {
    try {
      const { data, error } = await supabase?.from('organizations')?.select(`
          *,
          admin:user_profiles (id, full_name, profile_picture_url, email),
          organization_members (
            id, user_id, role, joined_at,
            user_profiles (id, full_name, profile_picture_url)
          ),
          join_requests (
            id, user_id, status, message, created_at,
            user_profiles (id, full_name, profile_picture_url)
          )
        `)?.eq('id', organizationId)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createOrganization(organizationData) {
    try {
      const { data, error } = await supabase?.from('organizations')?.insert(organizationData)?.select(`
          *,
          admin:user_profiles (id, full_name, profile_picture_url)
        `)?.single();

      if (error) throw error;

      // Automatically add creator as admin member
      if (data?.id && organizationData?.admin_id) {
        await supabase?.from('organization_members')?.insert({
            organization_id: data?.id,
            user_id: organizationData?.admin_id,
            role: 'admin'
          });
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateOrganization(organizationId, organizationData) {
    try {
      const { data, error } = await supabase?.from('organizations')?.update(organizationData)?.eq('id', organizationId)?.select(`
          *,
          admin:user_profiles (id, full_name, profile_picture_url)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteOrganization(organizationId) {
    try {
      const { error } = await supabase?.from('organizations')?.delete()?.eq('id', organizationId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async requestToJoin(organizationId, userId, message = '') {
    try {
      const { data, error } = await supabase?.from('join_requests')?.insert({
          organization_id: organizationId,
          user_id: userId,
          message,
          status: 'pending'
        })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async respondToJoinRequest(requestId, approve, responderId) {
    try {
      const { data: request, error: fetchError } = await supabase?.from('join_requests')?.select('*, organization_id, user_id')?.eq('id', requestId)?.single();

      if (fetchError) throw fetchError;

      // Update request status
      const { error: updateError } = await supabase?.from('join_requests')?.update({ 
          status: approve ? 'approved' : 'rejected',
          updated_at: new Date()?.toISOString()
        })?.eq('id', requestId);

      if (updateError) throw updateError;

      // If approved, add user to organization members
      if (approve) {
        const { error: memberError } = await supabase?.from('organization_members')?.insert({
            organization_id: request?.organization_id,
            user_id: request?.user_id,
            role: 'member'
          });

        if (memberError) throw memberError;
      }

      return { data: request, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async checkMembershipStatus(organizationId, userId) {
    try {
      // Check if user is a member
      const { data: membership, error: memberError } = await supabase?.from('organization_members')?.select('*')?.eq('organization_id', organizationId)?.eq('user_id', userId)?.single();

      if (memberError && memberError?.code !== 'PGRST116') throw memberError;

      if (membership) {
        return { data: { status: 'member', role: membership?.role }, error: null };
      }

      // Check if user has a pending request
      const { data: request, error: requestError } = await supabase?.from('join_requests')?.select('*')?.eq('organization_id', organizationId)?.eq('user_id', userId)?.eq('status', 'pending')?.single();

      if (requestError && requestError?.code !== 'PGRST116') throw requestError;

      return { 
        data: { status: request ? 'pending' : 'none' }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async leaveOrganization(organizationId, userId) {
    try {
      const { error } = await supabase?.from('organization_members')?.delete()?.eq('organization_id', organizationId)?.eq('user_id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async getMyOrganizations(userId) {
    try {
      const { data, error } = await supabase?.from('organization_members')?.select(`
          *,
          organizations (
            *,
            admin:user_profiles (id, full_name, profile_picture_url)
          )
        `)?.eq('user_id', userId);

      if (error) throw error;
      return { data: data?.map(item => item?.organizations), error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getPendingRequests(organizationId) {
    try {
      const { data, error } = await supabase?.from('join_requests')?.select(`
          *,
          user_profiles (id, full_name, profile_picture_url, major, academic_year)
        `)?.eq('organization_id', organizationId)?.eq('status', 'pending')?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async uploadOrganizationLogo(organizationId, file) {
    try {
      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${organizationId}/logo.${fileExt}`;
      
      const { error: uploadError } = await supabase?.storage?.from('organization-logos')?.upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase?.storage?.from('organization-logos')?.getPublicUrl(fileName);

      return { data: publicUrl, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};