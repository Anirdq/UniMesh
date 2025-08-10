// src/utils/noticesService.js
import { supabase } from '../lib/supabase';

export const noticesService = {
  async getNotices(filters = {}) {
    try {
      let query = supabase?.from('notices')?.select(`
          *,
          author:user_profiles (id, full_name, profile_picture_url)
        `)?.eq('is_approved', true)?.or('expires_at.is.null,expires_at.gte.' + new Date()?.toISOString())?.order('is_pinned', { ascending: false })?.order('created_at', { ascending: false });

      // Apply filters
      if (filters?.category && filters?.category !== 'all') {
        query = query?.eq('category', filters?.category);
      }
      if (filters?.search) {
        query = query?.or(`
          title.ilike.%${filters?.search}%,
          content.ilike.%${filters?.search}%
        `);
      }

      const { data, error } = await query?.limit(filters?.limit || 50);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getNoticeById(noticeId) {
    try {
      const { data, error } = await supabase?.from('notices')?.select(`
          *,
          author:user_profiles (id, full_name, profile_picture_url, email)
        `)?.eq('id', noticeId)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createNotice(noticeData) {
    try {
      const { data, error } = await supabase?.from('notices')?.insert(noticeData)?.select(`
          *,
          author:user_profiles (id, full_name, profile_picture_url)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateNotice(noticeId, noticeData) {
    try {
      const { data, error } = await supabase?.from('notices')?.update(noticeData)?.eq('id', noticeId)?.select(`
          *,
          author:user_profiles (id, full_name, profile_picture_url)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteNotice(noticeId) {
    try {
      const { error } = await supabase?.from('notices')?.delete()?.eq('id', noticeId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async getMyNotices(userId) {
    try {
      const { data, error } = await supabase?.from('notices')?.select('*')?.eq('author_id', userId)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getPendingNotices() {
    try {
      const { data, error } = await supabase?.from('notices')?.select(`
          *,
          author:user_profiles (id, full_name, profile_picture_url)
        `)?.eq('is_approved', false)?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async approveNotice(noticeId, approve = true) {
    try {
      const { data, error } = await supabase?.from('notices')?.update({ 
          is_approved: approve,
          updated_at: new Date()?.toISOString()
        })?.eq('id', noticeId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async pinNotice(noticeId, pin = true) {
    try {
      const { data, error } = await supabase?.from('notices')?.update({ 
          is_pinned: pin,
          updated_at: new Date()?.toISOString()
        })?.eq('id', noticeId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};