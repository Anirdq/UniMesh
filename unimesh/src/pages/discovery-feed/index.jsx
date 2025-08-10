import React, { useState, useEffect } from "react";
import { Search, Filter, Users } from "lucide-react";
import Header from "../../components/ui/Header";
import ProfileCard from "./components/ProfileCard";
import ConnectModal from "./components/ConnectModal";
import AdvancedFilterPanel from "./components/AdvancedFilterPanel";
import FilterChips from "./components/FilterChips";
import LoadingCard from "./components/LoadingCard";
import EmptyState from "./components/EmptyState";
import { useAuth } from "../../contexts/AuthContext";
import { discoveryService } from "../../utils/discoveryService";

export default function DiscoveryFeed() {
  const { user } = useAuth();
  
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [filters, setFilters] = useState({
    university: "",
    major: "",
    academicYear: "",
    lookingFor: "",
    skills: [],
    interests: []
  });

  // Load profiles from Supabase
  useEffect(() => {
    loadProfiles();
  }, [user]);

  const loadProfiles = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: profilesError } = await discoveryService?.getStudentProfiles({
        excludeUserId: user?.id,
        limit: 50
      });

      if (profilesError) {
        setError('Failed to load student profiles. Please try again.');
        return;
      }

      setProfiles(data || []);
      
      // Load connection statuses
      const statuses = {};
      for (const profile of data || []) {
        const { data: connectionData } = await discoveryService?.getConnectionStatus(
          user?.id, 
          profile?.id
        );
        statuses[profile.id] = connectionData?.status || 'none';
      }
      setConnectionStatuses(statuses);
      
    } catch (err) {
      setError('Something went wrong while loading profiles.');
    } finally {
      setIsLoading(false);
    }
  };

  // Search and filter profiles
  useEffect(() => {
    let filtered = profiles;

    // Apply search
    if (searchQuery) {
      filtered = filtered?.filter(profile =>
        profile?.full_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        profile?.major?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        profile?.bio?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        profile?.looking_for?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply filters
    if (filters?.university) {
      filtered = filtered?.filter(profile =>
        profile?.university?.toLowerCase()?.includes(filters?.university?.toLowerCase())
      );
    }
    if (filters?.major) {
      filtered = filtered?.filter(profile =>
        profile?.major?.toLowerCase()?.includes(filters?.major?.toLowerCase())
      );
    }
    if (filters?.academicYear) {
      filtered = filtered?.filter(profile =>
        profile?.academic_year === filters?.academicYear
      );
    }
    if (filters?.lookingFor) {
      filtered = filtered?.filter(profile =>
        profile?.looking_for?.toLowerCase()?.includes(filters?.lookingFor?.toLowerCase())
      );
    }
    if (filters?.skills?.length > 0) {
      filtered = filtered?.filter(profile =>
        filters?.skills?.some(skill =>
          profile?.user_skills?.some(userSkill =>
            userSkill?.skill_name?.toLowerCase()?.includes(skill?.toLowerCase())
          )
        )
      );
    }
    if (filters?.interests?.length > 0) {
      filtered = filtered?.filter(profile =>
        filters?.interests?.some(interest =>
          profile?.user_interests?.some(userInterest =>
            userInterest?.interest_name?.toLowerCase()?.includes(interest?.toLowerCase())
          )
        )
      );
    }

    setFilteredProfiles(filtered);
  }, [searchQuery, filters, profiles]);

  const handleConnect = async (profile, message = '') => {
    if (!user || !profile) return;
    
    try {
      const { error } = await discoveryService?.sendConnectionRequest(
        user?.id,
        profile?.id,
        message
      );

      if (error) {
        setError('Failed to send connection request. Please try again.');
        return;
      }

      // Update connection status
      setConnectionStatuses(prev => ({
        ...prev,
        [profile?.id]: 'pending'
      }));

      setShowConnectModal(false);
      setSelectedProfile(null);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.university) count++;
    if (filters?.major) count++;
    if (filters?.academicYear) count++;
    if (filters?.lookingFor) count++;
    if (filters?.skills?.length > 0) count++;
    if (filters?.interests?.length > 0) count++;
    return count;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onSearch={setSearchQuery} />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Please sign in</h2>
            <p className="text-gray-600">Sign in to discover and connect with other students</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onSearch={setSearchQuery} />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Students</h1>
            <p className="text-gray-600">Find your perfect study partner, project collaborator, or new friend</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, major, or interests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <AdvancedFilterPanel 
                  isOpen={showFilters} 
                  onClose={() => setShowFilters(false)}
                  filters={filters} 
                  onFiltersChange={setFilters}
                  currentFilters={filters}
                  onApplyFilters={(newFilters) => {
                    setFilters(newFilters);
                    setShowFilters(false);
                  }}
                />
              </div>
            )}

            <FilterChips 
              filters={filters} 
              onFiltersChange={setFilters}
              activeFilters={filters}
              onFilterChange={setFilters}
              onAdvancedFilter={() => setShowFilters(true)}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Results */}
          <div className="mb-4">
            <p className="text-gray-600">
              {isLoading ? 'Loading...' : `${filteredProfiles?.length || 0} students found`}
            </p>
          </div>

          {/* Profiles Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : filteredProfiles?.length === 0 ? (
            <EmptyState 
              searchQuery={searchQuery} 
              hasActiveFilters={getActiveFiltersCount() > 0}
              onClearFilters={() => {
                setFilters({
                  university: "",
                  major: "",
                  academicYear: "",
                  lookingFor: "",
                  skills: [],
                  interests: []
                });
                setSearchQuery("");
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles?.map((profile) => (
                <ProfileCard
                  key={profile?.id}
                  profile={profile}
                  connectionStatus={connectionStatuses?.[profile?.id] || 'none'}
                  onConnect={() => {
                    setSelectedProfile(profile);
                    setShowConnectModal(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Connect Modal */}
        {showConnectModal && selectedProfile && (
          <ConnectModal
            isOpen={showConnectModal}
            profile={selectedProfile}
            onConnect={handleConnect}
            onClose={() => {
              setShowConnectModal(false);
              setSelectedProfile(null);
            }}
          />
        )}
      </div>
    </div>
  );
}