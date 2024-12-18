import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { BookingSteps } from './BookingSteps';
import { toast } from 'react-toastify';
import { bookingApi } from '../../services/api';
import type { CustomerInfo } from '../../types/booking';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      ease: "easeOut"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export function CustomerInfoForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = React.useState(true);
  const [booking, setBooking] = React.useState(null);
  const [activeField, setActiveField] = React.useState<string | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const [formData, setFormData] = React.useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [formErrors, setFormErrors] = React.useState<Partial<Record<keyof CustomerInfo, string>>>({});

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    async function fetchBooking() {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        const bookingData = await bookingApi.getBooking(id);
        if (!bookingData) {
          toast.error(t('booking.errors.notFound'));
          navigate('/');
          return;
        }
        setBooking(bookingData);
        if (bookingData.customerInfo) {
          setFormData(bookingData.customerInfo);
          setIsSubmitted(true);
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
        toast.error(t('booking.errors.fetchFailed'));
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    }
    fetchBooking();
  }, [id, navigate, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: Partial<Record<keyof CustomerInfo, string>> = {};
    if (!formData.firstName.trim()) errors.firstName = t('booking.errors.required');
    if (!formData.lastName.trim()) errors.lastName = t('booking.errors.required');
    if (!formData.email.trim()) errors.email = t('booking.errors.required');
    if (!formData.phone.trim()) errors.phone = t('booking.errors.required');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = t('booking.errors.invalidEmail');
    }
    
    const phoneRegex = /^\d{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      errors.phone = t('booking.errors.invalidPhone');
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      await bookingApi.updateBooking(id!, {
        customerInfo: formData
      });
      setIsSubmitted(true);
      toast.success(t('booking.success.customerInfo'));
      navigate(`/booking/${id}/payment`);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error(t('booking.errors.updateFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (id: keyof CustomerInfo, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleBack = () => {
    navigate(`/booking/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!booking) return null;

  const formFields = [
    {
      id: 'firstName' as const,
      label: t('booking.form.firstName'),
      placeholder: t('booking.form.enterFirstName'),
      icon: User,
      type: 'text',
      required: true
    },
    {
      id: 'lastName' as const,
      label: t('booking.form.lastName'),
      placeholder: t('booking.form.enterLastName'),
      icon: User,
      type: 'text',
      required: true
    },
    {
      id: 'email' as const,
      label: t('booking.form.email'),
      placeholder: t('booking.form.enterEmail'),
      icon: Mail,
      type: 'email',
      required: true
    },
    {
      id: 'phone' as const,
      label: t('booking.form.phone'),
      placeholder: t('booking.form.enterPhone'),
      icon: Phone,
      type: 'tel',
      required: true
    }
  ];

  const BookingSummary = () => (
    <motion.div
      variants={itemVariants}
      className={`
        relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl
        ${isMobile ? 'mt-8 p-6' : 'p-8'}
      `}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 dark:bg-amber-900 rounded-full filter blur-3xl opacity-20" />
      
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        {t('booking.summary.title')}
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">
            {t('booking.summary.dates')}
          </span>
          <span className="font-medium text-right">
            {new Date(booking.bookingDetails.checkIn).toLocaleDateString()} - {new Date(booking.bookingDetails.checkOut).toLocaleDateString()}
          </span>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">
            {t('booking.summary.guests')}
          </span>
          <span className="font-medium">
            {booking.bookingDetails.guests} {booking.bookingDetails.guests === 1 ? t('common.guest') : t('common.guests')}
          </span>
        </div>

        <div className="flex justify-between items-center pt-4">
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('booking.summary.total')}
          </span>
          <span className="text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
            {new Intl.NumberFormat('th-TH', {
              style: 'currency',
              currency: 'THB'
            }).format(booking.bookingDetails.totalPrice)}
          </span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-amber-50 dark:bg-gray-700 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('booking.summary.description')}
        </p>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-white to-amber-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto">
          <BookingSteps currentStep={1} />

          <div className="mt-8 sm:mt-12">
            {/* Form Section */}
            <div className={`
              grid gap-8
              ${isMobile ? '' : 'md:grid-cols-2'}
            `}>
              <motion.div variants={itemVariants} className="space-y-6 sm:space-y-8">
                <div>
                  <motion.h2 
                    variants={itemVariants}
                    className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent"
                  >
                    {t('booking.form.customerInfo')}
                  </motion.h2>
                  <motion.p 
                    variants={itemVariants}
                    className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400"
                  >
                    {t('booking.form.customerInfoDescription')}
                  </motion.p>
                </div>

                {isSubmitted ? (
                  <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 shadow-lg space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('booking.customerInfo.title')}
                      </h3>
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <Check className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium">{t('booking.customerInfo.submitted')}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            {t('booking.form.firstName')}
                          </label>
                          <div className="text-gray-900 dark:text-white font-medium">
                            {formData.firstName}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            {t('booking.form.lastName')}
                          </label>
                          <div className="text-gray-900 dark:text-white font-medium">
                            {formData.lastName}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          {t('booking.form.email')}
                        </label>
                        <div className="text-gray-900 dark:text-white font-medium">
                          {formData.email}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          {t('booking.form.phone')}
                        </label>
                        <div className="text-gray-900 dark:text-white font-medium">
                          {formData.phone}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                      {t('booking.customerInfo.cantChange')}
                    </p>

                    <Button
                      onClick={() => navigate(`/booking/${id}/payment`)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    >
                      {t('common.next')}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence>
                      {formFields.map((field) => (
                        <motion.div
                          key={field.id}
                          variants={itemVariants}
                          className="relative"
                        >
                          <label 
                            htmlFor={field.id}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2"
                          >
                            {field.label}
                          </label>
                          <div className={`
                            relative rounded-xl overflow-hidden
                            ${activeField === field.id ? 'ring-2 ring-amber-500 dark:ring-amber-400' : ''}
                          `}>
                            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                              <field.icon className={`
                                h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200
                                ${activeField === field.id ? 'text-amber-500' : 'text-gray-400'}
                              `} />
                            </div>
                            <input
                              type={field.type}
                              id={field.id}
                              value={formData[field.id]}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              onFocus={() => setActiveField(field.id)}
                              onBlur={() => setActiveField(null)}
                              placeholder={field.placeholder}
                              required={field.required}
                              className="
                                block w-full 
                                pl-10 sm:pl-12 pr-3 sm:pr-4 
                                py-2.5 sm:py-3
                                text-sm sm:text-base
                                bg-white dark:bg-gray-800 
                                border border-gray-200 dark:border-gray-700
                                focus:outline-none
                                transition-all duration-200
                                placeholder-gray-400 dark:placeholder-gray-500
                              "
                            />
                            <div className={`
                              absolute bottom-0 left-0 h-0.5 bg-amber-500
                              transition-all duration-300 ease-out
                              ${activeField === field.id ? 'w-full' : 'w-0'}
                            `} />
                          </div>
                          {formErrors[field.id] && (
                            <p className="text-xs text-red-500 mt-1">{formErrors[field.id]}</p>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <div className="flex items-center space-x-4 pt-4 sm:pt-6">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="
                          w-full h-12 sm:h-14 
                          text-sm sm:text-base
                          bg-gradient-to-r from-amber-500 to-amber-600 
                          hover:from-amber-600 hover:to-amber-700
                        "
                      >
                        {isLoading ? t('common.pleaseWait') : t('common.continue')}
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                      </Button>
                    </div>
                  </form>
                )}
              </motion.div>

              {/* Summary Section - Show below form on mobile */}
              {isMobile ? (
                <BookingSummary />
              ) : (
                <div className="hidden md:block">
                  <BookingSummary />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}