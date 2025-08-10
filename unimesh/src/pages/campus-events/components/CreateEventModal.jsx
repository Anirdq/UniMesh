import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CreateEventModal = ({ isOpen, onClose, onCreateEvent }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    capacity: '',
    isPrivate: false,
    requiresApproval: false,
    allowWaitlist: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = [
    { value: 'academic', label: 'Academic' },
    { value: 'social', label: 'Social' },
    { value: 'sports', label: 'Sports' },
    { value: 'career', label: 'Career' },
    { value: 'cultural', label: 'Cultural' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (!formData?.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData?.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData?.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData?.location?.trim()) {
      newErrors.location = 'Event location is required';
    }

    if (formData?.capacity && (isNaN(formData?.capacity) || parseInt(formData?.capacity) < 1)) {
      newErrors.capacity = 'Capacity must be a positive number';
    }

    // Validate end date/time if provided
    if (formData?.endDate || formData?.endTime) {
      if (!formData?.endDate) {
        newErrors.endDate = 'End date is required when end time is set';
      }
      if (!formData?.endTime) {
        newErrors.endTime = 'End time is required when end date is set';
      }

      if (formData?.startDate && formData?.endDate && formData?.startTime && formData?.endTime) {
        const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
        
        if (endDateTime <= startDateTime) {
          newErrors.endDate = 'End date/time must be after start date/time';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const eventData = {
        ...formData,
        capacity: formData?.capacity ? parseInt(formData?.capacity) : null,
        startDate: new Date(`${formData.startDate}T${formData.startTime}`),
        endDate: formData?.endDate && formData?.endTime 
          ? new Date(`${formData.endDate}T${formData.endTime}`) 
          : null
      };

      await onCreateEvent(eventData);
      handleClose();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      location: '',
      capacity: '',
      isPrivate: false,
      requiresApproval: false,
      allowWaitlist: true
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
      <div className="bg-card border border-border rounded-lg shadow-interactive w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Create New Event</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-card-foreground">Basic Information</h3>
            
            <Input
              label="Event Title"
              type="text"
              placeholder="Enter event title"
              value={formData?.title}
              onChange={(e) => handleInputChange('title', e?.target?.value)}
              error={errors?.title}
              required
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description <span className="text-error">*</span>
              </label>
              <textarea
                placeholder="Describe your event..."
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                rows={4}
                className={cn("w-full px-3 py-2 bg-input border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none",
                  errors?.description ? 'border-error' : 'border-border'
                )}
              />
              {errors?.description && (
                <p className="text-error text-sm mt-1">{errors?.description}</p>
              )}
            </div>

            <Select
              label="Category"
              placeholder="Select event category"
              options={categoryOptions}
              value={formData?.category}
              onChange={(value) => handleInputChange('category', value)}
              error={errors?.category}
              required
            />
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <h3 className="font-medium text-card-foreground">Date & Time</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={formData?.startDate}
                onChange={(e) => handleInputChange('startDate', e?.target?.value)}
                error={errors?.startDate}
                required
              />
              
              <Input
                label="Start Time"
                type="time"
                value={formData?.startTime}
                onChange={(e) => handleInputChange('startTime', e?.target?.value)}
                error={errors?.startTime}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="End Date (Optional)"
                type="date"
                value={formData?.endDate}
                onChange={(e) => handleInputChange('endDate', e?.target?.value)}
                error={errors?.endDate}
              />
              
              <Input
                label="End Time (Optional)"
                type="time"
                value={formData?.endTime}
                onChange={(e) => handleInputChange('endTime', e?.target?.value)}
                error={errors?.endTime}
              />
            </div>
          </div>

          {/* Location & Capacity */}
          <div className="space-y-4">
            <h3 className="font-medium text-card-foreground">Location & Capacity</h3>
            
            <Input
              label="Location"
              type="text"
              placeholder="Enter event location"
              value={formData?.location}
              onChange={(e) => handleInputChange('location', e?.target?.value)}
              error={errors?.location}
              required
            />

            <Input
              label="Capacity (Optional)"
              type="number"
              placeholder="Maximum number of attendees"
              value={formData?.capacity}
              onChange={(e) => handleInputChange('capacity', e?.target?.value)}
              error={errors?.capacity}
              description="Leave empty for unlimited capacity"
            />
          </div>

          {/* Event Settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-card-foreground">Event Settings</h3>
            
            <div className="space-y-3">
              <Checkbox
                label="Private Event"
                description="Only invited users can see and join this event"
                checked={formData?.isPrivate}
                onChange={(e) => handleInputChange('isPrivate', e?.target?.checked)}
              />

              <Checkbox
                label="Require Approval"
                description="Manually approve attendee requests"
                checked={formData?.requiresApproval}
                onChange={(e) => handleInputChange('requiresApproval', e?.target?.checked)}
              />

              <Checkbox
                label="Allow Waitlist"
                description="Enable waitlist when event reaches capacity"
                checked={formData?.allowWaitlist}
                onChange={(e) => handleInputChange('allowWaitlist', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              iconName="Plus"
              iconPosition="left"
            >
              Create Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;