/*
  # Schéma initial pour MYKDASHBOARD

  1. Nouvelles tables
    - `profiles` - Profils utilisateurs étendus
      - `id` (uuid, clé primaire, lié à auth.users)
      - `email` (text, unique)
      - `first_name` (text)
      - `last_name` (text)
      - `role` (enum: superadmin, admin, employee)
      - `avatar_url` (text, optionnel)
      - `preferences` (jsonb pour stocker les préférences utilisateur)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `last_login` (timestamp, optionnel)

    - `notifications` - Système de notifications
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence vers profiles)
      - `title` (text)
      - `message` (text)
      - `type` (enum: info, success, warning, error)
      - `is_read` (boolean)
      - `created_at` (timestamp)

    - `ide_stats` - Statistiques des IDE (données de démonstration)
      - `id` (uuid, clé primaire)
      - `name` (text)
      - `users_count` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Activer RLS sur toutes les tables
    - Politiques pour les différents rôles
    - Fonction pour créer automatiquement un profil lors de l'inscription

  3. Données initiales
    - Compte SuperAdmin (MYK/admin123)
    - Données de démonstration pour les IDE
    - Notifications de bienvenue
*/

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Types énumérés
CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'employee');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role user_role DEFAULT 'employee',
  avatar_url text,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type notification_type DEFAULT 'info',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Table des statistiques IDE
CREATE TABLE IF NOT EXISTS ide_stats (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  users_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ide_stats ENABLE ROW LEVEL SECURITY;

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Déclencheurs pour updated_at
CREATE OR REPLACE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_ide_stats_updated_at
    BEFORE UPDATE ON ide_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Politiques RLS pour profiles
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  ));

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  ));

CREATE POLICY "Seuls les admins peuvent créer des profils"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  ));

CREATE POLICY "Seuls les admins peuvent supprimer des profils"
  ON profiles FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  ) AND role != 'superadmin');

-- Politiques RLS pour notifications
CREATE POLICY "Les utilisateurs peuvent voir leurs notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  ));

CREATE POLICY "Les utilisateurs peuvent modifier leurs notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Seuls les admins peuvent créer des notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  ));

-- Politiques RLS pour ide_stats
CREATE POLICY "Tous les utilisateurs authentifiés peuvent voir les stats IDE"
  ON ide_stats FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Seuls les admins peuvent modifier les stats IDE"
  ON ide_stats FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'superadmin')
  ));

-- Fonction pour créer un profil automatiquement lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Utilisateur'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Nouveau'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'employee')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Déclencheur pour créer automatiquement un profil
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insertion des données initiales

-- Compte SuperAdmin (MYK/admin123)
-- Note: Le mot de passe doit être haché par Supabase lors de la création du compte
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  role
) VALUES (
  uuid_generate_v4(),
  'MYK',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"first_name": "Super", "last_name": "Admin", "role": "superadmin"}',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Profil SuperAdmin
INSERT INTO profiles (id, email, first_name, last_name, role, preferences) 
SELECT 
  u.id,
  u.email,
  'Super',
  'Admin',
  'superadmin',
  '{"theme": "light", "language": "fr", "sidebarCollapsed": false}'
FROM auth.users u 
WHERE u.email = 'MYK'
ON CONFLICT (email) DO NOTHING;

-- Données de démonstration pour les IDE
INSERT INTO ide_stats (name, users_count) VALUES
  ('Visual Studio Code', 1250),
  ('IntelliJ IDEA', 680),
  ('PyCharm', 420),
  ('WebStorm', 280),
  ('Sublime Text', 140)
ON CONFLICT (name) DO NOTHING;

-- Notification de bienvenue pour le SuperAdmin
INSERT INTO notifications (user_id, title, message, type) 
SELECT 
  p.id,
  'Bienvenue sur MYKDASHBOARD',
  'Votre tableau de bord professionnel est maintenant configuré et prêt à être utilisé. Explorez toutes les fonctionnalités disponibles.',
  'success'
FROM profiles p 
WHERE p.email = 'MYK'
ON CONFLICT DO NOTHING;