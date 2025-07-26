// Types générés automatiquement par Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: 'superadmin' | 'admin' | 'employee';
          avatar_url?: string;
          created_at: string;
          updated_at: string;
          last_login?: string;
          preferences: Record<string, any>;
        };
        Insert: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role?: 'superadmin' | 'admin' | 'employee';
          avatar_url?: string;
          preferences?: Record<string, any>;
        };
        Update: {
          first_name?: string;
          last_name?: string;
          role?: 'superadmin' | 'admin' | 'employee';
          avatar_url?: string;
          last_login?: string;
          preferences?: Record<string, any>;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          is_read?: boolean;
        };
        Update: {
          is_read?: boolean;
        };
      };
      ide_stats: {
        Row: {
          id: string;
          name: string;
          users_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          users_count: number;
        };
        Update: {
          users_count?: number;
        };
      };
    };
  };
}