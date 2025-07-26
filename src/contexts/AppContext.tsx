import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { AppContextType, Notification } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguageState] = useState<'fr' | 'en' | 'ar'>('fr');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Chargement des préférences utilisateur
  useEffect(() => {
    if (user?.id) {
      loadUserPreferences();
      loadNotifications();
      
      // Abonnement aux notifications en temps réel
      const subscription = supabase
        .channel('notifications')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          if (payload.eventType === 'INSERT') {
            const newNotification = transformNotification(payload.new as any);
            setNotifications(prev => [newNotification, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedNotification = transformNotification(payload.new as any);
            setNotifications(prev => 
              prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
            );
          }
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user?.id]);

  // Gestion du thème dans le DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Gestion de la direction RTL pour l'arabe
  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.classList.remove('rtl');
    }
  }, [language]);

  const loadUserPreferences = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const preferences = data.preferences || {};
      if (preferences.theme) setTheme(preferences.theme);
      if (preferences.language) setLanguageState(preferences.language);
      if (preferences.sidebarCollapsed !== undefined) setSidebarCollapsed(preferences.sidebarCollapsed);
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    }
  };

  const saveUserPreferences = async (newPreferences: Record<string, any>) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ preferences: newPreferences })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
    }
  };

  const loadNotifications = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotifications(data.map(transformNotification));
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  };

  const transformNotification = (dbNotification: any): Notification => ({
    id: dbNotification.id,
    userId: dbNotification.user_id,
    title: dbNotification.title,
    message: dbNotification.message,
    type: dbNotification.type,
    isRead: dbNotification.is_read,
    createdAt: dbNotification.created_at
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (user?.id) {
      const preferences = { theme: newTheme, language, sidebarCollapsed };
      saveUserPreferences(preferences);
    }
  };

  const setLanguage = (lang: 'fr' | 'en' | 'ar') => {
    setLanguageState(lang);
    
    if (user?.id) {
      const preferences = { theme, language: lang, sidebarCollapsed };
      saveUserPreferences(preferences);
    }
  };

  const toggleSidebar = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    
    if (user?.id) {
      const preferences = { theme, language, sidebarCollapsed: newCollapsed };
      saveUserPreferences(preferences);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          is_read: false
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la notification:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const value: AppContextType = {
    theme,
    language,
    sidebarCollapsed,
    notifications,
    unreadCount,
    toggleTheme,
    setLanguage,
    toggleSidebar,
    markNotificationAsRead,
    addNotification
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};