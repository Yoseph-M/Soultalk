import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'seeker' | 'listener' | 'professional' | 'client' | 'admin';
  role: 'seeker' | 'listener' | 'professional' | 'client' | 'admin';
  avatar?: string;
  verified?: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  rejectionReasonType?: string;
  notSignedIn?: boolean;
  bio?: string;
  rating?: number;
  sessions_completed?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  signup: (userData: any) => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  isLoading: boolean;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          let response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (response.status === 401) {
            console.log('Token expired during init, attempting refresh...');
            const newToken = await refreshAccessToken();
            if (newToken) {
              response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
                headers: { 'Authorization': `Bearer ${newToken}` }
              });
            }
          }

          if (response.ok) {
            const userData = await response.json();

            // Security: If professional/listener is not verified, don't sign them in
            if ((userData.role === 'professional' || userData.role === 'listener') && !userData.verified) {
              logout();
              setIsLoading(false);
              return;
            }

            setUser({
              id: userData.id,
              name: userData.first_name ? `${userData.first_name} ${userData.last_name}` : userData.username,
              email: userData.email,
              type: userData.role,
              role: userData.role,
              avatar: userData.profile_photo
                ? (String(userData.profile_photo).startsWith('http') ? userData.profile_photo : `${API_BASE_URL}${userData.profile_photo}`)
                : '',
              verified: userData.verified,
              verificationStatus: userData.verification_status,
              rejectionReason: userData.rejection_reason,
              rejectionReasonType: userData.rejection_reason_type,
              bio: userData.bio,
              rating: userData.rating,
              sessions_completed: userData.sessions_completed
            });
          } else {
            console.warn('Init auth failed, logging out');
            logout();
          }
        } catch (e) {
          console.error('Init auth error:', e);
          logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login error details:', errorData);
        // Throw full object stringified so Auth.tsx can parse it
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      console.log('Login successful, tokens received');

      const userResponse = await fetch(`${API_BASE_URL}/api/auth/me/`, {
        headers: { 'Authorization': `Bearer ${data.access}` }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        const userObj: User = {
          id: userData.id,
          name: userData.first_name ? `${userData.first_name} ${userData.last_name}` : userData.username,
          email: userData.email,
          type: userData.role,
          role: userData.role,
          avatar: userData.profile_photo
            ? (String(userData.profile_photo).startsWith('http') ? userData.profile_photo : `${API_BASE_URL}${userData.profile_photo}`)
            : '',
          verified: userData.verified,
          verificationStatus: userData.verification_status,
          rejectionReason: userData.rejection_reason,
          rejectionReasonType: userData.rejection_reason_type,
          bio: userData.bio,
          rating: userData.rating,
          sessions_completed: userData.sessions_completed
        };

        // Security: If professional/listener is not verified, do NOT sign them in
        if ((userData.role === 'professional' || userData.role === 'listener') && !userData.verified) {
          // Ensure no tokens/user state is saved
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setUser(null);
          // Return user object with a flag so Auth.tsx knows to redirect but not treat as logged in
          return { ...userObj, notSignedIn: true };
        }

        // Only persist tokens and user state if verified or not a professional
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
        return userObj;
      } else {
        console.error('Failed to fetch user details');
        return null;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const userData = await response.json();
        const userObj: User = {
          id: userData.id,
          name: userData.first_name ? `${userData.first_name} ${userData.last_name}` : userData.username,
          email: userData.email,
          type: userData.role,
          role: userData.role,
          avatar: userData.profile_photo
            ? (String(userData.profile_photo).startsWith('http') ? userData.profile_photo : `${API_BASE_URL}${userData.profile_photo}`)
            : '',
          verified: userData.verified,
          verificationStatus: userData.verification_status,
          rejectionReason: userData.rejection_reason,
          rejectionReasonType: userData.rejection_reason_type,
          bio: userData.bio,
          rating: userData.rating,
          sessions_completed: userData.sessions_completed
        };
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
      }
    } catch (e) {
      console.error('Refresh user error:', e);
    }
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const signup = async (userData: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', userData.email);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('role', userData.userType);
      formData.append('first_name', userData.firstName);
      formData.append('last_name', userData.lastName);
      if (userData.phone) formData.append('phone', userData.phone);
      if (userData.dob) formData.append('dob', userData.dob);
      if (userData.specialization) formData.append('specialization', userData.specialization);
      if (userData.idType) formData.append('id_type', userData.idType);
      if (userData.idNumber) formData.append('id_number_input', userData.idNumber);
      if (userData.issuingAuthority) formData.append('issuing_authority_input', userData.issuingAuthority);
      if (userData.location) formData.append('location', userData.location);

      if (userData.profilePhotoFile) {
        formData.append('profile_photo', userData.profilePhotoFile);
      }
      if (userData.idImageFile) {
        formData.append('id_image', userData.idImageFile);
      }
      if (userData.idImageBackFile) {
        formData.append('id_image_back', userData.idImageBackFile);
      }
      if (userData.singleDocFile) {
        formData.append('certificates', userData.singleDocFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
        method: 'POST',
        // Note: When using FormData, do NOT set Content-Type header. 
        // The browser will set it with the correct boundary.
        body: formData,
      });

      if (!response.ok) {
        let errorData;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
        } else {
          const textError = await response.text();
          console.error('Signup error (non-JSON):', textError);
          errorData = { detail: 'Server error. Please try again later.' };
        }
        console.error('Signup error details:', errorData);
        throw new Error(JSON.stringify(errorData));
      }

      if (!userData.skipLogin) {
        await login(userData.email, userData.password);
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        return data.access;
      } else {
        logout();
        return null;
      }
    } catch (e) {
      logout();
      return null;
    }
  }, [logout]);

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    let token = localStorage.getItem('accessToken');

    if (!token) {
      console.warn(`Attempted fetch to ${url} without token.`);
      // If we have no token, and it's an authenticated route, it will fail 401 anyway.
      // But let's at least try the fetch in case it's a public endpoint with optional auth.
    }

    const headers = {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : ''
    };

    console.log(`fetching ${url}...`);
    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      console.log('401 detected, attempting token refresh...');
      const newToken = await refreshAccessToken();
      if (newToken) {
        console.log('Refresh successful, retrying request...');
        const retryHeaders = {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`
        };
        response = await fetch(url, { ...options, headers: retryHeaders });
      } else {
        console.warn('Refresh failed or no refresh token.');
      }
    }

    return response;
  }, [refreshAccessToken]);

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, refreshUser, updateUser, isLoading, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
};