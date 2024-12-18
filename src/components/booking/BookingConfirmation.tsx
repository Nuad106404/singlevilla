import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { bookingApi } from '../../services/api';
import { Button } from '../ui/button';
import { BookingSteps } from './BookingSteps';
import { PriceBreakdown } from './PriceBreakdown';
import { CountdownTimer } from './CountdownTimer';
import { format } from 'date-fns';

export function BookingConfirmation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = React.useState(true);
  const [booking, setBooking] = React.useState(null);

  const handleBackToMain = () => {
    navigate('/');
  };

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

  if (isLoading || !booking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <BookingSteps currentStep={3} />

        <div className="mt-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
              {t('booking.confirmation.title')}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {t('booking.confirmation.subtitle')}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-8"
          >
            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('booking.confirmation.details')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('booking.confirmation.checkIn')}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {format(new Date(booking.bookingDetails.checkIn), 'PPP')}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('booking.confirmation.checkOut')}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {format(new Date(booking.bookingDetails.checkOut), 'PPP')}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('booking.confirmation.guests')}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.bookingDetails.guests}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('booking.confirmation.status')}
                  </p>
                  <p className="font-medium capitalize text-gray-900 dark:text-white">
                    {t(`booking.confirmation.statusTypes.${booking.status}`)}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('booking.confirmation.customerInfo')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('booking.confirmation.name')}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.customerInfo.firstName} {booking.customerInfo.lastName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('booking.form.email')}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.customerInfo.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('booking.form.phone')}
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.customerInfo.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('booking.confirmation.priceBreakdown')}
              </h3>
              <PriceBreakdown 
                breakdown={{
                  basePrice: booking.bookingDetails.totalPrice * 0.93,
                  numberOfNights: Math.ceil(
                    (new Date(booking.bookingDetails.checkOut).getTime() - 
                     new Date(booking.bookingDetails.checkIn).getTime()) / 
                    (1000 * 60 * 60 * 24)
                  ),
                  taxes: booking.bookingDetails.totalPrice * 0.07,
                  total: booking.bookingDetails.totalPrice
                }} 
              />
            </div>

            {/* Payment Timer */}
            {booking.status === 'pending_payment' && (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <CountdownTimer
                  expiryTime={new Date(booking.createdAt).getTime() + 24 * 60 * 60 * 1000}
                  onExpire={() => {
                    toast.error(t('booking.payment.expired'));
                    navigate('/');
                  }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate(`/booking/${id}/payment`)}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('common.previous')}
                </Button>
                <Button
                  onClick={handleBackToMain}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                >
                  {t('common.backToMain')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}