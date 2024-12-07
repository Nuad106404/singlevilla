import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { login, clearError } from '../../store/slices/authSlice';
import { AuthLayout } from './AuthLayout';

export function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(login({ 
        email: formData.email, 
        password: formData.password 
      })).unwrap();
      if (resultAction) {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      // Error is handled by the reducer
    }
  };

  const inputVariants = {
    focus: { scale: 1.02 },
    blur: { scale: 1 },
  };

  return (
    <AuthLayout
      title={t('auth.login')}
      subtitle={t('auth.loginSubtitle')}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 p-3 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('auth.email')}
          </label>
          <motion.div
            variants={inputVariants}
            whileFocus="focus"
            animate="blur"
            className="relative"
          >
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
              required
            />
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </motion.div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('auth.password')}
          </label>
          <motion.div
            variants={inputVariants}
            whileFocus="focus"
            animate="blur"
            className="relative"
          >
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
              required
            />
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </motion.div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              className="rounded border-gray-300 dark:border-gray-600 text-amber-600 focus:ring-amber-500 dark:focus:ring-amber-400"
            />
            <span>{t('auth.rememberMe')}</span>
          </label>
          <a
            href="/forgot-password"
            className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
          >
            {t('auth.forgotPassword')}
          </a>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              <span>{t('common.loading')}</span>
            </div>
          ) : (
            t('auth.loginButton')
          )}
        </motion.button>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {t('auth.noAccount')}{' '}
          <a
            href="/register"
            className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium transition-colors"
          >
            {t('auth.registerLink')}
          </a>
        </p>

        {/* Social Login */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              {t('auth.orContinueWith')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Google
            </span>
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-[#1877F2] hover:bg-[#1864D9] text-white rounded-lg transition-colors duration-200"
          >
            <img src="/facebook.svg" alt="Facebook" className="w-5 h-5" />
            <span className="text-sm font-medium">Facebook</span>
          </motion.button>
        </div>
      </form>
    </AuthLayout>
  );
}
