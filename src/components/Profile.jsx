import { useState, useEffect } from 'react'
import { getUser, updateUserProfile } from '../services/api'

function Profile({ user }) {
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    specialization: '',
    bio: ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    fetchUserData()
  }, [user])

  const fetchUserData = async () => {
    if (!user?.user_id) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const userData = await getUser(user.user_id)
      
      setProfileData({
        fullName: userData.full_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        specialization: userData.specialization || '',
        bio: userData.bio || ''
      })
    } catch (err) {
      setError(err.message || 'Failed to load profile data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
    if (successMessage) setSuccessMessage(null)
  }

  const handleSave = async () => {
    if (!user?.user_id) return

    try {
      setIsSaving(true)
      setError(null)
      setSuccessMessage(null)

      const updateData = {
        full_name: profileData.fullName,
        phone: profileData.phone || null,
        address: profileData.address || null,
        specialization: profileData.specialization || null,
        bio: profileData.bio || null
      }

      await updateUserProfile(user.user_id, updateData)
      setSuccessMessage('Profile updated successfully!')
      setIsEditing(false)
      
      // Refresh data
      await fetchUserData()
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSuccessMessage(null)
    fetchUserData() // Reset to original data
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Profile Settings</h1>
        <p className="text-gray-300">Manage your account information</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-300">{successMessage}</span>
          </div>
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {profileData.fullName || 'User'}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{profileData.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Form Section */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Personal Information</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Specialization
                    </label>
                    <select
                      name="specialization"
                      value={profileData.specialization}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select specialization</option>
                      <option value="Corporate Law">Corporate Law</option>
                      <option value="Criminal Law">Criminal Law</option>
                      <option value="Family Law">Family Law</option>
                      <option value="Real Estate Law">Real Estate Law</option>
                      <option value="Employment Law">Employment Law</option>
                      <option value="Intellectual Property">Intellectual Property</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter address"
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell us about yourself"
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {isEditing && (
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Security Settings */}
            <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700 mt-6">
              <h3 className="text-xl font-semibold text-white mb-4">Security Settings</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-left flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Change Password
                </button>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-left flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
