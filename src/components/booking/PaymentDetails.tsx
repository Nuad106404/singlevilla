import React from 'react';
import { format } from 'date-fns';
import { Calendar, Users } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import type { BookingState } from '../../types/booking';

interface PaymentDetailsProps {
  booking: BookingState;
}

export function PaymentDetails({ booking }: PaymentDetailsProps) {
  const { customerInfo, bookingDetails } = booking;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Booking Details
        </h3>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Guest Name</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {customerInfo.firstName} {customerInfo.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Check-in
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {bookingDetails.checkIn && format(bookingDetails.checkIn, 'PPP')}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Check-out
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {bookingDetails.checkOut && format(bookingDetails.checkOut, 'PPP')}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Guests
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {bookingDetails.guests}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</dt>
            <dd className="mt-1 text-lg font-semibold text-amber-600">
              {formatPrice(bookingDetails.totalPrice)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}