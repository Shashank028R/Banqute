
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Organization } from '../types';
import { SAMPLE_ORGANIZATION } from '../constants';
import { db, auth } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';

interface OrganizationContextType {
  organization: Organization;
  updateOrganization: (updates: Partial<Organization>) => Promise<void>;
  loading: boolean;
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [organization, setOrganization] = useState<Organization>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('app-cachedOrg');
      if (cached) return JSON.parse(cached);
    }
    return SAMPLE_ORGANIZATION;
  });
  
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    setIsDark(document.documentElement.classList.contains('dark'));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const orgId = 'org_123';
    const docRef = doc(db, 'organizations', orgId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Organization;
        setOrganization(data);
        localStorage.setItem('app-cachedOrg', JSON.stringify(data));
      } else {
        // Initialize with sample data if it doesn't exist
        // Note: This will fail if the user is not an admin
        setDoc(docRef, SAMPLE_ORGANIZATION).catch(err => {
          console.error("Failed to initialize organization:", err);
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching organization:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateOrganization = async (updates: Partial<Organization>) => {
    const orgId = 'org_123';
    const docRef = doc(db, 'organizations', orgId);
    try {
      await setDoc(docRef, { ...organization, ...updates }, { merge: true });
    } catch (error) {
      console.error("Error updating organization:", error);
    }
  };

  // Provide dark mode adjusted colors if needed, or just use the original
  const currentOrg = {
    ...organization,
    primary_color: isDark ? '#f43f5e' : organization.primary_color, // Rose-500 for dark mode
    secondary_color: isDark ? '#4c0519' : organization.secondary_color, // Rose-950 for dark mode
  };

  return (
    <OrganizationContext.Provider value={{ organization: currentOrg, updateOrganization, loading, user, login, logout }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
