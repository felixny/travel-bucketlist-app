import React, { useState } from 'react';
import { useAuth } from '../contexts/MockAuthContext';
import { User, LogOut, Mail, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Not authenticated</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
                  <UserIcon className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-white">
                  {user.user_metadata?.full_name || 'User'}
                </h2>
                <p className="text-blue-100">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-6 py-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Full Name</p>
                      <p className="text-sm text-gray-500">
                        {user.user_metadata?.full_name || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="h-5 w-5 mr-3 flex items-center justify-center">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Status</p>
                      <p className="text-sm text-gray-500">Active</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={handleSignOut}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {loading ? 'Signing out...' : 'Sign Out'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">About Travel Bucket List</h3>
          <p className="text-gray-600">
            Welcome to your personal travel bucket list! Here you can add, organize, and track 
            all the destinations you want to visit. Add photos, notes, and mark places as visited 
            to create your own travel journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
