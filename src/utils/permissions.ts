import type { User } from '../types';

// Définition des permissions par rôle
export const PERMISSIONS = {
  SUPER_ADMIN: {
    canManageUsers: true,
    canDeleteUsers: true,
    canChangeRoles: true,
    canViewAllData: true,
    canManageSettings: true,
    canDeleteNotifications: true
  },
  ADMIN: {
    canManageUsers: true,
    canDeleteUsers: false, // Ne peut pas supprimer le SuperAdmin
    canChangeRoles: true,
    canViewAllData: true,
    canManageSettings: true,
    canDeleteNotifications: true
  },
  EMPLOYEE: {
    canManageUsers: false,
    canDeleteUsers: false,
    canChangeRoles: false,
    canViewAllData: false,
    canManageSettings: false,
    canDeleteNotifications: false
  }
};

export const hasPermission = (user: User | null, permission: keyof typeof PERMISSIONS.SUPER_ADMIN): boolean => {
  if (!user) return false;

  switch (user.role) {
    case 'superadmin':
      return PERMISSIONS.SUPER_ADMIN[permission];
    case 'admin':
      return PERMISSIONS.ADMIN[permission];
    case 'employee':
      return PERMISSIONS.EMPLOYEE[permission];
    default:
      return false;
  }
};

export const canManageUser = (currentUser: User | null, targetUser: User): boolean => {
  if (!currentUser) return false;
  
  // Le SuperAdmin ne peut pas être supprimé ou modifié (sauf par lui-même)
  if (targetUser.role === 'superadmin' && currentUser.id !== targetUser.id) {
    return false;
  }
  
  // Seuls SuperAdmin et Admin peuvent gérer les utilisateurs
  return hasPermission(currentUser, 'canManageUsers');
};

export const getAccessibleRoutes = (user: User | null): string[] => {
  if (!user) return ['/login'];
  
  const baseRoutes = ['/dashboard', '/settings', '/notifications'];
  
  if (hasPermission(user, 'canManageUsers')) {
    baseRoutes.push('/users');
  }
  
  return baseRoutes;
};