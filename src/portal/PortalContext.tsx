import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types/index.ts';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarText: string;
}

interface PortalContextType {
  currentUser: StaffUser;
  setCurrentUser: (user: StaffUser) => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (role?: UserRole) => void;
  logout: () => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const defaultStaff: Record<UserRole, StaffUser> = {
  administrator: {
    id: 'staff-admin-1',
    name: 'Dr. Eleni Tzomaa (Director)',
    email: 'director@hellenicdentalclinic.com',
    role: 'administrator',
    avatarText: 'ET'
  },
  receptionist: {
    id: 'staff-rec-1',
    name: 'Sarah Al-Nuaimi (Reception)',
    email: 'reception@hellenicdentalclinic.com',
    role: 'receptionist',
    avatarText: 'SA'
  },
  doctor: {
    id: 'staff-doc-1',
    name: 'Dr. Mohammad Hayem (Surgeon)',
    email: 'm.hayem@hellenicdentalclinic.com',
    role: 'doctor',
    avatarText: 'MH'
  }
};

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<StaffUser>(defaultStaff.administrator);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const switchRole = (role: UserRole) => {
    setCurrentUser(defaultStaff[role]);
    setRefreshTrigger(prev => prev + 1);
  };

  const login = (role: UserRole = 'administrator') => {
    setCurrentUser(defaultStaff[role]);
    setIsAuthenticated(true);
    setRefreshTrigger(prev => prev + 1);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <PortalContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        isAuthenticated,
        login,
        logout,
        refreshTrigger,
        triggerRefresh
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = (): PortalContextType => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
