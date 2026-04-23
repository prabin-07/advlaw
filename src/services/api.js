const API_BASE_URL = 'http://localhost:8000';

export const analyzeCase = async (caseText) => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({ case_text: caseText }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to analyze case');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const listCases = async (limit = 100, skip = 0) => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/cases?limit=${limit}&skip=${skip}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch cases');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.cases || [];
  } catch (error) {
    throw error;
  }
};

export const getCase = async (caseId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cases/${caseId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch case');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const listDocuments = async (limit = 50, skip = 0) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents?limit=${limit}&skip=${skip}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    const data = await response.json();
    return data.documents || [];
  } catch (error) {
    throw error;
  }
};

export const createDocument = async (documentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create document');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteDocument = async (documentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete document');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to register user');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to login');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const listUsers = async (limit = 100, skip = 0) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users?limit=${limit}&skip=${skip}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update profile');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateUserStatus = async (userId, isActive) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: isActive }),
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Failed to update user');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Failed to delete user');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteCase = async (caseId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cases/${caseId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Failed to delete case');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      }
      const error = await response.json().catch(() => null);
      throw new Error(error?.detail || 'Failed to load profile');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};