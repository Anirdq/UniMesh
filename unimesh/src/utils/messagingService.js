// src/utils/messagingService.js
import { supabase } from '../lib/supabase';

export const messagingService = {
  async getConversations(userId) {
    try {
      const { data, error } = await supabase?.from('conversation_participants')?.select(`
          conversation_id,
          conversations (
            id, name, is_group, created_by, created_at, updated_at,
            messages (content, created_at, sender_id)
          )
        `)?.eq('user_id', userId);

      if (error) throw error;

      // Get the latest message for each conversation
      const conversationsWithDetails = await Promise.all(
        data?.map(async (item) => {
          const conversation = item?.conversations;
          
          // Get all participants
          const { data: participants, error: participantsError } = await supabase?.from('conversation_participants')?.select(`
              user_id,
              user_profiles (id, full_name, profile_picture_url)
            `)?.eq('conversation_id', conversation?.id);

          if (participantsError) throw participantsError;

          // Get latest message
          const { data: latestMessage, error: messageError } = await supabase?.from('messages')?.select(`
              content, created_at, sender_id,
              sender:user_profiles (full_name)
            `)?.eq('conversation_id', conversation?.id)?.order('created_at', { ascending: false })?.limit(1)?.single();

          return {
            ...conversation,
            participants: participants || [],
            latest_message: messageError ? null : latestMessage
          };
        }) || []
      );

      return { data: conversationsWithDetails, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getMessages(conversationId) {
    try {
      const { data, error } = await supabase?.from('messages')?.select(`
          *,
          sender:user_profiles (id, full_name, profile_picture_url)
        `)?.eq('conversation_id', conversationId)?.order('created_at', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async sendMessage(conversationId, senderId, content, messageType = 'text', fileUrl = null) {
    try {
      const { data, error } = await supabase?.from('messages')?.insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content,
          message_type: messageType,
          file_url: fileUrl
        })?.select(`
          *,
          sender:user_profiles (id, full_name, profile_picture_url)
        `)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createConversation(creatorId, participantIds, isGroup = false, name = null) {
    try {
      // Create conversation
      const { data: conversation, error: conversationError } = await supabase?.from('conversations')?.insert({
          name,
          is_group: isGroup,
          created_by: creatorId
        })?.select()?.single();

      if (conversationError) throw conversationError;

      // Add all participants including creator
      const allParticipants = [creatorId, ...participantIds];
      const { error: participantsError } = await supabase?.from('conversation_participants')?.insert(
          allParticipants?.map(userId => ({
            conversation_id: conversation?.id,
            user_id: userId
          }))
        );

      if (participantsError) throw participantsError;

      return { data: conversation, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async addParticipant(conversationId, userId) {
    try {
      const { data, error } = await supabase?.from('conversation_participants')?.insert({
          conversation_id: conversationId,
          user_id: userId
        })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async leaveConversation(conversationId, userId) {
    try {
      const { error } = await supabase?.from('conversation_participants')?.delete()?.eq('conversation_id', conversationId)?.eq('user_id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async pinMessage(messageId, isPinned = true) {
    try {
      const { data, error } = await supabase?.from('messages')?.update({ is_pinned: isPinned })?.eq('id', messageId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async uploadMessageAttachment(conversationId, file) {
    try {
      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${conversationId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase?.storage?.from('message-attachments')?.upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase?.storage?.from('message-attachments')?.getPublicUrl(fileName);

      return { data: publicUrl, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Real-time subscription for messages
  subscribeToMessages(conversationId, callback) {
    return supabase?.channel(`messages:${conversationId}`)?.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        callback
      )?.subscribe();
  }
};