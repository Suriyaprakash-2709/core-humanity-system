
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { User, Role } from '@/lib/types';
import { api } from '@/services/api';

// Mock user data for demo purposes
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as Role,
    password: 'admin123',
    avatar: 'https://i.pravatar.cc/150?img=65',
  },
  {
    id: '2',
    name: 'HR Manager',
    email: 'hr@example.com',
    role: 'hr' as Role,
    password: 'hr123',
    avatar: 'https://i.pravatar.cc/150?img=45',
  },
  {
    id: '3',
    name: 'John Employee',
    email: 'employee@example.com',
    role: 'employee' as Role,
    password: 'employee123',
    avatar: 'https://i.pravatar.cc/150?img=33',
  },
];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('hrmsToken');
        if (token) {
          // In a real app, this would verify the token with the backend
          // const response = await api.get('/auth/verify');
          // const userData = response.data;
          
          // For demo purposes, we'll use stored user data
          const storedUser = localStorage.getItem('hrmsUser');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        logout(); // Clear invalid session
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would make an API call
      // const response = await api.post('/auth/login', { email, password });
      // const { user: userData, token } = response.data;
      
      // For demo purposes, we'll simulate the API response
      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        
        // Simulate token generation
        const demoToken = btoa(`${email}:${Date.now()}`);
        
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem('hrmsUser', JSON.stringify(userWithoutPassword));
        localStorage.setItem('hrmsToken', demoToken);
        toast.success(`Welcome back, ${foundUser.name}!`);
        return true;
      } else {
        toast.error('Invalid email or password');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const logout = async () => {
    try {
      // In a real app, this would call the logout API endpoint
      // await api.post('/auth/logout');
      
      // Clear user data and token
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('hrmsUser');
      localStorage.removeItem('hrmsToken');
      navigate('/');
      toast.info('You have been logged out');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear data on error
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('hrmsUser');
      localStorage.removeItem('hrmsToken');
      navigate('/');
    }
  };

  // Don't render children until we've checked if the user is authenticated
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
