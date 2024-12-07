import React from 'react';
import { motion } from 'framer-motion';
import { Building2, QrCode, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { PaymentDetails } from './PaymentDetails';
import { SlipUpload } from './SlipUpload';
import { CountdownTimer } from './CountdownTimer';
import { QRCode } from './QRCode';
import type { BookingState } from '../../types/booking';

type PaymentType = 'bank_transfer' | 'promptpay';

interface PaymentMethodProps {
  booking: BookingState;
  onSelect: (method: PaymentType, slip: File) => void;
}

export function PaymentMethod({ booking, onSelect }: PaymentMethodProps) {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentType | null>(null);
  const [uploadedSlip, setUploadedSlip] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleUploadSlip = (file: File) => {
    setUploadedSlip(file);
  };

  const handleRemoveSlip = () => {
    setUploadedSlip(null);
  };

  const handleConfirmPayment = async () => {
    if (selectedMethod && uploadedSlip) {
      setIsSubmitting(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        onSelect(selectedMethod, uploadedSlip);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      <PaymentDetails booking={booking} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('booking.payment.selectMethod')}
            </h3>
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMethod('bank_transfer')}
                className={`w-full flex items-center p-4 border-2 rounded-lg transition-colors ${
                  selectedMethod === 'bank_transfer'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-amber-500'
                }`}
              >
                <Building2 className="h-6 w-6 text-amber-600 mr-3" />
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {t('booking.payment.bankTransfer.title')}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('booking.payment.bankTransfer.description')}
                  </p>
                </div>
                {selectedMethod === 'bank_transfer' && (
                  <Check className="h-5 w-5 text-amber-600" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMethod('promptpay')}
                className={`w-full flex items-center p-4 border-2 rounded-lg transition-colors ${
                  selectedMethod === 'promptpay'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-amber-500'
                }`}
              >
                <QrCode className="h-6 w-6 text-amber-600 mr-3" />
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {t('booking.payment.promptpay.title')}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('booking.payment.promptpay.description')}
                  </p>
                </div>
                {selectedMethod === 'promptpay' && (
                  <Check className="h-5 w-5 text-amber-600" />
                )}
              </motion.button>
            </div>
          </div>

          {selectedMethod === 'bank_transfer' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('booking.payment.bankTransfer.title')}
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('booking.payment.bankTransfer.bankName')}
                  </dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">Kasikorn Bank</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('booking.payment.bankTransfer.accountName')}
                  </dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">Luxury Villa Co., Ltd.</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('booking.payment.bankTransfer.accountNumber')}
                  </dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">123-4-56789-0</dd>
                </div>
              </dl>
            </motion.div>
          )}

          {selectedMethod === 'promptpay' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('booking.payment.promptpay.title')}
              </h3>
              <div className="flex justify-center">
                <QRCode
                  amount={booking.bookingDetails.totalPrice}
                  promptpayId="1234567890123"
                />
              </div>
              <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
                {t('booking.payment.promptpay.scanQR')}
              </p>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <CountdownTimer />
          {selectedMethod && (
            <SlipUpload
              onUpload={handleUploadSlip}
              onRemove={handleRemoveSlip}
              uploadedFile={uploadedSlip}
            />
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleConfirmPayment}
          disabled={!selectedMethod || !uploadedSlip || isSubmitting}
          size="lg"
          isLoading={isSubmitting}
        >
          {isSubmitting ? t('booking.payment.processing') : t('booking.payment.confirmPayment')}
        </Button>
      </div>
    </div>
  );
}