// src/utils/eventsService.js
import { supabase } from '../lib/supabase';

export const eventsService = {
  async getEvents(filters = {}) {
    try {
      let query = supabase?.from('events')?.select(`
          *,
          organizer:user_profiles (id, full_name, profile_picture_url),
          event_attendees (id, user_id, attended)
        `)?.eq('is_public', true)?.gte('start_date', new Date()?.toISOString())?.order('start_date', { ascending: true });

      // Apply filters
      if (filters?.eventType) {
        query = query?.eq('event_type', filters?.eventType);
      }
      if (filters?.location) {
        query = query?.ilike('location', `%${filters?.location}%`);
      }
      if (filters?.search) {
        query = query?.or(`
          title.ilike.%${filters?.search}%,
          description.ilike.%${filters?.search}%,
          location.ilike.%${filters?.search}%
        `);
      }

      const { data, error } = await query?.limit(filters?.limit || 50);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getEventById(eventId) {
    try {
      const { data, error } = await supabase?.from('events')?.select(`
          *,
          organizer:user_profiles (id, full_name, profile_picture_url, email),
          event_attendees (
            id, user_id, attended, created_at,
            user_profiles (id, full_name, profile_picture_url)
          )
        `)?.eq('id', eventId)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createEvent(eventData) {
    try {
      const { data, error } = await supabase?.from('events')?.insert(eventData)?.select(`
          *,
          organizer:user_profiles (id, full_name, profile_picture_url)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateEvent(eventId, eventData) {
    try {
      const { data, error } = await supabase?.from('events')?.update(eventData)?.eq('id', eventId)?.select(`
          *,
          organizer:user_profiles (id, full_name, profile_picture_url)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteEvent(eventId) {
    try {
      const { error } = await supabase?.from('events')?.delete()?.eq('id', eventId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async joinEvent(eventId, userId) {
    try {
      const { data, error } = await supabase?.from('event_attendees')?.insert({
          event_id: eventId,
          user_id: userId
        })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async leaveEvent(eventId, userId) {
    try {
      const { error } = await supabase?.from('event_attendees')?.delete()?.eq('event_id', eventId)?.eq('user_id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async checkAttendance(eventId, userId) {
    try {
      const { data, error } = await supabase?.from('event_attendees')?.select('*')?.eq('event_id', eventId)?.eq('user_id', userId)?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      return { data: data || null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getMyEvents(userId, type = 'attending') {
    try {
      if (type === 'organizing') {
        const { data, error } = await supabase?.from('events')?.select(`
            *,
            event_attendees (id, user_id)
          `)?.eq('organizer_id', userId)?.order('start_date', { ascending: true });

        if (error) throw error;
        return { data, error: null };
      } else {
        const { data, error } = await supabase?.from('event_attendees')?.select(`
            *,
            events (
              *,
              organizer:user_profiles (id, full_name, profile_picture_url)
            )
          `)?.eq('user_id', userId);

        if (error) throw error;
        return { data: data?.map(item => item?.events), error: null };
      }
    } catch (error) {
      return { data: null, error };
    }
  },

  async uploadEventImage(eventId, file) {
    try {
      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${eventId}/event-image.${fileExt}`;
      
      const { error: uploadError } = await supabase?.storage?.from('event-images')?.upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase?.storage?.from('event-images')?.getPublicUrl(fileName);

      return { data: publicUrl, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};