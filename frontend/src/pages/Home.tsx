import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/MockAuthContext';
import { MapPin, Plus, Search, Globe, Camera } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Your Travel
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Bucket List
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Discover, plan, and track your dream destinations. Add photos, notes, and memories 
                to create your personal travel journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {user ? (
                  <Link
                    to="/destinations"
                    className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
                  >
                    <MapPin className="h-5 w-5" />
                    <span>View My Destinations</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Get Started</span>
                    </Link>
                    <Link
                      to="/login"
                      className="btn-secondary text-lg px-8 py-4"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need for your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                travel planning
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Plan, organize, and remember your travel adventures with our comprehensive features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card-modern text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Add Destinations</h3>
              <p className="text-gray-600">
                Easily add new destinations to your bucket list with detailed information and notes.
              </p>
            </div>

            <div className="card-modern text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Photo Management</h3>
              <p className="text-gray-600">
                Upload and organize photos for each destination to create visual memories.
              </p>
            </div>

            <div className="card-modern text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Search & Filter</h3>
              <p className="text-gray-600">
                Find destinations quickly with powerful search and filtering options.
              </p>
            </div>

            <div className="card-modern text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Country Information</h3>
              <p className="text-gray-600">
                Get detailed information about countries and regions from our integrated APIs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="card-modern">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Ready to start your journey?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of travelers who are already planning their next adventure.
              </p>
              <Link
                to="/signup"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create your account</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
