import React, { useState, useEffect } from "react";
import { Users, Plus, Loader2 } from "lucide-react";
import Header from "../../components/ui/Header";
import OrganizationCard from "./components/OrganizationCard";
import OrganizationDetail from "./components/OrganizationDetail";
import CategoryFilter from "./components/CategoryFilter";
import OrganizationSearch from "./components/OrganizationSearch";
import JoinRequestModal from "./components/JoinRequestModal";
import AdminDashboard from "./components/AdminDashboard";
import { useAuth } from "../../contexts/AuthContext";
import { organizationsService } from "../../utils/organizationsService";

export default function StudentOrganizations() {
  const { user } = useAuth();
  
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [myOrganizations, setMyOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [membershipStatuses, setMembershipStatuses] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    loadOrganizations();
    if (user?.id) {
      loadMyOrganizations();
    }
  }, [user]);

  useEffect(() => {
    if (user?.id && organizations?.length > 0) {
      loadMembershipStatuses();
    }
  }, [user, organizations]);

  const loadOrganizations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: orgsError } = await organizationsService?.getOrganizations({
        limit: 100
      });
      
      if (orgsError) {
        setError('Failed to load organizations. Please try again.');
        return;
      }
      
      setOrganizations(data || []);
    } catch (err) {
      setError('Something went wrong while loading organizations.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMyOrganizations = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await organizationsService?.getMyOrganizations(user?.id);
      
      if (error) {
        // Don't set error for my organizations, just log it
        console.error('Failed to load my organizations:', error);
        return;
      }
      
      setMyOrganizations(data || []);
    } catch (err) {
      console.error('Error loading my organizations:', err);
    }
  };

  const loadMembershipStatuses = async () => {
    if (!user?.id) return;
    
    const statuses = {};
    for (const org of organizations) {
      try {
        const { data } = await organizationsService?.checkMembershipStatus(org?.id, user?.id);
        statuses[org.id] = data?.status || 'none';
      } catch (err) {
        // Ignore individual errors
        statuses[org.id] = 'none';
      }
    }
    setMembershipStatuses(statuses);
  };

  useEffect(() => {
    let filtered = organizations;

    if (activeTab === 'my') {
      const myOrgIds = myOrganizations?.map(org => org?.id);
      filtered = organizations?.filter(org => myOrgIds?.includes(org?.id));
    }

    if (searchQuery) {
      filtered = filtered?.filter(org =>
        org?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        org?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered?.filter(org => org?.category === selectedCategory);
    }

    setFilteredOrganizations(filtered || []);
  }, [searchQuery, selectedCategory, organizations, myOrganizations, activeTab]);

  const handleJoinRequest = async (organizationId, message = '') => {
    if (!user?.id) return;
    
    try {
      const { error } = await organizationsService?.requestToJoin(organizationId, user?.id, message);
      
      if (error) {
        setError('Failed to send join request. Please try again.');
        return;
      }
      
      setMembershipStatuses(prev => ({
        ...prev,
        [organizationId]: 'pending'
      }));
      
      setShowJoinModal(false);
      setSelectedOrganization(null);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleLeaveOrganization = async (organizationId) => {
    if (!user?.id) return;
    
    try {
      const { error } = await organizationsService?.leaveOrganization(organizationId, user?.id);
      
      if (error) {
        setError('Failed to leave organization. Please try again.');
        return;
      }
      
      setMembershipStatuses(prev => ({
        ...prev,
        [organizationId]: 'none'
      }));
      
      await loadMyOrganizations();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const categories = [
    { value: 'all', label: 'All Categories', count: organizations?.length || 0 },
    { value: 'academic', label: 'Academic', count: organizations?.filter(o => o?.category === 'academic')?.length || 0 },
    { value: 'cultural', label: 'Cultural', count: organizations?.filter(o => o?.category === 'cultural')?.length || 0 },
    { value: 'sports', label: 'Sports', count: organizations?.filter(o => o?.category === 'sports')?.length || 0 },
    { value: 'technology', label: 'Technology', count: organizations?.filter(o => o?.category === 'technology')?.length || 0 },
    { value: 'volunteer', label: 'Volunteer', count: organizations?.filter(o => o?.category === 'volunteer')?.length || 0 },
    { value: 'professional', label: 'Professional', count: organizations?.filter(o => o?.category === 'professional')?.length || 0 },
    { value: 'hobby', label: 'Hobby', count: organizations?.filter(o => o?.category === 'hobby')?.length || 0 }
  ];

  const organizationCounts = categories.reduce((acc, cat) => {
    acc[cat.value] = cat.count;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onSearch={handleSearch} />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Organizations</h1>
              <p className="text-gray-600">Join communities that match your interests and passions</p>
            </div>
            
            <div className="flex gap-3">
              {user && myOrganizations?.length > 0 && (
                <button
                  onClick={() => setShowAdminDashboard(true)}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Manage
                </button>
              )}
              {user && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Organization
                </button>
              )}
            </div>
          </div>

          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Organizations ({organizations?.length || 0})
              </button>
              {user && (
                <button
                  onClick={() => setActiveTab('my')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'my' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Organizations ({myOrganizations?.length || 0})
                </button>
              )}
            </nav>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <OrganizationSearch 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onSearch={handleSearch}
                  onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
                  isFilterOpen={isFilterOpen}
                />
              </div>
              <div className="lg:w-80">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  organizationCounts={organizationCounts}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="mb-4">
            <p className="text-gray-600">
              {isLoading ? 'Loading...' : `${filteredOrganizations?.length || 0} organizations found`}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : filteredOrganizations?.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'my' ? 'No organizations joined yet' : 'No organizations found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'my'
                  ? "Join organizations to see them here"
                  : searchQuery || selectedCategory !== 'all'
                  ? "Try adjusting your search or filters" : "No organizations are currently active"
                }
              </p>
              {user && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Create Organization
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrganizations?.map((organization) => (
                <OrganizationCard
                  key={organization?.id}
                  organization={organization}
                  membershipStatus={membershipStatuses?.[organization?.id] || 'none'}
                  currentUserId={user?.id}
                  onJoinRequest={() => {
                    setSelectedOrganization(organization);
                    setShowJoinModal(true);
                  }}
                  onLeaveOrganization={handleLeaveOrganization}
                  onViewDetails={setSelectedOrganization}
                />
              ))}
            </div>
          )}
        </div>

        {selectedOrganization && !showJoinModal && (
          <OrganizationDetail
            organization={selectedOrganization}
            membershipStatus={membershipStatuses?.[selectedOrganization?.id] || 'none'}
            currentUserId={user?.id}
            onJoinRequest={() => setShowJoinModal(true)}
            onLeaveOrganization={handleLeaveOrganization}
            onClose={() => setSelectedOrganization(null)}
          />
        )}

        {showJoinModal && selectedOrganization && (
          <JoinRequestModal
            organization={selectedOrganization}
            onSubmit={handleJoinRequest}
            onClose={() => {
              setShowJoinModal(false);
              setSelectedOrganization(null);
            }}
          />
        )}

        {showAdminDashboard && (
          <AdminDashboard
            myOrganizations={myOrganizations}
            currentUserId={user?.id}
            onClose={() => setShowAdminDashboard(false)}
            onOrganizationUpdate={loadOrganizations}
          />
        )}
      </div>
    </div>
  );
}