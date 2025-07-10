import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import authService from '@/services/auth';

interface User {
  _id: string;
  fullName: string;
  email: string;
  dob?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  login: (email: string, otp: string) => Promise<boolean>;
  signup: (fullName: string, email: string, dob: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  sendOTP: (email: string) => Promise<boolean>;
  signupWithGoogle: () => void;
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
    try {
      const isOTPSent = await authService.sendOtp(email);
      if(isOTPSent)
        return true;
      else 
        return false;
    } catch (error: any) {
      console.error("Error sending OTP:", error.message);
      throw new Error(error.message || 'Failed to send OTP');
    }
  };

  const login = async (email: string, otp: string): Promise<boolean> => {
    try {
      // Mock login validation
      const userData = await authService.login({ email, otp });
      
      if (userData) {
        const user: User = {
          _id: userData._id,
          fullName: userData.fullName,
          email: userData.email,
          dob: userData.dob,
          avatar: userData?.avatar
        };
        
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        return true;
      } 
      return false;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const signup = async (fullName: string, email: string, dob: string, otp: string): Promise<boolean> => {
    // Mock signup validation
    try {
      const userData = await authService.createAccount({ fullName, email, otp, dob });

      if (userData) {
        const newUser: User = {
          _id: userData._id,
          fullName: userData.fullName,
          email: userData.email,
          dob: userData.dob,
          avatar: userData?.avatar
        };
        
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (error: any) {
      console.log("Signup failed", error.message);
      throw new Error(error.message || 'Signup failed');  
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const isLogout = await authService.logout();
      if (isLogout) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error: any) {
      console.error('Error during logout:', error);
      throw new Error(error.message || 'Logout failed');
    }
  };

  const signupWithGoogle = () : void => {
    try {
      authService.signupWithGoogle();
    }
    catch (error: any) {
      console.log("Signup failed", error.message);
      throw new Error(error.message || 'Signup failed');  
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      signupWithGoogle,
      login,
      signup,
      logout,
      sendOTP,
      isAuthenticated,
      setIsAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};