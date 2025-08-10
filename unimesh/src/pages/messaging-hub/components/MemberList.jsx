import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const MemberList = ({ 
  conversation, 
  onClose, 
  onRemoveMember, 
  onMakeAdmin, 
  onAddMembers,
  currentUserId = 'current-user' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddMembers, setShowAddMembers] = useState(false);

  const currentUser = conversation?.participants?.find(p => p?.id === currentUserId);
  const isAdmin = currentUser?.role === 'admin';

  const filteredMembers = conversation?.participants?.filter(member =>
    member?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const handleMemberAction = (memberId, action) => {
    switch (action) {
      case 'remove':
        onRemoveMember(memberId);
        break;
      case 'makeAdmin':
        onMakeAdmin(memberId);
        break;
      default:
        break;
    }
  };

  const getMemberStatusIcon = (member) => {
    if (member?.role === 'admin') {
      return <Icon name="Crown" size={14} className="text-warning" />;
    }
    return null;
  };

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground">Group Members</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Input
            type="search"
            placeholder="Search members..."
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

        {/* Add Members Button */}
        {isAdmin && (
          <Button
            variant="outline"
            onClick={() => setShowAddMembers(true)}
            className="w-full mt-3"
          >
            <Icon name="UserPlus" size={16} className="mr-2" />
            Add Members
          </Button>
        )}
      </div>
      {/* Member Count */}
      <div className="px-4 py-2 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          {conversation?.participants?.length} member{conversation?.participants?.length !== 1 ? 's' : ''}
        </p>
      </div>
      {/* Members List */}
      <div className="flex-1 overflow-y-auto">
        {filteredMembers?.map((member) => (
          <div key={member?.id} className="p-4 border-b border-border hover:bg-muted/50 transition-smooth">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={member?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member?.name}`}
                      alt={member?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {member?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-foreground truncate">
                      {member?.name}
                      {member?.id === currentUserId && (
                        <span className="text-sm text-muted-foreground ml-1">(You)</span>
                      )}
                    </h4>
                    {getMemberStatusIcon(member)}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {member?.major || 'Student'} • {member?.year || 'University'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member?.isOnline ? 'Online' : 'Last seen recently'}
                  </p>
                </div>
              </div>

              {/* Member Actions */}
              {isAdmin && member?.id !== currentUserId && (
                <div className="flex items-center space-x-1">
                  {member?.role !== 'admin' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMemberAction(member?.id, 'makeAdmin')}
                      title="Make Admin"
                    >
                      <Icon name="Crown" size={16} />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMemberAction(member?.id, 'remove')}
                    className="text-error hover:text-error hover:bg-error/10"
                    title="Remove Member"
                  >
                    <Icon name="UserMinus" size={16} />
                  </Button>
                </div>
              )}
            </div>

            {/* Member Skills/Interests */}
            {member?.skills && member?.skills?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {member?.skills?.slice(0, 3)?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {member?.skills?.length > 3 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                    +{member?.skills?.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Group Settings */}
      {isAdmin && (
        <div className="p-4 border-t border-border">
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Icon name="Edit" size={16} className="mr-2" />
              Edit Group Info
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Icon name="Image" size={16} className="mr-2" />
              Change Group Photo
            </Button>
            <Button variant="outline" className="w-full justify-start text-error hover:text-error">
              <Icon name="Trash2" size={16} className="mr-2" />
              Delete Group
            </Button>
          </div>
        </div>
      )}
      {/* Add Members Modal Placeholder */}
      {showAddMembers && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-foreground">Add Members</h4>
              <Button variant="ghost" size="icon" onClick={() => setShowAddMembers(false)}>
                <Icon name="X" size={20} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <Input
                type="search"
                placeholder="Search students to add..."
                className="w-full"
              />
              
              <div className="text-center py-8">
                <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Search for students to add to this group
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowAddMembers(false)} className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1" disabled>
                  Add Selected
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;