import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DateRangePicker } from './DateRangePicker';
import { PriceBreakdown } from './PriceBreakdown';
import { Button } from '../ui/button';
import { useBookingCalculator } from '../../hooks/useBookingCalculator';
import { formatPrice } from '../../lib/utils';
import type { DateRange } from 'react-day-picker';

const PRICE_PER_NIGHT = 299;

export function BookingCard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [guests, setGuests] = React.useState(2);

  const calculation = useBookingCalculator(dateRange, PRICE_PER_NIGHT);

  const handleReserve = () => {
    if (dateRange?.from && dateRange?.to) {
      navigate('/booking', {
        state: {
          bookingDetails: {
            checkIn: dateRange.from,
            checkOut: dateRange.to,
            guests,
            totalPrice: calculation.total
          }
        }
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(PRICE_PER_NIGHT)}
            </span>
            <span className="text-gray-500 dark:text-gray-400"> / {t('common.perNight')}</span>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center text-sm text-amber-600"
          >
            <Users className="w-4 h-4 mr-1" />
            <span>{guests} {guests === 1 ? t('common.guest') : t('common.guests')}</span>
          </motion.div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('common.selectDates')}
            </label>
            <DateRangePicker
              selectedRange={dateRange}
              onSelect={setDateRange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('booking.guests')}
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? t('common.guest') : t('common.guests')}
                </option>
              ))}
            </select>
          </div>

          {calculation.numberOfNights > 0 && (
            <PriceBreakdown breakdown={calculation} />
          )}

          <Button
            onClick={handleReserve}
            disabled={!dateRange?.from || !dateRange?.to}
            className="w-full"
            size="lg"
          >
            {dateRange?.from && dateRange?.to ? t('common.bookNow') : t('common.selectDates')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}