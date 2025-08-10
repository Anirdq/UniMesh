import React, { useState, useEffect } from "react";
import { cn } from "../../utils/cn";
import { MessageSquare, Users, Search, Plus } from "lucide-react";
import Header from "../../components/ui/Header";
import ConversationList from "./components/ConversationList";
import ChatArea from "./components/ChatArea";
import NewConversationModal from "./components/NewConversationModal";
import MemberList from "./components/MemberList";
import { useAuth } from "../../contexts/AuthContext";
import { messagingService } from "../../utils/messagingService";

export default function MessagingHub() {
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMemberList, setShowMemberList] = useState(false);

  // Real-time subscription reference
  const [messageSubscription, setMessageSubscription] = useState(null);

  // Load conversations from Supabase
  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user]);

  // Set up real-time subscription when conversation is selected
  useEffect(() => {
    if (selectedConversation?.id) {
      loadMessages(selectedConversation?.id);
      
      // Set up real-time subscription
      const subscription = messagingService?.subscribeToMessages(
        selectedConversation?.id,
        (payload) => {
          if (payload?.new) {
            // Add new message to current messages
            setMessages(prev => [...prev, payload?.new]);
          }
        }
      );
      
      setMessageSubscription(subscription);
      
      return () => {
        if (subscription) {
          subscription?.unsubscribe();
        }
      };
    }
  }, [selectedConversation]);

  // Cleanup subscription on unmount
  useEffect(() => {
    return () => {
      if (messageSubscription) {
        messageSubscription?.unsubscribe();
      }
    };
  }, [messageSubscription]);

  const loadConversations = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: conversationsError } = await messagingService?.getConversations(user?.id);
      
      if (conversationsError) {
        setError('Failed to load conversations. Please try again.');
        return;
      }
      
      setConversations(data || []);
    } catch (err) {
      setError('Something went wrong while loading conversations.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    setIsLoadingMessages(true);
    setError(null);
    
    try {
      const { data, error: messagesError } = await messagingService?.getMessages(conversationId);
      
      if (messagesError) {
        setError('Failed to load messages. Please try again.');
        return;
      }
      
      setMessages(data || []);
    } catch (err) {
      setError('Something went wrong while loading messages.');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async (content, messageType = 'text', fileUrl = null) => {
    if (!user?.id || !selectedConversation?.id || (!content?.trim() && !fileUrl)) return;
    
    try {
      const { data, error } = await messagingService?.sendMessage(
        selectedConversation?.id,
        user?.id,
        content,
        messageType,
        fileUrl
      );
      
      if (error) {
        setError('Failed to send message. Please try again.');
        return;
      }
      
      // Message will be added via real-time subscription
      // But add it immediately for better UX
      if (data) {
        setMessages(prev => [...prev, data]);
      }
      
      // Update conversation list with new last message
      setConversations(prev => 
        prev?.map(conv => 
          conv?.id === selectedConversation?.id 
            ? { ...conv, latest_message: data }
            : conv
        )
      );
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleCreateConversation = async (participantIds, isGroup = false, groupName = null) => {
    if (!user?.id || !participantIds?.length) return;
    
    try {
      const { data, error } = await messagingService?.createConversation(
        user?.id,
        participantIds,
        isGroup,
        groupName
      );
      
      if (error) {
        setError('Failed to create conversation. Please try again.');
        return;
      }
      
      // Reload conversations to include the new one
      await loadConversations();
      
      // Select the new conversation
      setSelectedConversation(data);
      setShowNewConversation(false);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleFileUpload = async (file) => {
    if (!selectedConversation?.id || !file) return null;
    
    try {
      const { data: fileUrl, error } = await messagingService?.uploadMessageAttachment(
        selectedConversation?.id,
        file
      );
      
      if (error) {
        setError('Failed to upload file. Please try again.');
        return null;
      }
      
      return fileUrl;
    } catch (err) {
      setError('Something went wrong while uploading file.');
      return null;
    }
  };

  // Filter conversations based on search
  const filteredConversations = conversations?.filter(conv => {
    if (!searchQuery) return true;
    
    const query = searchQuery?.toLowerCase();
    
    // Search by conversation name
    if (conv?.name?.toLowerCase()?.includes(query)) return true;
    
    // Search by participant names
    const participantMatch = conv?.participants?.some(p => 
      p?.user_profiles?.full_name?.toLowerCase()?.includes(query)
    );
    
    return participantMatch;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onSearch={() => {}} />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Please sign in</h2>
            <p className="text-gray-600">Sign in to access your messages and conversations</p>
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
          <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[calc(100vh-200px)]">
            <div className="flex h-full">
              {/* Sidebar */}
              <div className="w-80 border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                    <button
                      onClick={() => setShowNewConversation(true)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Start new conversation"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e?.target?.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                  <ConversationList
                    conversations={filteredConversations}
                    selectedConversation={selectedConversation}
                    currentUserId={user?.id}
                    isLoading={isLoading}
                    onSelectConversation={setSelectedConversation}
                    onNewConversation={() => setShowNewConversation(true)}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filterType="all"
                    onFilterChange={() => {}}
                  />
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {selectedConversation?.is_group ? (
                              <Users className="w-5 h-5 text-blue-600" />
                            ) : (
                              <MessageSquare className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {selectedConversation?.name || 
                               selectedConversation?.participants
                                 ?.filter(p => p?.user_id !== user?.id)
                                 ?.map(p => p?.user_profiles?.full_name)
                                 ?.join(', ') || 
                               'Unknown'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {selectedConversation?.is_group 
                                ? `${selectedConversation?.participants?.length || 0} members`
                                : 'Direct message'
                              }
                            </p>
                          </div>
                        </div>
                        
                        {selectedConversation?.is_group && (
                          <button
                            onClick={() => setShowMemberList(true)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Users className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-hidden">
                      <ChatArea
                        conversation={selectedConversation}
                        messages={messages}
                        currentUserId={user?.id}
                        isLoadingMessages={isLoadingMessages}
                        onSendMessage={handleSendMessage}
                        onFileUpload={handleFileUpload}
                        onBack={() => setSelectedConversation(null)}
                        onToggleMemberList={() => setShowMemberList(!showMemberList)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Select a conversation
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Choose a conversation from the sidebar to start messaging
                      </p>
                      <button
                        onClick={() => setShowNewConversation(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Start New Conversation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Modals */}
        {showNewConversation && (
          <NewConversationModal
            isOpen={showNewConversation}
            currentUserId={user?.id}
            onStartConversation={(data) => handleCreateConversation(
              data?.participants?.map(p => p?.id),
              data?.type === 'group',
              data?.groupName
            )}
            onClose={() => setShowNewConversation(false)}
          />
        )}

        {showMemberList && selectedConversation && (
          <MemberList
            isOpen={showMemberList}
            conversation={selectedConversation}
            currentUserId={user?.id}
            onClose={() => setShowMemberList(false)}
          />
        )}
      </div>
    </div>
  );
}