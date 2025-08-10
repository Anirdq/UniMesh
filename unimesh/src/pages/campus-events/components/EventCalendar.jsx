import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventCalendar = ({ events, selectedDate, onDateSelect, className = '' }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const year = currentMonth?.getFullYear();
  const month = currentMonth?.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth?.getDay();
  const daysInMonth = lastDayOfMonth?.getDate();

  // Get previous month's last days to fill the grid
  const prevMonth = new Date(year, month - 1, 0);
  const daysInPrevMonth = prevMonth?.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar days
  const calendarDays = [];

  // Previous month days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    let day = daysInPrevMonth - i;
    const date = new Date(year, month - 1, day);
    calendarDays?.push({
      day,
      date,
      isCurrentMonth: false,
      isToday: false,
      eventCount: getEventCountForDate(date)
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isToday = date?.toDateString() === today?.toDateString();
    calendarDays?.push({
      day,
      date,
      isCurrentMonth: true,
      isToday,
      eventCount: getEventCountForDate(date)
    });
  }

  // Next month days to complete the grid
  const remainingDays = 42 - calendarDays?.length; // 6 rows × 7 days
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    calendarDays?.push({
      day,
      date,
      isCurrentMonth: false,
      isToday: false,
      eventCount: getEventCountForDate(date)
    });
  }

  function getEventCountForDate(date) {
    return events?.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate?.toDateString() === date?.toDateString();
    })?.length;
  }

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth?.setMonth(prev?.getMonth() + direction);
      return newMonth;
    });
  };

  const handleDateClick = (calendarDay) => {
    if (onDateSelect) {
      onDateSelect(calendarDay?.date);
    }
  };

  const isSelectedDate = (date) => {
    return selectedDate && date?.toDateString() === selectedDate?.toDateString();
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-card-foreground">
          {monthNames?.[month]} {year}
        </h3>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(-1)}
            className="h-8 w-8"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(1)}
            className="h-8 w-8"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>
      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays?.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays?.map((calendarDay, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(calendarDay)}
            className={`
              relative h-10 text-sm font-medium rounded-md transition-smooth
              ${calendarDay?.isCurrentMonth 
                ? 'text-card-foreground hover:bg-muted' 
                : 'text-muted-foreground hover:bg-muted/50'
              }
              ${calendarDay?.isToday 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : ''
              }
              ${isSelectedDate(calendarDay?.date) && !calendarDay?.isToday
                ? 'bg-accent text-accent-foreground' 
                : ''
              }
            `}
          >
            <span>{calendarDay?.day}</span>
            {calendarDay?.eventCount > 0 && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                <div className={`
                  w-1 h-1 rounded-full
                  ${calendarDay?.isToday || isSelectedDate(calendarDay?.date)
                    ? 'bg-current opacity-70' :'bg-primary'
                  }
                `} />
                {calendarDay?.eventCount > 1 && (
                  <div className={`
                    w-1 h-1 rounded-full ml-0.5 inline-block
                    ${calendarDay?.isToday || isSelectedDate(calendarDay?.date)
                      ? 'bg-current opacity-70' :'bg-primary'
                    }
                  `} />
                )}
              </div>
            )}
          </button>
        ))}
      </div>
      {/* Today Button */}
      <div className="mt-4 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentMonth(new Date());
            onDateSelect && onDateSelect(new Date());
          }}
          className="w-full"
        >
          <Icon name="Calendar" size={14} className="mr-2" />
          Today
        </Button>
      </div>
    </div>
  );
};

export default EventCalendar;