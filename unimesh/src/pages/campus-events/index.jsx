import React, { useState, useEffect } from "react";
import { Calendar, Search, Filter, Plus, Loader2 } from "lucide-react";

import Header from "../../components/ui/Header";
import EventCard from "./components/EventCard";
import EventDetailModal from "./components/EventDetailModal";
import CreateEventModal from "./components/CreateEventModal";
import EventFilters from "./components/EventFilters";
import EventCalendar from "./components/EventCalendar";
import { useAuth } from "../../contexts/AuthContext";
import { eventsService } from "../../utils/eventsService";

export default function CampusEvents() {
  const { user } = useAuth();
  
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceStatuses, setAttendanceStatuses] = useState({});
  const [filters, setFilters] = useState({
    eventType: "all",
    location: "",
    dateRange: "upcoming"
  });

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (user?.id && events?.length > 0) {
      loadAttendanceStatuses();
    }
  }, [user, events]);

  const loadEvents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: eventsError } = await eventsService?.getEvents({
        limit: 100
      });
      
      if (eventsError) {
        setError('Failed to load events. Please try again.');
        return;
      }
      
      setEvents(data || []);
    } catch (err) {
      setError('Something went wrong while loading events.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAttendanceStatuses = async () => {
    if (!user?.id) return;
    
    const statuses = {};
    for (const event of events) {
      try {
        const { data } = await eventsService?.checkAttendance(event?.id, user?.id);
        statuses[event.id] = !!data;
      } catch (err) {
        // Ignore individual errors
        statuses[event.id] = false;
      }
    }
    setAttendanceStatuses(statuses);
  };

  useEffect(() => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered?.filter(event =>
        event?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        event?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        event?.location?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    if (filters?.eventType && filters?.eventType !== 'all') {
      filtered = filtered?.filter(event => event?.event_type === filters?.eventType);
    }
    if (filters?.location) {
      filtered = filtered?.filter(event =>
        event?.location?.toLowerCase()?.includes(filters?.location?.toLowerCase())
      );
    }
    if (filters?.dateRange) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow?.setDate(tomorrow?.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek?.setDate(nextWeek?.getDate() + 7);

      switch (filters?.dateRange) {
        case 'today':
          filtered = filtered?.filter(event => {
            const eventDate = new Date(event?.start_date);
            return eventDate >= today && eventDate < tomorrow;
          });
          break;
        case 'week':
          filtered = filtered?.filter(event => {
            const eventDate = new Date(event?.start_date);
            return eventDate >= today && eventDate <= nextWeek;
          });
          break;
        case 'upcoming':
        default:
          filtered = filtered?.filter(event => {
            const eventDate = new Date(event?.start_date);
            return eventDate >= today;
          });
          break;
      }
    }

    filtered?.sort((a, b) => new Date(a?.start_date) - new Date(b?.start_date));

    setFilteredEvents(filtered);
  }, [searchQuery, filters, events]);

  const handleJoinEvent = async (eventId) => {
    if (!user?.id) return;
    
    try {
      if (attendanceStatuses?.[eventId]) {
        const { error } = await eventsService?.leaveEvent(eventId, user?.id);
        if (error) {
          setError('Failed to leave event. Please try again.');
          return;
        }
        setAttendanceStatuses(prev => ({ ...prev, [eventId]: false }));
      } else {
        const { error } = await eventsService?.joinEvent(eventId, user?.id);
        if (error) {
          setError('Failed to join event. Please try again.');
          return;
        }
        setAttendanceStatuses(prev => ({ ...prev, [eventId]: true }));
      }
      
      setEvents(prev => prev?.map(event => {
        if (event?.id === eventId) {
          const attendeeChange = attendanceStatuses?.[eventId] ? -1 : 1;
          return {
            ...event,
            event_attendees: event?.event_attendees || []
          };
        }
        return event;
      }));
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleCreateEvent = async (eventData) => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await eventsService?.createEvent({
        ...eventData,
        organizer_id: user?.id
      });
      
      if (error) {
        setError('Failed to create event. Please try again.');
        return;
      }
      
      setEvents(prev => [data, ...prev]);
      setShowCreateModal(false);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.eventType && filters?.eventType !== 'all') count++;
    if (filters?.location) count++;
    if (filters?.dateRange && filters?.dateRange !== 'upcoming') count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user}
        onSearch={setSearchQuery}
      />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Campus Events</h1>
              <p className="text-gray-600">Discover and join events happening on campus</p>
            </div>
            
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Event
              </button>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors relative ${
                    showFilters ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {getActiveFiltersCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </button>
                
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setViewMode("calendar")}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      viewMode === "calendar" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Calendar
                  </button>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <EventFilters 
                  filters={filters} 
                  onFiltersChange={setFilters}
                  selectedCategory={filters.eventType}
                  onCategoryChange={(category) => setFilters(prev => ({ ...prev, eventType: category }))}
                  selectedFilter={filters.dateRange}
                  onFilterChange={(filter) => setFilters(prev => ({ ...prev, dateRange: filter }))}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="mb-4">
            <p className="text-gray-600">
              {isLoading ? 'Loading...' : `${filteredEvents?.length || 0} events found`}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : viewMode === "calendar" ? (
            <EventCalendar 
              events={filteredEvents} 
              onEventClick={setSelectedEvent}
              selectedDate={new Date()}
              onDateSelect={(date) => console.log('Date selected:', date)}
            />
          ) : filteredEvents?.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || getActiveFiltersCount() > 0
                  ? "Try adjusting your search or filters" : "No events are currently scheduled"
                }
              </p>
              {user && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Create First Event
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEvents?.map((event) => (
                <EventCard
                  key={event?.id}
                  event={event}
                  isAttending={attendanceStatuses?.[event?.id] || false}
                  currentUserId={user?.id}
                  onJoinEvent={handleJoinEvent}
                  onEventClick={setSelectedEvent}
                  onRSVP={handleJoinEvent}
                  onViewDetails={setSelectedEvent}
                />
              ))}
            </div>
          )}
        </div>

        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            isAttending={attendanceStatuses?.[selectedEvent?.id] || false}
            currentUserId={user?.id}
            onJoinEvent={handleJoinEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}

        {showCreateModal && (
          <CreateEventModal
            onCreateEvent={handleCreateEvent}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </div>
    </div>
  );
}