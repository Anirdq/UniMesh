import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const NewConversationModal = ({ 
  isOpen, 
  onClose, 
  onStartConversation, 
  recentConnections = [],
  suggestedUsers = [] 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [conversationType, setConversationType] = useState('direct'); // 'direct' or 'group'
  const [groupName, setGroupName] = useState('');

  const allUsers = [...recentConnections, ...suggestedUsers];
  const filteredUsers = allUsers?.filter(user =>
    user?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    user?.major?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const handleUserSelect = (user) => {
    if (selectedUsers?.find(u => u?.id === user?.id)) {
      setSelectedUsers(selectedUsers?.filter(u => u?.id !== user?.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleStartConversation = () => {
    if (selectedUsers?.length === 0) return;

    const conversationData = {
      type: selectedUsers?.length === 1 ? 'direct' : 'group',
      participants: selectedUsers,
      groupName: selectedUsers?.length > 1 ? groupName : undefined
    };

    onStartConversation(conversationData);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedUsers([]);
    setGroupName('');
    setConversationType('direct');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-modal">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">New Conversation</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Input
              type="search"
              placeholder="Search students by name or major..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
          </div>

          {/* Selected Users */}
          {selectedUsers?.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-foreground">Selected ({selectedUsers?.length}):</span>
                {selectedUsers?.length > 1 && (
                  <span className="text-xs text-muted-foreground">Group chat</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedUsers?.map((user) => (
                  <div
                    key={user?.id}
                    className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full"
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                    <button
                      onClick={() => handleUserSelect(user)}
                      className="hover:bg-primary/20 rounded-full p-1 transition-smooth"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Group Name Input */}
              {selectedUsers?.length > 1 && (
                <div className="mt-3">
                  <Input
                    type="text"
                    placeholder="Enter group name (optional)"
                    value={groupName}
                    onChange={(e) => setGroupName(e?.target?.value)}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {/* Recent Connections */}
          {recentConnections?.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">Recent Connections</h3>
              <div className="space-y-2">
                {recentConnections?.filter(user => user?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()))?.map((user) => {
                    const isSelected = selectedUsers?.find(u => u?.id === user?.id);
                    return (
                      <div
                        key={user?.id}
                        onClick={() => handleUserSelect(user)}
                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-smooth ${
                          isSelected 
                            ? 'bg-primary/10 border border-primary/20' :'hover:bg-muted/50'
                        }`}
                      >
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                            <Image
                              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                              alt={user?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {user?.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{user?.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {user?.major} • {user?.year}
                          </p>
                          {user?.lastInteraction && (
                            <p className="text-xs text-muted-foreground">
                              Last message: {new Date(user.lastInteraction)?.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <Icon name="Check" size={20} className="text-primary" />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Suggested Users */}
          {suggestedUsers?.length > 0 && (
            <div className="p-4 border-t border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">Suggested Connections</h3>
              <div className="space-y-2">
                {suggestedUsers?.filter(user => user?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()))?.map((user) => {
                    const isSelected = selectedUsers?.find(u => u?.id === user?.id);
                    return (
                      <div
                        key={user?.id}
                        onClick={() => handleUserSelect(user)}
                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-smooth ${
                          isSelected 
                            ? 'bg-primary/10 border border-primary/20' :'hover:bg-muted/50'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                          <Image
                            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                            alt={user?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{user?.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {user?.major} • {user?.year}
                          </p>
                          {user?.commonInterests && user?.commonInterests?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {user?.commonInterests?.slice(0, 2)?.map((interest, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded-full"
                                >
                                  {interest}
                                </span>
                              ))}
                              {user?.commonInterests?.length > 2 && (
                                <span className="text-xs text-muted-foreground">
                                  +{user?.commonInterests?.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <Icon name="Check" size={20} className="text-primary" />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredUsers?.length === 0 && searchQuery && (
            <div className="p-8 text-center">
              <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-medium text-foreground mb-2">No users found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms or browse suggested connections
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleStartConversation}
              disabled={selectedUsers?.length === 0}
              className="flex-1"
            >
              Start Conversation
              {selectedUsers?.length > 0 && (
                <span className="ml-2 bg-primary-foreground/20 text-primary-foreground px-2 py-0.5 rounded-full text-xs">
                  {selectedUsers?.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewConversationModal;