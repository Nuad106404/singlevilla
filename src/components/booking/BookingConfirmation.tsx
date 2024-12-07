import React from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, Users, Building2, Download, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../lib/utils';
import { Button } from '../ui/button';
import type { BookingState } from '../../types/booking';

interface BookingConfirmationProps {
  booking: BookingState;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
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
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};

export function BookingConfirmation({ booking }: BookingConfirmationProps) {
  const { t } = useTranslation();
  const { customerInfo, bookingDetails, reservationId } = booking;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: t('booking.confirmation.success'),
        text: `${t('booking.confirmation.reservationId')}: ${reservationId}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDownload = () => {
    // Create booking details text
    const bookingText = `
${t('booking.confirmation.success')}
${t('booking.confirmation.reservationId')}: ${reservationId}

${t('booking.confirmation.stayDetails')}
${t('booking.confirmation.checkIn')}: ${format(bookingDetails.checkIn, 'PPP')}
${t('booking.confirmation.checkOut')}: ${format(bookingDetails.checkOut, 'PPP')}
${t('booking.guests')}: ${bookingDetails.guests}
${t('booking.confirmation.totalAmount')}: ${formatPrice(bookingDetails.totalPrice)}

${t('booking.confirmation.guestInfo')}
${t('booking.form.firstName')}: ${customerInfo.firstName}
${t('booking.form.lastName')}: ${customerInfo.lastName}
${t('booking.form.email')}: ${customerInfo.email}
${t('booking.form.phone')}: ${customerInfo.phone}
    `;

    // Create and download file
    const blob = new Blob([bookingText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${reservationId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-8"
    >
      {/* Success Banner */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="px-4 sm:px-8 py-12 sm:py-16 text-center relative overflow-hidden">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-16 sm:w-20 h-16 sm:h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-6 sm:mb-8 shadow-lg"
          >
            <Check className="h-8 sm:h-10 w-8 sm:w-10 text-emerald-500" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {t('booking.confirmation.success')}
          </h2>
          <p className="text-emerald-50 text-base sm:text-lg">
            {t('booking.confirmation.reservationId')}: <span className="font-mono">{reservationId}</span>
          </p>
          
          {/* Decorative Elements */}
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        </div>
      </motion.div>

      {/* Stay Details Card */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
        <div className="p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6 sm:mb-8">
            {t('booking.confirmation.stayDetails')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">{t('booking.confirmation.checkIn')}</span>
                </div>
                <p className="text-lg sm:text-xl text-gray-900 dark:text-white">
                  {format(bookingDetails.checkIn, 'PPP')}
                </p>
              </div>
              <div>
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">{t('booking.guests')}</span>
                </div>
                <p className="text-lg sm:text-xl text-gray-900 dark:text-white">
                  {bookingDetails.guests} {bookingDetails.guests === 1 ? t('common.guest') : t('common.guests')}
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">{t('booking.confirmation.checkOut')}</span>
                </div>
                <p className="text-lg sm:text-xl text-gray-900 dark:text-white">
                  {format(bookingDetails.checkOut, 'PPP')}
                </p>
              </div>
              <div>
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                  <Building2 className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">{t('booking.confirmation.paymentMethod')}</span>
                </div>
                <p className="text-lg sm:text-xl text-gray-900 dark:text-white capitalize">
                  {booking.paymentMethod?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700">
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('booking.confirmation.totalAmount')}</p>
              <p className="text-2xl sm:text-4xl font-bold text-amber-600 mt-1">
                {formatPrice(bookingDetails.totalPrice)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <Button
                variant="secondary"
                className="flex items-center justify-center w-full sm:w-auto px-6"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                {t('common.download')}
              </Button>
              <Button
                variant="secondary"
                className="flex items-center justify-center w-full sm:w-auto px-6"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t('common.share')}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Guest Information */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6 sm:mb-8">
          {t('booking.confirmation.guestInfo')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('booking.form.firstName')}</p>
            <p className="text-lg sm:text-xl text-gray-900 dark:text-white">
              {customerInfo.firstName} {customerInfo.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('booking.form.email')}</p>
            <p className="text-lg sm:text-xl text-gray-900 dark:text-white">{customerInfo.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('booking.form.phone')}</p>
            <p className="text-lg sm:text-xl text-gray-900 dark:text-white">{customerInfo.phone}</p>
          </div>
        </div>
      </motion.div>

      {/* Return Home Button */}
      <motion.div variants={itemVariants} className="flex justify-center pt-4">
        <Button
          onClick={() => window.location.href = '/'}
          variant="secondary"
          size="lg"
          className="w-full sm:w-auto px-8"
        >
          {t('booking.confirmation.returnHome')}
        </Button>
      </motion.div>
    </motion.div>
  );
}