import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EventCard = ({ event, onRSVP, onViewDetails }) => {
  const [isRSVPing, setIsRSVPing] = useState(false);

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
      weekday: 'short',
      month: 'short',
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

  return (
    <div className="bg-card border border-border rounded-lg shadow-card hover:shadow-interactive transition-smooth">
      {/* Event Image */}
      {event?.image && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <Image
            src={event?.image}
            alt={event?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getCategoryColor(event?.category))}>
              {event?.category}
            </span>
          </div>
          {event?.featured && (
            <div className="absolute top-3 right-3">
              <div className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Icon name="Star" size={12} className="mr-1" />
                Featured
              </div>
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        {/* Event Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-card-foreground text-lg mb-1 line-clamp-2">
              {event?.title}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm mb-2">
              <Icon name="Calendar" size={14} className="mr-1" />
              <span>{formatDate(event?.startDate)} at {formatTime(event?.startDate)}</span>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-muted-foreground text-sm">
            <Icon name="MapPin" size={14} className="mr-2 flex-shrink-0" />
            <span className="truncate">{event?.location}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm">
            <Icon name="User" size={14} className="mr-2 flex-shrink-0" />
            <span className="truncate">Organized by {event?.organizer?.name}</span>
          </div>

          <div className="flex items-center text-muted-foreground text-sm">
            <Icon name="Users" size={14} className="mr-2 flex-shrink-0" />
            <span>
              {event?.attendeeCount} attending
              {event?.capacity && ` • ${event?.capacity - event?.attendeeCount} spots left`}
            </span>
          </div>
        </div>

        {/* Event Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {event?.description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(event)}
            className="flex-1 mr-2"
          >
            View Details
          </Button>
          
          <Button
            variant={event?.userRSVP ? "default" : "outline"}
            size="sm"
            loading={isRSVPing}
            onClick={handleRSVP}
            className="flex-1 ml-2"
            disabled={attendanceStatus === 'waitlist' && !event?.userRSVP}
          >
            {attendanceStatus === 'confirmed' && event?.userRSVP && (
              <>
                <Icon name="Check" size={14} className="mr-1" />
                Going
              </>
            )}
            {attendanceStatus === 'available' && !event?.userRSVP && 'RSVP'}
            {attendanceStatus === 'waitlist' && !event?.userRSVP && 'Join Waitlist'}
            {attendanceStatus === 'waitlist' && event?.userRSVP && (
              <>
                <Icon name="Clock" size={14} className="mr-1" />
                Waitlisted
              </>
            )}
          </Button>
        </div>

        {/* Status Indicators */}
        {event?.userRSVP && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center text-sm">
              {attendanceStatus === 'confirmed' && (
                <div className="flex items-center text-success">
                  <Icon name="CheckCircle" size={14} className="mr-1" />
                  <span>You're attending this event</span>
                </div>
              )}
              {attendanceStatus === 'waitlist' && (
                <div className="flex items-center text-warning">
                  <Icon name="Clock" size={14} className="mr-1" />
                  <span>You're on the waitlist</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;