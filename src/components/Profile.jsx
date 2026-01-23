import { useState } from 'react'

function Profile({ user }) {
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: user?.email || 'user@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Legal Street, Law City, LC 12345',
    specialization: 'Corporate Law',
    experience: '5 years',
    bio: 'Experienced legal professional specializing in corporate law and contract negotiations.'
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to a backend
    console.log('Profile updated:', profileData)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Profile Settings</h1>
        <p className="text-gray-300">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{profileData.fullName}</h3>
              <p className="text-gray-400 mb-4">{profileData.specialization}</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                Change Photo
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700 mt-6">
            <h4 className="text-lg font-semibold text-white mb-4">Quick Stats</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Cases Handled:</span>
                <span className="text-white font-medium">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Success Rate:</span>
                <span className="text-green-400 font-medium">94%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Experience:</span>
                <span className="text-white font-medium">{profileData.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Member Since:</span>
                <span className="text-white font-medium">Jan 2023</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Personal Information</h3>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isEditing 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
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
                    onChange={handleInputChange}
                    disabled={!isEditing}
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
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {isEditing && (
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
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
            <div className="space-y-4">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-left">
                Change Password
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-left">
                Enable Two-Factor Authentication
              </button>
              <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-left">
                Download Account Data
              </button>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-left">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile