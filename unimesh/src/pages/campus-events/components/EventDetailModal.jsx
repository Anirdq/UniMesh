import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EventDetailModal = ({ event, isOpen, onClose, onRSVP, onShare }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isRSVPing, setIsRSVPing] = useState(false);

  if (!isOpen || !event) return null;

  const handleRSVP = async () => {
    setIsRSVPing(true);
    try {
      await onRSVP(event?.id, !event?.userRSVP);
    } finally {
      setIsRSVPing(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800',
      social: 'bg-green-100 text-green-800',
      sports: 'bg-orange-100 text-orange-800',
      career: 'bg-purple-100 text-purple-800',
      cultural: 'bg-pink-100 text-pink-800'
    };
    return colors?.[category] || 'bg-gray-100 text-gray-800';
  };

  const getAttendanceStatus = () => {
    if (event?.capacity && event?.attendeeCount >= event?.capacity) {
      return event?.userRSVP ? 'confirmed' : 'waitlist';
    }
    return event?.userRSVP ? 'confirmed' : 'available';
  };

  const attendanceStatus = getAttendanceStatus();

  const tabs = [
    { id: 'details', label: 'Details', icon: 'Info' },
    { id: 'attendees', label: 'Attendees', icon: 'Users' },
    { id: 'discussion', label: 'Discussion', icon: 'MessageCircle' }
  ];

  // Mock attendees data
  const mockAttendees = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      major: "Computer Science",
      year: "Junior"
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      major: "Business Administration",
      year: "Senior"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      major: "Psychology",
      year: "Sophomore"
    }
  ];

  // Mock discussion data
  const mockDiscussion = [
    {
      id: 1,
      user: "Alex Thompson",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      message: "Looking forward to this event! Will there be networking opportunities?",
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 2,
      user: "Jessica Park",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      message: "Great initiative! I\'ll be bringing some friends along.",
      timestamp: new Date(Date.now() - 7200000)
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
      <div className="bg-card border border-border rounded-lg shadow-interactive w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          {event?.image && (
            <div className="h-48 overflow-hidden">
              <Image
                src={event?.image}
                alt={event?.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onShare && onShare(event)}
              className="bg-black/20 hover:bg-black/30 text-white"
            >
              <Icon name="Share" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="bg-black/20 hover:bg-black/30 text-white"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>

          {event?.featured && (
            <div className="absolute top-4 left-4">
              <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Icon name="Star" size={14} className="mr-1" />
                Featured Event
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Event Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium mr-3 ${getCategoryColor(event?.category)}`}>
                    {event?.category}
                  </span>
                  {event?.isPrivate && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex items-center">
                      <Icon name="Lock" size={12} className="mr-1" />
                      Private
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-card-foreground mb-2">
                  {event?.title}
                </h1>
                <div className="flex items-center text-muted-foreground text-sm mb-2">
                  <Icon name="User" size={14} className="mr-1" />
                  <span>Organized by {event?.organizer?.name}</span>
                </div>
              </div>
            </div>

            {/* Event Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center">
                <Icon name="Calendar" size={16} className="mr-2 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{formatDate(event?.startDate)}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(event?.startDate)}
                    {event?.endDate && ` - ${formatTime(event?.endDate)}`}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <Icon name="MapPin" size={16} className="mr-2 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{event?.location}</div>
                  <div className="text-xs text-muted-foreground">Event Location</div>
                </div>
              </div>

              <div className="flex items-center">
                <Icon name="Users" size={16} className="mr-2 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">
                    {event?.attendeeCount} attending
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {event?.capacity ? `${event?.capacity - event?.attendeeCount} spots left` : 'Unlimited capacity'}
                  </div>
                </div>
              </div>
            </div>

            {/* RSVP Button */}
            <div className="flex items-center space-x-3">
              <Button
                variant={event?.userRSVP ? "default" : "outline"}
                loading={isRSVPing}
                onClick={handleRSVP}
                disabled={attendanceStatus === 'waitlist' && !event?.userRSVP}
                className="flex-1 md:flex-none"
              >
                {attendanceStatus === 'confirmed' && event?.userRSVP && (
                  <>
                    <Icon name="Check" size={16} className="mr-2" />
                    Going
                  </>
                )}
                {attendanceStatus === 'available' && !event?.userRSVP && 'RSVP'}
                {attendanceStatus === 'waitlist' && !event?.userRSVP && 'Join Waitlist'}
                {attendanceStatus === 'waitlist' && event?.userRSVP && (
                  <>
                    <Icon name="Clock" size={16} className="mr-2" />
                    Waitlisted
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => onShare && onShare(event)}
              >
                <Icon name="Share" size={16} className="mr-2" />
                Share
              </Button>
            </div>

            {/* Status Message */}
            {event?.userRSVP && (
              <div className="mt-3 p-3 rounded-lg bg-muted">
                <div className="flex items-center text-sm">
                  {attendanceStatus === 'confirmed' && (
                    <div className="flex items-center text-success">
                      <Icon name="CheckCircle" size={16} className="mr-2" />
                      <span>You're attending this event</span>
                    </div>
                  )}
                  {attendanceStatus === 'waitlist' && (
                    <div className="flex items-center text-warning">
                      <Icon name="Clock" size={16} className="mr-2" />
                      <span>You're on the waitlist - we'll notify you if a spot opens up</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-6">
            <div className="flex space-x-6">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center pb-3 border-b-2 transition-smooth ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} className="mr-2" />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-h-96 overflow-y-auto">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-card-foreground mb-2">About This Event</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {event?.description}
                  </p>
                </div>

                {event?.requirements && (
                  <div>
                    <h3 className="font-medium text-card-foreground mb-2">Requirements</h3>
                    <p className="text-muted-foreground">
                      {event?.requirements}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-card-foreground mb-2">Event Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{event?.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className="font-medium">
                        {event?.capacity ? `${event?.capacity} people` : 'Unlimited'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Registration:</span>
                      <span className="font-medium">
                        {event?.requiresApproval ? 'Requires approval' : 'Open registration'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendees' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-card-foreground">
                    Attendees ({event?.attendeeCount})
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {mockAttendees?.map((attendee) => (
                    <div key={attendee?.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-smooth">
                      <Image
                        src={attendee?.avatar}
                        alt={attendee?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-card-foreground">{attendee?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {attendee?.major} • {attendee?.year}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Icon name="MessageCircle" size={14} className="mr-1" />
                        Message
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-card-foreground">Discussion</h3>
                </div>

                <div className="space-y-4">
                  {mockDiscussion?.map((comment) => (
                    <div key={comment?.id} className="flex space-x-3">
                      <Image
                        src={comment?.avatar}
                        alt={comment?.user}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-card-foreground text-sm">
                            {comment?.user}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {comment?.timestamp?.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {comment?.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-medium text-sm">U</span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        placeholder="Add a comment..."
                        rows={2}
                        className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <Button size="sm">
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;