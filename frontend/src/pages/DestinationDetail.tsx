import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { destinationsApi } from '../services/mockApiService';
import { Destination } from '../types';
import { ArrowLeft, Edit, Trash2, CheckCircle, Circle, MapPin, Calendar, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const DestinationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadDestination(id);
    }
  }, [id]);

  const loadDestination = async (destinationId: string) => {
    try {
      setLoading(true);
      const data = await destinationsApi.getById(destinationId);
      setDestination(data);
    } catch (error) {
      toast.error('Failed to load destination');
      navigate('/destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!destination) return;
    
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        await destinationsApi.delete(destination.id);
        toast.success('Destination deleted successfully');
        navigate('/destinations');
      } catch (error) {
        toast.error('Failed to delete destination');
      }
    }
  };

  const toggleVisited = async () => {
    if (!destination) return;
    
    try {
      const updated = await destinationsApi.update(destination.id, {
        ...destination,
        visited: !destination.visited
      });
      setDestination(updated);
      toast.success(`Marked as ${updated.visited ? 'visited' : 'not visited'}`);
    } catch (error) {
      toast.error('Failed to update destination');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Destination not found</h2>
          <Link
            to="/destinations"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/destinations')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Destinations
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{destination.name}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">{destination.country}</span>
                {destination.region && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-lg">{destination.region}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={toggleVisited}
                className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  destination.visited
                    ? 'bg-green-100 text-green-800 hover:bg-green-200 hover:scale-105'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                {destination.visited ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <Circle className="h-4 w-4 mr-2" />
                )}
                {destination.visited ? 'Visited' : 'Not Visited'}
              </button>
              
              <Link
                to={`/destinations/${destination.id}/edit`}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Link>
              
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-xl text-red-700 bg-white hover:bg-red-50 hover:scale-105 transition-all duration-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {destination.image_urls && destination.image_urls.length > 0 && (
              <div className="card-modern">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Photos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destination.image_urls.map((url, index) => (
                    <div key={index} className="relative group overflow-hidden rounded-xl">
                      <img
                        src={url}
                        alt={`${destination.name} ${index + 1}`}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/400x300/667eea/ffffff?text=${encodeURIComponent(destination.name)}`;
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {destination.notes && (
              <div className="card-modern">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{destination.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <div className="card-modern">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-500">{destination.country}</p>
                  </div>
                </div>

                {destination.region && (
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Region</p>
                      <p className="text-sm text-gray-500">{destination.region}</p>
                    </div>
                  </div>
                )}

                {destination.category && (
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Category</p>
                      <p className="text-sm text-gray-500">{destination.category}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Added</p>
                    <p className="text-sm text-gray-500">
                      {new Date(destination.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="h-5 w-5 mr-3 flex items-center justify-center">
                    {destination.visited ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Status</p>
                    <p className="text-sm text-gray-500">
                      {destination.visited ? 'Visited' : 'Not Visited'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-modern">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={toggleVisited}
                  className="btn-primary w-full text-center"
                >
                  {destination.visited ? 'Mark as Not Visited' : 'Mark as Visited'}
                </button>
                
                <Link
                  to={`/destinations/${destination.id}/edit`}
                  className="btn-secondary w-full text-center"
                >
                  Edit Destination
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
