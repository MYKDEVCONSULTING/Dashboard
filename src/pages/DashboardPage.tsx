import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, TrendingUp, Code2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from '../utils/translations';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import type { IDEStats } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useApp();
  const { t } = useTranslation(language);
  const [ideStats, setIdeStats] = useState<IDEStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Données simulées pour les IDE
  useEffect(() => {
    const loadIDEStats = async () => {
      // Simulation d'un chargement async
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStats: IDEStats[] = [
        { name: 'Visual Studio Code', users: 1250, percentage: 45, color: '#007ACC' },
        { name: 'IntelliJ IDEA', users: 680, percentage: 25, color: '#FF6B6B' },
        { name: 'PyCharm', users: 420, percentage: 15, color: '#21C55D' },
        { name: 'WebStorm', users: 280, percentage: 10, color: '#F59E0B' },
        { name: 'Autres', users: 140, percentage: 5, color: '#8B5CF6' }
      ];
      
      setIdeStats(mockStats);
      setLoading(false);
    };

    loadIDEStats();
  }, []);

  const totalUsers = ideStats.reduce((sum, ide) => sum + ide.users, 0);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* En-tête de bienvenue */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('welcome')}, {user?.firstName} !
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Voici un aperçu de vos statistiques IDE de développement
        </p>
      </motion.div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">
                    {t('totalUsers')}
                  </p>
                  <p className="text-3xl font-bold">
                    {loading ? '...' : totalUsers.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-100" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">
                    IDE le plus populaire
                  </p>
                  <p className="text-xl font-bold">
                    {loading ? '...' : ideStats[0]?.name.split(' ')[0] || 'VS Code'}
                  </p>
                </div>
                <Code2 className="h-8 w-8 text-green-100" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">
                    Croissance mensuelle
                  </p>
                  <p className="text-3xl font-bold">+12%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-100" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">
                    Nouveaux utilisateurs
                  </p>
                  <p className="text-3xl font-bold">+248</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-100" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Graphique des IDE populaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t('popularIdes')}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {ideStats.map((ide, index) => (
                    <motion.div
                      key={ide.name}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: ide.color }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {ide.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {ide.users.toLocaleString()} utilisateurs
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {ide.percentage}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Graphique circulaire (placeholder) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Répartition des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                ) : (
                  <div className="relative w-48 h-48">
                    {/* Graphique circulaire simple en CSS */}
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-red-500 via-yellow-500 to-purple-500 flex items-center justify-center">
                      <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {totalUsers.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Total
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};