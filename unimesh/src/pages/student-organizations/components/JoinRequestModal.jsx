import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const JoinRequestModal = ({ organization, onClose, onSubmit }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        organizationId: organization?.id,
        message: message?.trim(),
        timestamp: new Date()
      });
      onClose();
    } catch (error) {
      console.error('Error submitting join request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
      <div className="bg-card rounded-lg shadow-interactive max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Send" size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">Join Request</h2>
              <p className="text-sm text-muted-foreground">{organization?.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-muted-foreground text-sm mb-4">
              This organization requires approval to join. Tell them why you're interested in becoming a member.
            </p>
            
            <Input
              label="Message (Optional)"
              type="text"
              placeholder="Why do you want to join this organization?"
              value={message}
              onChange={(e) => setMessage(e?.target?.value)}
              description="This message will be sent to the organization leaders"
              className="mb-4"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              <Icon name="Send" size={16} className="mr-2" />
              Send Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRequestModal;