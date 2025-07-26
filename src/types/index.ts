// Types principaux de l'application
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'superadmin' | 'admin' | 'employee';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface AppContextType {
  theme: 'light' | 'dark';
  language: 'fr' | 'en' | 'ar';
  sidebarCollapsed: boolean;
  notifications: Notification[];
  unreadCount: number;
  toggleTheme: () => void;
  setLanguage: (lang: 'fr' | 'en' | 'ar') => void;
  toggleSidebar: () => void;
  markNotificationAsRead: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
}

export interface IDEStats {
  name: string;
  users: number;
  percentage: number;
  color: string;
}