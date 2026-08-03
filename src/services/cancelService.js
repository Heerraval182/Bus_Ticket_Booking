const path = require('path');
const { v4: uuidv4 } = require('uuid');

const { readJSON, writeJSON } = require('../utils/fileHelper');
const { calculateRefundAmount } = require('./refundCalculator');

const bookingsPath = path.join(__dirname, '../data/bookings.json');
const cancellationsPath = path.join(__dirname, '../data/cancellations.json');
const seatsPath = path.join(__dirname, '../data/seats.json');
const tripsPath = path.join(__dirname, '../data/trips.json');
const passengersPath = path.join(__dirname, '../data/passengers.json');

function isNoRefundWindow(cancellation, trip) {
  if (!cancellation.cancelledAt || !trip || !trip.departureTime) {
    return false;
  }

  const hoursUntilDeparture = (new Date(trip.departureTime).getTime() - new Date(cancellation.cancelledAt).getTime()) / (1000 * 60 * 60);

  return hoursUntilDeparture < 6;
}

function updatePassengerRiskFlag(passengerId) {
  const cancellations = readJSON(cancellationsPath);
  const bookings = readJSON(bookingsPath);
  const trips = readJSON(tripsPath);
  const passengers = readJSON(passengersPath);

  const noRefundCancellations = cancellations.filter((cancellation) => {
    const relatedBooking = bookings.find((booking) => booking.id === cancellation.bookingId);
    const trip = trips.find((item) => item.id === (cancellation.tripId || (relatedBooking && relatedBooking.tripId)));
    const resolvedPassengerId = cancellation.passengerId || (relatedBooking && relatedBooking.passengerId);

    if (resolvedPassengerId !== passengerId) {
      return false;
    }

    return isNoRefundWindow(cancellation, trip);
  });

  const updatedPassengers = passengers.map((passenger) =>
    passenger.id === passengerId
      ? {
          ...passenger,
          ...(noRefundCancellations.length >= 3 ? { riskFlag: true } : {}),
        }
      : passenger
  );

  writeJSON(passengersPath, updatedPassengers);
}

function cancelBooking(bookingId, reason) {
  const bookings = readJSON(bookingsPath);
  const cancellations = readJSON(cancellationsPath);
  const seats = readJSON(seatsPath);
  const trips = readJSON(tripsPath);

  const existingCancellation = cancellations.find((item) => item.bookingId === bookingId);

  if (existingCancellation) {
    return {
      statusCode: 409,
      body: { message: 'Booking already cancelled' },
    };
  }

  const booking = bookings.find((item) => item.id === bookingId && item.status === 'confirmed');

  if (!booking) {
    return {
      statusCode: 404,
      body: { message: 'Booking not found' },
    };
  }

  const trip = trips.find((item) => item.id === booking.tripId);

  if (!trip) {
    return {
      statusCode: 404,
      body: { message: 'Trip not found' },
    };
  }

  const refundAmount = calculateRefundAmount(100, trip.departureTime);

  const cancellation = {
    id: uuidv4(),
    bookingId,
    passengerId: booking.passengerId,
    tripId: booking.tripId,
    seatId: booking.seatId,
    refundAmount,
    reason: reason || '',
    cancelledAt: new Date().toISOString(),
  };

  const updatedBookings = bookings.map((item) =>
    item.id === bookingId ? { ...item, status: 'cancelled' } : item
  );

  const updatedSeats = seats.map((item) =>
    item.id === booking.seatId && item.tripId === booking.tripId ? { ...item, status: 'available' } : item
  );

  writeJSON(bookingsPath, updatedBookings);
  writeJSON(seatsPath, updatedSeats);
  writeJSON(cancellationsPath, [...cancellations, cancellation]);
  updatePassengerRiskFlag(booking.passengerId);

  return {
    statusCode: 201,
    body: cancellation,
  };
}

module.exports = {
  cancelBooking,
};