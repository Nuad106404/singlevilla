import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user']
  },
  checkIn: {
    type: Date,
    required: [true, 'Booking must have a check-in date']
  },
  checkOut: {
    type: Date,
    required: [true, 'Booking must have a check-out date']
  },
  guests: {
    type: Number,
    required: [true, 'Booking must have number of guests'],
    min: [1, 'Number of guests must be at least 1'],
    max: [8, 'Number of guests cannot exceed 8']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Booking must have a total price']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'cancelled'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: {
      values: ['bank_transfer', 'promptpay'],
      message: '{VALUE} is not a valid payment method'
    },
    required: [true, 'Booking must have a payment method']
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'completed', 'failed'],
      message: '{VALUE} is not a valid payment status'
    },
    default: 'pending'
  },
  paymentSlipUrl: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty value
        return /^https:\/\//.test(v);
      },
      message: 'Payment slip URL must be a secure URL'
    }
  },
  specialRequests: {
    type: String,
    maxLength: [500, 'Special requests cannot exceed 500 characters']
  },
  cancellationReason: {
    type: String,
    maxLength: [500, 'Cancellation reason cannot exceed 500 characters']
  },
  cancelledAt: {
    type: Date
  },
  refundAmount: {
    type: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ status: 1 });

// Static method to check availability
bookingSchema.statics.checkAvailability = async function(checkIn, checkOut) {
  const overlappingBookings = await this.find({
    status: { $ne: 'cancelled' },
    $or: [
      {
        checkIn: { $lte: checkOut },
        checkOut: { $gte: checkIn }
      }
    ]
  });

  return overlappingBookings.length === 0;
};

// Instance method to calculate refund amount
bookingSchema.methods.calculateRefundAmount = function() {
  if (this.status !== 'cancelled') return 0;

  const now = new Date();
  const checkIn = new Date(this.checkIn);
  const daysUntilCheckIn = Math.ceil((checkIn - now) / (1000 * 60 * 60 * 24));

  // Refund policy:
  // - Cancel more than 7 days before check-in: 100% refund
  // - Cancel 3-7 days before check-in: 50% refund
  // - Cancel less than 3 days before check-in: no refund
  if (daysUntilCheckIn > 7) {
    return this.totalPrice;
  } else if (daysUntilCheckIn >= 3) {
    return this.totalPrice * 0.5;
  }
  return 0;
};

// Instance method to cancel booking
bookingSchema.methods.cancel = async function(reason = '') {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  this.refundAmount = this.calculateRefundAmount();
};

// Pre-save middleware to validate dates
bookingSchema.pre('save', function(next) {
  if (this.checkOut <= this.checkIn) {
    next(new Error('Check-out date must be after check-in date'));
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);
