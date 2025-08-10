import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ConnectModal = ({ isOpen, onClose, onConnect, profile }) => {
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const messageTemplates = [
    {
      id: 'study',
      label: 'Study Partner',
      message: `Hi ${profile?.full_name?.split(' ')?.[0]}, I noticed we're both studying ${profile?.major}. Would you like to form a study group?`
    },
    {
      id: 'project',label: 'Project Collaboration',
      message: `Hi ${profile?.full_name?.split(' ')?.[0]}, I'm working on a similar project and would love to collaborate. Let's connect!`
    },
    {
      id: 'networking',label: 'General Networking',
      message: `Hi ${profile?.full_name?.split(' ')?.[0]}, I'd love to connect and expand my network. Looking forward to getting to know you!`
    },
    {
      id: 'custom',
      label: 'Custom Message',
      message: ''
    }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template?.id);
    setMessage(template?.message);
  };

  const handleSend = () => {
    if (message?.trim()) {
      onConnect(message?.trim());
      setMessage('');
      setSelectedTemplate('');
    }
  };

  const handleClose = () => {
    setMessage('');
    setSelectedTemplate('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
      <div className="bg-card border border-border rounded-lg shadow-interactive w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Image
              src={profile?.avatar}
              alt={profile?.full_name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-card-foreground">Connect with {profile?.full_name}</h3>
              <p className="text-sm text-muted-foreground">{profile?.major}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {/* Message Templates */}
          <div>
            <label className="text-sm font-medium text-card-foreground mb-3 block">
              Choose a message template:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {messageTemplates?.map((template) => (
                <button
                  key={template?.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-3 text-left text-sm border rounded-lg transition-smooth ${
                    selectedTemplate === template?.id
                      ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-muted-foreground text-card-foreground'
                  }`}
                >
                  {template?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div>
            <Input
              label="Your message"
              type="text"
              placeholder="Write a personalized message..."
              value={message}
              onChange={(e) => setMessage(e?.target?.value)}
              description={`${message?.length}/500 characters`}
              className="min-h-24"
              style={{ minHeight: '96px', resize: 'vertical' }}
            />
          </div>

          {/* Profile Preview */}
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Eye" size={14} className="text-muted-foreground" />
              <span className="text-sm font-medium text-card-foreground">They'll see your profile</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Your name and profile picture</p>
              <p>• What you're learning and building</p>
              <p>• Your skills and interests</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSend}
              disabled={!message?.trim()}
              className="flex-1"
              iconName="Send"
              iconPosition="right"
              iconSize={16}
            >
              Send Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectModal;