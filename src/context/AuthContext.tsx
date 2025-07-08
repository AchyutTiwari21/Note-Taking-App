import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  _id: string;
  fullName: string;
  email: string;
  dob: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, otp: string) => Promise<boolean>;
  signup: (fullName: string, email: string, dob: string, otp: string) => Promise<boolean>;
  logout: () => void;
  sendOTP: (email: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const sendOTP = async (email: string): Promise<boolean> => {
    // Mock OTP sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`OTP sent to ${email}: 123456`);
    return true;
  };

  const login = async (email: string, otp: string): Promise<boolean> => {
    // Mock login validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (otp === '123456') {
      const mockUser: User = {
        _id: '1',
        fullName: 'John Doe',
        email: email,
        dob: '1990-01-01'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const signup = async (fullName: string, email: string, dob: string, otp: string): Promise<boolean> => {
    // Mock signup validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (otp === '123456') {
      const newUser: User = {
        _id: Date.now().toString(),
        fullName,
        email,
        dob
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      sendOTP,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};