
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  role: 'admin' | 'viewer';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('timetable-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Simple login function - in a real app, this would validate against a backend
  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock credentials - in a real app, this would be done server-side
    const validCredentials = [
      { username: 'admin', password: 'admin123', role: 'admin' as const },
      { username: 'user', password: 'user123', role: 'viewer' as const }
    ];

    const matchedUser = validCredentials.find(
      cred => cred.username === username && cred.password === password
    );

    if (matchedUser) {
      const userData: User = {
        username: matchedUser.username,
        role: matchedUser.role
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('timetable-user', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('timetable-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
