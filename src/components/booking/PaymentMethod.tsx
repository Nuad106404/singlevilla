import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { bookingApi } from '../../services/api';
import { BookingSteps } from './BookingSteps';
import { Button } from '../ui/button';
import { QRCode } from './QRCode';
import { PaymentDetails } from './PaymentDetails';
import { SlipUpload } from './SlipUpload';
import cn from 'classnames';

export function PaymentMethod() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = React.useState(true);
  const [booking, setBooking] = React.useState(null);
  const [selectedMethod, setSelectedMethod] = React.useState<'bank_transfer' | 'promptpay'>('promptpay');
  const [paymentSlipUrl, setPaymentSlipUrl] = React.useState<string>('');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string>('');
  const [isPaymentConfirmed, setIsPaymentConfirmed] = React.useState(false);

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
        // If booking has payment slip, set confirmed state
        if (bookingData.paymentSlipUrl) {
          setPaymentSlipUrl(bookingData.paymentSlipUrl);
          setIsPaymentConfirmed(true);
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

  const handlePaymentMethodSelect = async (method: string) => {
    try {
      await bookingApi.updateBooking(id, {
        paymentMethod: method,
        status: 'pending_payment'
      });
      navigate(`/booking/${id}/confirmation`);
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast.error(t('booking.errors.updateFailed'));
    }
  };

  const handleFileSelect = (file: File) => {
    if (isPaymentConfirmed) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleConfirmPayment = async () => {
    if (!selectedFile || isPaymentConfirmed) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('slip', selectedFile);

      const response = await fetch('/api/upload/slip', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setPaymentSlipUrl(data.fileUrl);
      setIsPaymentConfirmed(true);
      
      // Update booking payment status
      await bookingApi.updateBooking(id!, {
        status: 'pending',
        paymentDetails: {
          method: selectedMethod,
          slipUrl: data.fileUrl,
          status: 'pending'
        }
      });

      toast.success(t('payment.success.confirmed'));
      navigate(`/booking/${id}/confirmation`);
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error(t('payment.errors.confirmFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !booking) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <BookingSteps currentStep={2} />
        
        <div className="mt-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
              {t('booking.payment.selectMethod')}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {t('booking.payment.choosePreferred')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              type="button"
              onClick={() => setSelectedMethod('bank_transfer')}
              className={cn(
                "relative p-6 rounded-xl transition-all duration-200",
                "border-2",
                selectedMethod === 'bank_transfer' 
                  ? "border-amber-500 bg-white dark:bg-gray-800 shadow-lg" 
                  : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50",
                "hover:border-amber-500 hover:shadow-md"
              )}
            >
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {t('booking.payment.bankTransfer')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('booking.payment.bankTransferDesc')}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('promptpay')}
              className={cn(
                "relative p-6 rounded-xl transition-all duration-200",
                "border-2",
                selectedMethod === 'promptpay' 
                  ? "border-amber-500 bg-white dark:bg-gray-800 shadow-lg" 
                  : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50",
                "hover:border-amber-500 hover:shadow-md"
              )}
            >
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {t('booking.payment.promptPay')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('booking.payment.promptPayDesc')}
                </p>
              </div>
            </button>
          </div>

          <div className="mt-8">
            {selectedMethod === 'promptpay' ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="space-y-6">
                  <QRCode 
                    amount={booking.bookingDetails.totalPrice} 
                    promptpayId="0123456789"
                  />

                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      {t('booking.payment.instructions')}
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>{t('booking.payment.step1')}</li>
                      <li>{t('booking.payment.step2')}</li>
                      <li>{t('booking.payment.step3')}</li>
                      <li>{t('booking.payment.step4')}</li>
                    </ol>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <PaymentDetails booking={{ customerInfo: booking.customerInfo, bookingDetails: booking }} />
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                {isPaymentConfirmed ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('booking.slip.uploaded')}
                    </h3>
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                      <img
                        src={paymentSlipUrl}
                        alt={t('booking.slip.upload.title')}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('booking.slip.cantChange')}
                    </p>
                  </div>
                ) : (
                  <SlipUpload
                    onUpload={handleFileSelect}
                    onRemove={() => {
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    uploadedFile={selectedFile}
                    previewUrl={previewUrl}
                  />
                )}

<div className="flex flex-col sm:flex-row gap-4">
                {!isPaymentConfirmed ? (
                  <Button
                    onClick={handleConfirmPayment}
                    disabled={isLoading || !selectedFile}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      t('booking.payment.confirm')
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => navigate(`/booking/${id}`)}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {t('common.previous')}
                    </Button>
                    <Button
                      onClick={() => navigate(`/booking/${id}/confirmation`)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    >
                      {t('common.next')}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
              </div>

              {selectedFile && !isPaymentConfirmed && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                    <img
                      src={previewUrl}
                      alt={t('booking.slip.upload.title')}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}