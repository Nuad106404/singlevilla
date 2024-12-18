import Booking from '../models/Booking.js';
import { AppError } from '../middleware/errorHandler.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('booking-controller');

// Create a new booking
export const createBooking = async (req, res, next) => {
  try {
    const {
      checkIn,
      checkOut,
      guests,
      totalPrice,
      paymentMethod,
      specialRequests
    } = req.body;

    // Check availability
    const isAvailable = await Booking.checkAvailability(checkIn, checkOut);
    if (!isAvailable) {
      throw new AppError('Selected dates are not available', 400);
    }

    const booking = await Booking.create({
      user: req.user._id,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      paymentMethod,
      specialRequests
    });

    logger.info(`New booking created with ID: ${booking._id}`);

    res.status(201).json({
      status: 'success',
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// Get all bookings for a user
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: { bookings }
    });
  } catch (error) {
    next(error);
  }
};

// Get a single booking
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw new AppError('No booking found with that ID', 404);
    }

    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user._id.toString()) {
      throw new AppError('You do not have permission to view this booking', 403);
    }

    res.status(200).json({
      status: 'success',
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// Update a booking
export const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw new AppError('No booking found with that ID', 404);
    }

    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user._id.toString()) {
      throw new AppError('You do not have permission to update this booking', 403);
    }

    // Only allow updates to certain fields
    const allowedUpdates = ['specialRequests'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      throw new AppError('Invalid updates!', 400);
    }

    updates.forEach(update => booking[update] = req.body[update]);
    await booking.save();

    logger.info(`Booking ${booking._id} updated`);

    res.status(200).json({
      status: 'success',
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// Cancel a booking
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw new AppError('No booking found with that ID', 404);
    }

    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user._id.toString()) {
      throw new AppError('You do not have permission to cancel this booking', 403);
    }

    await booking.cancel();

    logger.info(`Booking ${booking._id} cancelled`);

    res.status(200).json({
      status: 'success',
      data: { 
        booking,
        refundAmount: booking.calculateRefundAmount()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Upload payment slip
export const uploadPaymentSlip = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw new AppError('No booking found with that ID', 404);
    }

    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user._id.toString()) {
      throw new AppError('You do not have permission to update this booking', 403);
    }

    // Validate that file was uploaded
    if (!req.file) {
      throw new AppError('Please upload a payment slip', 400);
    }

    // Update booking with slip URL
    booking.slipUrl = req.file.location; // Assuming using S3 or similar storage
    booking.paymentStatus = 'pending'; // Set to pending for admin review
    await booking.save();

    logger.info(`Payment slip uploaded for booking ${booking._id}`);

    res.status(200).json({
      status: 'success',
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};
