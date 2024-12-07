import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingCart,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: {
    value: string;
    isPositive: boolean;
  };
}

function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
          <Icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span
          className={`text-sm font-medium ${
            trend.isPositive
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {trend.value}
        </span>
        {trend.isPositive ? (
          <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400 ml-1" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400 ml-1" />
        )}
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
          vs last month
        </span>
      </div>
    </motion.div>
  );
}

export function DashboardPage() {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('dashboard.totalUsers'),
      value: '2,543',
      icon: Users,
      trend: { value: '12.5%', isPositive: true },
    },
    {
      title: t('dashboard.revenue'),
      value: '$45,234',
      icon: DollarSign,
      trend: { value: '8.2%', isPositive: true },
    },
    {
      title: t('dashboard.orders'),
      value: '1,345',
      icon: ShoppingCart,
      trend: { value: '3.1%', isPositive: false },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {t('dashboard.welcome')}
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {t('dashboard.overview')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('dashboard.recentActivity')}
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    New user registered
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    2 minutes ago
                  </p>
                </div>
              </div>
              <button className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300">
                View
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
