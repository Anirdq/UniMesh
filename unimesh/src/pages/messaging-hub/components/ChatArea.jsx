import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ChatArea = ({ 
  conversation, 
  messages, 
  onSendMessage, 
  onBack,
  typingUsers = [],
  onToggleMemberList,
  showMemberList = false 
}) => {
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const emojis = ['😀', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎉', '🔥', '💯', '👏'];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (messageText?.trim()) {
      onSendMessage({
        type: 'text',
        content: messageText?.trim(),
        timestamp: new Date(),
        senderId: 'current-user'
      });
      setMessageText('');
      setIsComposing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      onSendMessage({
        type: file?.type?.startsWith('image/') ? 'image' : 'file',
        content: file?.name,
        file: file,
        timestamp: new Date(),
        senderId: 'current-user'
      });
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday?.setDate(yesterday?.getDate() - 1);

    if (messageDate?.toDateString() === today?.toDateString()) {
      return 'Today';
    } else if (messageDate?.toDateString() === yesterday?.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate?.toLocaleDateString();
    }
  };

  const getParticipantInfo = () => {
    if (conversation?.type === 'group') {
      return {
        name: conversation?.groupName || `Group (${conversation?.participants?.length})`,
        subtitle: `${conversation?.participants?.length} members`,
        avatar: conversation?.groupAvatar
      };
    } else {
      const otherParticipant = conversation?.participants?.find(p => p?.id !== 'current-user');
      return {
        name: otherParticipant?.name || 'Unknown User',
        subtitle: otherParticipant?.isOnline ? 'Online' : 'Last seen recently',
        avatar: otherParticipant?.avatar
      };
    }
  };

  const participantInfo = getParticipantInfo();

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages?.forEach(message => {
      const dateKey = formatMessageDate(message?.timestamp);
      if (!grouped?.[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped?.[dateKey]?.push(message);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <Icon name="MessageCircle" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">Select a conversation</h3>
          <p className="text-muted-foreground">Choose a conversation from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="lg:hidden"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                {conversation?.type === 'group' ? (
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                    <Icon name="Users" size={20} className="text-secondary-foreground" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={participantInfo?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${participantInfo?.name}`}
                      alt={participantInfo?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {conversation?.type === 'direct' && conversation?.participants?.find(p => p?.id !== 'current-user')?.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card"></div>
                )}
              </div>
              
              <div>
                <h2 className="font-medium text-foreground">{participantInfo?.name}</h2>
                <p className="text-sm text-muted-foreground">{participantInfo?.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {conversation?.type === 'group' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleMemberList}
                className={showMemberList ? 'bg-primary/10 text-primary' : ''}
              >
                <Icon name="Users" size={20} />
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <Icon name="Phone" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Video" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="MoreVertical" size={20} />
            </Button>
          </div>
        </div>

        {/* Context Card */}
        {conversation?.contextCard && (
          <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start space-x-3">
              <Icon name="Link" size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary">Connected via Discovery</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Looking for: {conversation?.contextCard?.lookingFor}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {conversation?.contextCard?.matchedSkills?.join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages)?.map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-muted px-3 py-1 rounded-full">
                <span className="text-xs text-muted-foreground font-medium">{date}</span>
              </div>
            </div>

            {/* Messages for this date */}
            {dateMessages?.map((message, index) => {
              const isCurrentUser = message?.senderId === 'current-user';
              const sender = conversation?.participants?.find(p => p?.id === message?.senderId);
              const showAvatar = !isCurrentUser && (
                index === dateMessages?.length - 1 || 
                dateMessages?.[index + 1]?.senderId !== message?.senderId
              );

              return (
                <div
                  key={message?.id}
                  className={`flex items-end space-x-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isCurrentUser && (
                    <div className="w-8 h-8 flex-shrink-0">
                      {showAvatar && (
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                          <Image
                            src={sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender?.name}`}
                            alt={sender?.name || 'User'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-1' : 'order-2'}`}>
                    {!isCurrentUser && showAvatar && conversation?.type === 'group' && (
                      <p className="text-xs text-muted-foreground mb-1 ml-3">{sender?.name}</p>
                    )}
                    
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isCurrentUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {message?.type === 'text' && (
                        <p className="text-sm">{message?.content}</p>
                      )}
                      
                      {message?.type === 'image' && (
                        <div className="space-y-2">
                          <div className="w-48 h-32 bg-muted/50 rounded-lg flex items-center justify-center">
                            <Icon name="Image" size={24} className="text-muted-foreground" />
                          </div>
                          <p className="text-xs opacity-80">{message?.content}</p>
                        </div>
                      )}
                      
                      {message?.type === 'file' && (
                        <div className="flex items-center space-x-2">
                          <Icon name="File" size={16} />
                          <span className="text-sm">{message?.content}</span>
                        </div>
                      )}

                      {message?.isPinned && (
                        <div className="flex items-center mt-1">
                          <Icon name="Pin" size={12} className="mr-1 opacity-70" />
                          <span className="text-xs opacity-70">Pinned</span>
                        </div>
                      )}
                    </div>
                    
                    <div className={`flex items-center mt-1 space-x-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-muted-foreground">
                        {formatMessageTime(message?.timestamp)}
                      </span>
                      {isCurrentUser && (
                        <Icon 
                          name={message?.status === 'read' ? 'CheckCheck' : 'Check'} 
                          size={12} 
                          className={message?.status === 'read' ? 'text-primary' : 'text-muted-foreground'}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Typing Indicator */}
        {typingUsers?.length > 0 && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8"></div>
            <div className="bg-muted px-4 py-2 rounded-2xl">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-muted-foreground ml-2">
                  {typingUsers?.length === 1 
                    ? `${typingUsers?.[0]} is typing...` 
                    : `${typingUsers?.length} people are typing...`
                  }
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      {/* Message Composer */}
      <div className="p-4 border-t border-border bg-card">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="mb-3 p-3 bg-muted rounded-lg">
            <div className="grid grid-cols-6 gap-2">
              {emojis?.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="p-2 hover:bg-background rounded-md transition-smooth text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef?.current?.click()}
            >
              <Icon name="Paperclip" size={20} />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={showEmojiPicker ? 'bg-primary/10 text-primary' : ''}
            >
              <Icon name="Smile" size={20} />
            </Button>
          </div>

          <div className="flex-1">
            <Input
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => {
                setMessageText(e?.target?.value);
                setIsComposing(e?.target?.value?.length > 0);
              }}
              className="w-full resize-none border border-border rounded-lg p-2"
            />
          </div>

          <Button
            type="submit"
            disabled={!messageText?.trim()}
            className="px-4"
          >
            <Icon name="Send" size={16} />
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </form>
      </div>
    </div>
  );
};

export default ChatArea;