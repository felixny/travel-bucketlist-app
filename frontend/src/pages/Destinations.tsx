import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { destinationsApi, externalApi } from '../services/mockApiService';
import { Destination, Country } from '../types';
import { Plus, Search, Filter, MapPin, Eye, Edit, Trash2, CheckCircle, Circle } from 'lucide-react';
import toast from 'react-hot-toast';

const Destinations: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [visitedFilter, setVisitedFilter] = useState<boolean | null>(null);
  const [regions, setRegions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadDestinations();
    loadRegions();
  }, []);

  useEffect(() => {
    filterDestinations();
  }, [destinations, searchQuery, selectedRegion, selectedCategory, visitedFilter]);

  const loadDestinations = async () => {
    try {
      setLoading(true);
      const data = await destinationsApi.getAll();
      setDestinations(data);
    } catch (error) {
      toast.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const loadRegions = async () => {
    try {
      const data = await externalApi.getRegions();
      setRegions(data);
    } catch (error) {
      console.error('Failed to load regions:', error);
    }
  };

  const filterDestinations = () => {
    let filtered = destinations;

    if (searchQuery) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRegion) {
      filtered = filtered.filter(dest => dest.region === selectedRegion);
    }

    if (selectedCategory) {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }

    if (visitedFilter !== null) {
      filtered = filtered.filter(dest => dest.visited === visitedFilter);
    }

    setFilteredDestinations(filtered);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        await destinationsApi.delete(id);
        setDestinations(destinations.filter(dest => dest.id !== id));
        toast.success('Destination deleted successfully');
      } catch (error) {
        toast.error('Failed to delete destination');
      }
    }
  };

  const toggleVisited = async (destination: Destination) => {
    try {
      const updated = await destinationsApi.update(destination.id, {
        ...destination,
        visited: !destination.visited
      });
      setDestinations(destinations.map(dest => 
        dest.id === destination.id ? updated : dest
      ));
      toast.success(`Marked as ${updated.visited ? 'visited' : 'not visited'}`);
    } catch (error) {
      toast.error('Failed to update destination');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRegion('');
    setSelectedCategory('');
    setVisitedFilter(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                My Destinations
              </h1>
              <p className="text-gray-600 mt-2">Plan and track your travel adventures</p>
            </div>
            <Link
              to="/add-destination"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Destination</span>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card-modern mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-modern pl-12"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary inline-flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="input-modern"
                >
                  <option value="">All Regions</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-modern"
                >
                  <option value="">All Categories</option>
                  <option value="Beach">Beach</option>
                  <option value="Mountain">Mountain</option>
                  <option value="City">City</option>
                  <option value="Nature">Nature</option>
                  <option value="Culture">Culture</option>
                  <option value="Adventure">Adventure</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={visitedFilter === null ? '' : visitedFilter.toString()}
                  onChange={(e) => setVisitedFilter(e.target.value === '' ? null : e.target.value === 'true')}
                  className="input-modern"
                >
                  <option value="">All</option>
                  <option value="false">Not Visited</option>
                  <option value="true">Visited</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="btn-secondary w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Destinations Grid */}
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No destinations found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {destinations.length === 0 
                ? "Get started by adding your first destination."
                : "Try adjusting your search or filter criteria."
              }
            </p>
            {destinations.length === 0 && (
              <div className="mt-6">
                <Link
                  to="/add-destination"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Destination
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
              <div key={destination.id} className="card-modern group overflow-hidden">
                {destination.image_urls && destination.image_urls.length > 0 && (
                  <div className="h-48 bg-gray-200 relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={destination.image_urls[0]}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <button
                      onClick={() => toggleVisited(destination)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-200"
                    >
                      {destination.visited ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    {destination.category && (
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                          {destination.category}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-2">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{destination.name}</h3>
                      <p className="text-gray-600 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {destination.country}
                      </p>
                      {destination.region && (
                        <p className="text-sm text-blue-600 font-medium">{destination.region}</p>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-2">
                      <Link
                        to={`/destinations/${destination.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(destination.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {destination.notes && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{destination.notes}</p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/destinations/${destination.id}`}
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Link>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      destination.visited 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {destination.visited ? 'Visited' : 'Not Visited'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;
