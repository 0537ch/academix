import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../config/api';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  profilePicture: string | null;
  lastLogin: string;
  createdAt: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile...');
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view your profile');
        setLoading(false);
        return;
      }
      console.log('Token:', token);
      const response = await api.get('/users/profile');
      console.log('Profile response:', response.data);
      
      // Set default values if data is missing
      const profileData: UserProfile = {
        name: response.data.name || `${response.data.firstName} ${response.data.lastName}`,
        email: response.data.email || 'Not set',
        role: response.data.role || 'Not set',
        profilePicture: response.data.profilePicture || null,
        lastLogin: response.data.lastLogin ? new Date(response.data.lastLogin).toLocaleString() : 'Never',
        createdAt: response.data.createdAt ? new Date(response.data.createdAt).toLocaleString() : 'Unknown'
      };
      
      setProfile(profileData);
      setFormData(prev => ({ ...prev, name: profileData.name }));
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching profile:', error.response || error);
      toast.error(error.response?.data?.message || 'Failed to load profile');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      const updateData: any = { name: formData.name };
      
      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await api.put('/users/profile', updateData);

      toast.success('Profile updated successfully');
      setIsEditing(false);
      fetchProfile();
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Edit Profile
            </button>
          )}
        </div>

        {!isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-base text-gray-900">{profile?.name || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base text-gray-900">{profile?.email || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Role</p>
                <p className="text-base text-gray-900 capitalize">{profile?.role || 'Not set'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Last Login</p>
                <p className="text-base text-gray-900">
                  {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'Never'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Member Since</p>
                <p className="text-base text-gray-900">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(prev => ({
                    ...prev,
                    name: profile?.name || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  }));
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
