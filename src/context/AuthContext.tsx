import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'Administrator' | 'Dean of Academics' | 'Head of Department' | 'Placement Director';

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => void;
  demoLogin: (role: UserRole) => void;
  logout: () => void;
}

const DEFAULT_USER: UserProfile = {
  name: 'Dr. Evelyn Vance',
  email: 'dean.academics@campuspulse.edu',
  role: 'Dean of Academics',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('campuspulse-user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER; // Default logged in for demo ease
  });

  const login = (email: string, role: UserRole = 'Administrator') => {
    const newUser: UserProfile = {
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setUser(newUser);
    localStorage.setItem('campuspulse-user', JSON.stringify(newUser));
  };

  const demoLogin = (role: UserRole) => {
    const demoProfiles: Record<UserRole, UserProfile> = {
      'Administrator': {
        name: 'Prof. Rajeshwar Kulkarni',
        email: 'admin.provost@campuspulse.edu',
        role: 'Administrator',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
      'Dean of Academics': {
        name: 'Dr. Evelyn Vance',
        email: 'dean.academics@campuspulse.edu',
        role: 'Dean of Academics',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      },
      'Head of Department': {
        name: 'Dr. Aris Thorne',
        email: 'hod.cse@campuspulse.edu',
        role: 'Head of Department',
        department: 'CSE',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      },
      'Placement Director': {
        name: 'Pooja Singhania',
        email: 'placements.dir@campuspulse.edu',
        role: 'Placement Director',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      },
    };
    const selected = demoProfiles[role];
    setUser(selected);
    localStorage.setItem('campuspulse-user', JSON.stringify(selected));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campuspulse-user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
