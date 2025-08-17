
"use client";

import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User, UserRole, initialUsers, userPasswords } from "@/lib/users";
import { 
    Donation, initialDonations, DonationStatus, 
    MenuItem, NeedItem, initialAnnadhanamMenu, initialSaplingMenu, initialArulneriNeeds,
    RecentActivity, initialRecentActivities,
    UpcomingEvent, initialUpcomingEvents,
    MainCategory, mainCategoriesData,
    ImageProps, initialGalleryImages
} from "@/lib/donations";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const SIMULATED_CORRECT_UTR = "HDFCR52024072512345678";
const PENDING_TO_FAILED_TIMEOUT = 5 * 60 * 1000; // 5 minutes

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  donations: Donation[];
  loading: boolean;
  logo: string | null;
  qrCodeImage: string | null;
  updateLogo: (logo: string) => void;
  updateQrCodeImage: (image: string) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  addDonation: (donation: Omit<Donation, 'id' | 'date' | 'status' | 'transactionId'>) => number;
  updateDonationStatus: (donationId: number, status: Donation['status']) => void;
  verifyDonationUtr: (donationId: number, utr: string) => Promise<DonationStatus | 'duplicate'>;
  users: User[];
  updateUserRole: (email: string, role: UserRole) => void;
  annadhanamMenu: MenuItem[];
  updateAnnadhanamMenu: (menu: MenuItem[]) => void;
  saplingMenu: MenuItem[];
  updateSaplingMenu: (menu: MenuItem[]) => void;
  arulneriNeeds: NeedItem[];
  updateArulneriNeeds: (needs: NeedItem[]) => void;
  recentActivities: RecentActivity[];
  updateRecentActivities: (activities: RecentActivity[]) => void;
  upcomingEvents: UpcomingEvent[];
  updateUpcomingEvents: (events: UpcomingEvent[]) => void;
  mainCategories: MainCategory[];
  updateMainCategories: (categories: MainCategory[]) => void;
  galleryImages: ImageProps[];
  updateGalleryImages: (images: ImageProps[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [donations, setDonations] = useState<Donation[]>(initialDonations);
  const [loading, setLoading] = useState(true);
  
  const [logo, setLogo] = useState<string | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [annadhanamMenu, setAnnadhanamMenu] = useState<MenuItem[]>(initialAnnadhanamMenu);
  const [saplingMenu, setSaplingMenu] = useState<MenuItem[]>(initialSaplingMenu);
  const [arulneriNeeds, setArulneriNeeds] = useState<NeedItem[]>(initialArulneriNeeds);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(initialRecentActivities);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>(initialUpcomingEvents);
  const [mainCategories, setMainCategories] = useState<MainCategory[]>(mainCategoriesData);
  const [galleryImages, setGalleryImages] = useState<ImageProps[]>(initialGalleryImages);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentFirebaseUser) => {
      setFirebaseUser(currentFirebaseUser);
      if (currentFirebaseUser) {
        let existingUser = users.find(u => u.email === currentFirebaseUser.email);
        
        if (!existingUser) {
          const newUser: User = {
            id: users.length + 1,
            email: currentFirebaseUser.email!,
            role: 'viewer',
          };
          setUsers(prevUsers => [...prevUsers, newUser]);
          existingUser = newUser;
        }
        
        setUser(existingUser);

      } else {
        const sessionUser = sessionStorage.getItem('loggedInUser');
        if (sessionUser) {
          setUser(JSON.parse(sessionUser));
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    try {
      const storedLogo = localStorage.getItem("appLogo");
      if (storedLogo) setLogo(JSON.parse(storedLogo));

      const storedQrCode = localStorage.getItem("qrCodeImage");
      if (storedQrCode) setQrCodeImage(JSON.parse(storedQrCode));

      const storedDonations = localStorage.getItem("allDonations");
      if (storedDonations) setDonations(JSON.parse(storedDonations));

      const storedUsers = localStorage.getItem("allUsers");
      if (storedUsers) setUsers(JSON.parse(storedUsers)); else setUsers(initialUsers);

      const storedAnnadhanamMenu = localStorage.getItem("annadhanamMenu");
      if (storedAnnadhanamMenu) setAnnadhanamMenu(JSON.parse(storedAnnadhanamMenu));

      const storedSaplingMenu = localStorage.getItem("saplingMenu");
      if (storedSaplingMenu) setSaplingMenu(JSON.parse(storedSaplingMenu));

      const storedArulneriNeeds = localStorage.getItem("arulneriNeeds");
      if (storedArulneriNeeds) setArulneriNeeds(JSON.parse(storedArulneriNeeds));

      const storedRecentActivities = localStorage.getItem("recentActivities");
      if (storedRecentActivities) setRecentActivities(JSON.parse(storedRecentActivities));

      const storedUpcomingEvents = localStorage.getItem("upcomingEvents");
      if (storedUpcomingEvents) setUpcomingEvents(JSON.parse(storedUpcomingEvents));

      const storedMainCategories = localStorage.getItem("mainCategories");
      if (storedMainCategories) setMainCategories(JSON.parse(storedMainCategories));
      
      const storedGalleryImages = localStorage.getItem("galleryImages");
      if (storedGalleryImages) setGalleryImages(JSON.parse(storedGalleryImages));


    } catch (error) {
        console.error("Failed to parse from localStorage", error);
    }

    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    try {
      if(logo) localStorage.setItem("appLogo", JSON.stringify(logo));
    } catch (error) {
        console.error("Failed to save logo to localStorage", error);
    }
  }, [logo]);
  
  useEffect(() => {
    try {
      if(qrCodeImage) localStorage.setItem("qrCodeImage", JSON.stringify(qrCodeImage));
    } catch (error) {
        console.error("Failed to save qrCodeImage to localStorage", error);
    }
  }, [qrCodeImage]);

  useEffect(() => {
    try {
        localStorage.setItem("allDonations", JSON.stringify(donations));
    } catch (error) {
        console.error("Failed to save donations to localStorage", error);
    }
  }, [donations]);

  useEffect(() => {
    try {
        localStorage.setItem("allUsers", JSON.stringify(users));
    } catch (error) {
        console.error("Failed to save users to localStorage", error);
    }
  }, [users]);

  useEffect(() => {
    try {
        localStorage.setItem("annadhanamMenu", JSON.stringify(annadhanamMenu));
    } catch (error) {
        console.error("Failed to save annadhanamMenu to localStorage", error);
    }
  }, [annadhanamMenu]);

  useEffect(() => {
    try {
        localStorage.setItem("saplingMenu", JSON.stringify(saplingMenu));
    } catch (error) {
        console.error("Failed to save saplingMenu to localStorage", error);
    }
  }, [saplingMenu]);

  useEffect(() => {
    try {
        localStorage.setItem("arulneriNeeds", JSON.stringify(arulneriNeeds));
    } catch (error) {
        console.error("Failed to save arulneriNeeds to localStorage", error);
    }
  }, [arulneriNeeds]);

  useEffect(() => {
    try {
        localStorage.setItem("recentActivities", JSON.stringify(recentActivities));
    } catch (error) {
        console.error("Failed to save recentActivities to localStorage", error);
    }
  }, [recentActivities]);

  useEffect(() => {
    try {
        localStorage.setItem("upcomingEvents", JSON.stringify(upcomingEvents));
    } catch (error) {
        console.error("Failed to save upcomingEvents to localStorage", error);
    }
  }, [upcomingEvents]);
  
  useEffect(() => {
    try {
        localStorage.setItem("mainCategories", JSON.stringify(mainCategories));
    } catch (error) {
        console.error("Failed to save mainCategories to localStorage", error);
    }
  }, [mainCategories]);
  
  useEffect(() => {
    try {
        localStorage.setItem("galleryImages", JSON.stringify(galleryImages));
    } catch (error) {
        console.error("Failed to save galleryImages to localStorage", error);
    }
  }, [galleryImages]);


  const loginWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      if (email) {
          const existingUser = users.find(u => u.email === email);
          if (!existingUser) {
              const newUser: User = {
                  id: users.length + 1,
                  email: email,
                  role: 'viewer'
              };
              setUsers(prev => [...prev, newUser]);
              setUser(newUser);
          } else {
            setUser(existingUser);
          }
      }
    } catch (error) {
      console.error("Error signing in with Google", error);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    try {
      const userToLogin = users.find(u => u.email === email);
      const correctPassword = userPasswords[email as keyof typeof userPasswords];

      if (userToLogin && correctPassword === pass) {
        setUser(userToLogin);
        sessionStorage.setItem('loggedInUser', JSON.stringify(userToLogin));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error signing in with email", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
        console.error("Error signing out from firebase", error);
    } finally {
      sessionStorage.removeItem('loggedInUser');
      setUser(null);
      setLoading(false);
    }
  };

  const addDonation = (donation: Omit<Donation, 'id' | 'date' | 'status' | 'transactionId'>): number => {
    const newId = donations.length > 0 ? Math.max(...donations.map(d => d.id)) + 1 : 1;
    const newDonation: Donation = {
        ...donation,
        id: newId,
        transactionId: `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        date: new Date().toISOString(),
        status: 'pending',
    };
    setDonations(prev => [...prev, newDonation]);
    return newId;
  }

  const updateDonationStatus = (donationId: number, status: DonationStatus, utr?: string) => {
    setDonations(prev => prev.map(d => d.id === donationId ? { ...d, status, utr: utr || d.utr } : d));
  }

  const verifyDonationUtr = async (donationId: number, utr: string): Promise<DonationStatus | 'duplicate'> => {
    console.log(`Verifying UTR ${utr} for donation ${donationId}. In a real app, this would involve a backend check.`);

    const existingDonationWithUtr = donations.find(d => d.utr === utr && d.id !== donationId);
    if(existingDonationWithUtr) {
        return 'duplicate';
    }

    if (utr === SIMULATED_CORRECT_UTR) {
      updateDonationStatus(donationId, 'successful', utr);
      return 'successful';
    } else {
      updateDonationStatus(donationId, 'pending', utr);
       setTimeout(() => {
         setDonations(prev => {
            const currentDonation = prev.find(d => d.id === donationId);
            if (currentDonation && currentDonation.status === 'pending') {
               return prev.map(d => d.id === donationId ? { ...d, status: 'failed' } : d);
            }
            return prev;
         });
      }, PENDING_TO_FAILED_TIMEOUT);
      return 'pending';
    }
  };

  const updateUserRole = (email: string, role: UserRole) => {
    setUsers(prev => prev.map(u => u.email === email ? { ...u, role } : u));
  }
  
  const updateLogo = (logo: string) => setLogo(logo);
  const updateQrCodeImage = (image: string) => setQrCodeImage(image);
  const updateAnnadhanamMenu = (menu: MenuItem[]) => setAnnadhanamMenu(menu);
  const updateSaplingMenu = (menu: MenuItem[]) => setSaplingMenu(menu);
  const updateArulneriNeeds = (needs: NeedItem[]) => setArulneriNeeds(needs);
  const updateRecentActivities = (activities: RecentActivity[]) => setRecentActivities(activities);
  const updateUpcomingEvents = (events: UpcomingEvent[]) => setUpcomingEvents(events);
  const updateMainCategories = (categories: MainCategory[]) => setMainCategories(categories);
  const updateGalleryImages = (images: ImageProps[]) => setGalleryImages(images);

  return (
    <AuthContext.Provider value={{ 
        user, firebaseUser, users, loading, logo, updateLogo, qrCodeImage, updateQrCodeImage,
        loginWithGoogle, loginWithEmail, logout, 
        donations, addDonation, updateDonationStatus, verifyDonationUtr, updateUserRole, 
        annadhanamMenu, updateAnnadhanamMenu, 
        saplingMenu, updateSaplingMenu, 
        arulneriNeeds, updateArulneriNeeds,
        recentActivities, updateRecentActivities,
        upcomingEvents, updateUpcomingEvents,
        mainCategories, updateMainCategories,
        galleryImages, updateGalleryImages
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

    