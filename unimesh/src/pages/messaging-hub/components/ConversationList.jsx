import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';
import Image from '../../../components/AppImage';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ConversationList = ({ 
  conversations, 
  selectedConversation, 
  onSelectConversation, 
  onNewConversation,
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange 
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredConversations = conversations?.filter(conv => {
    const matchesSearch = conv?.participants?.some(p => 
      p?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    ) || conv?.lastMessage?.content?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
      (filterType === 'direct' && conv?.type === 'direct') ||
      (filterType === 'group' && conv?.type === 'group');
    
    return matchesSearch && matchesFilter;
  });

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return messageTime?.toLocaleDateString();
  };

  const getParticipantDisplay = (conversation) => {
    if (conversation?.type === 'group') {
      return {
        name: conversation?.groupName || `Group (${conversation?.participants?.length})`,
        avatar: conversation?.groupAvatar || conversation?.participants?.[0]?.avatar,
        subtitle: `${conversation?.participants?.length} members`
      };
    } else {
      const otherParticipant = conversation?.participants?.find(p => p?.id !== 'current-user');
      return {
        name: otherParticipant?.name || 'Unknown User',
        avatar: otherParticipant?.avatar,
        subtitle: otherParticipant?.status || 'Student'
      };
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Messages</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNewConversation}
            className="text-primary hover:bg-primary/10"
          >
            <Icon name="Plus" size={20} />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Input
            type="search"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e?.target?.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="pl-10"
          />
          <Icon 
            name="Search" 
            size={16} 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-smooth ${
              isSearchFocused ? 'text-primary' : 'text-muted-foreground'
            }`}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex mt-3 bg-muted rounded-lg p-1">
          {[
            { key: 'all', label: 'All', count: conversations?.length },
            { key: 'direct', label: 'Direct', count: conversations?.filter(c => c?.type === 'direct')?.length },
            { key: 'group', label: 'Groups', count: conversations?.filter(c => c?.type === 'group')?.length }
          ]?.map((filter) => (
            <button
              key={filter?.key}
              onClick={() => onFilterChange(filter?.key)}
              className={cn("flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth",
                filterType === filter?.key
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {filter?.label}
              {filter?.count > 0 && (
                <span className={cn("ml-1 text-xs",
                  filterType === filter?.key ? 'text-muted-foreground' : 'text-muted-foreground'
                )}>
                  ({filter?.count})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations?.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="MessageCircle" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-medium text-foreground mb-2">No conversations found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Start a new conversation to get connected'}
            </p>
            <Button variant="outline" onClick={onNewConversation}>
              <Icon name="Plus" size={16} className="mr-2" />
              New Conversation
            </Button>
          </div>
        ) : (
          filteredConversations?.map((conversation) => {
            const display = getParticipantDisplay(conversation);
            const isSelected = selectedConversation?.id === conversation?.id;
            
            return (
              <div
                key={conversation?.id}
                onClick={() => onSelectConversation(conversation)}
                className={cn("p-4 border-b border-border cursor-pointer transition-smooth hover:bg-muted/50",
                  isSelected ? 'bg-primary/5 border-r-2 border-r-primary' : ''
                )}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {conversation?.type === 'group' ? (
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                        <Icon name="Users" size={20} className="text-secondary-foreground" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                        <Image
                          src={display?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${display?.name}`}
                          alt={display?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {conversation?.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center pulse-gentle">
                        {conversation?.unreadCount > 9 ? '9+' : conversation?.unreadCount}
                      </div>
                    )}
                    {conversation?.type === 'direct' && conversation?.participants?.find(p => p?.id !== 'current-user')?.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-medium truncate ${
                        conversation?.unreadCount > 0 ? 'text-foreground' : 'text-foreground'
                      }`}>
                        {display?.name}
                      </h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {conversation?.lastMessage && formatTimestamp(conversation?.lastMessage?.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-1 truncate">
                      {display?.subtitle}
                    </p>

                    {conversation?.lastMessage && (
                      <div className="flex items-center space-x-1">
                        {conversation?.lastMessage?.senderId === 'current-user' && (
                          <Icon 
                            name={conversation?.lastMessage?.status === 'read' ? 'CheckCheck' : 'Check'} 
                            size={12} 
                            className={`flex-shrink-0 ${
                              conversation?.lastMessage?.status === 'read' ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          />
                        )}
                        <p className={`text-sm truncate ${
                          conversation?.unreadCount > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'
                        }`}>
                          {conversation?.lastMessage?.type === 'text' 
                            ? conversation?.lastMessage?.content 
                            : conversation?.lastMessage?.type === 'image' ?'📷 Photo' 
                            : conversation?.lastMessage?.type === 'file' ?'📎 File' :'Message'
                          }
                        </p>
                      </div>
                    )}

                    {/* Context Card Preview */}
                    {conversation?.contextCard && (
                      <div className="mt-2 p-2 bg-primary/5 rounded-md border border-primary/20">
                        <p className="text-xs text-primary font-medium">
                          Connected via: {conversation?.contextCard?.lookingFor}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;