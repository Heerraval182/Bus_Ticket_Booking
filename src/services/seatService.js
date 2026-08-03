const path = require('path');

const { readJSON } = require('../utils/fileHelper');

const seatsPath = path.join(__dirname, '../data/seats.json');
const holdsPath = path.join(__dirname, '../data/holds.json');
const bookingsPath = path.join(__dirname, '../data/bookings.json');

function getSeatsByTripId(tripId) {
  const seats = readJSON(seatsPath);
  const holds = readJSON(holdsPath);
  const bookings = readJSON(bookingsPath);

  return seats
    .filter((seat) => seat.tripId === tripId)
    .map((seat) => {
      const isBooked = bookings.some(
        (booking) => booking.tripId === tripId && booking.seatId === seat.id && booking.status === 'confirmed'
      );

      const isHeld = holds.some((hold) => hold.tripId === tripId && hold.seatId === seat.id);

      return {
        seatNumber: seat.seatNumber,
        status: isBooked ? 'BOOKED' : isHeld ? 'HELD' : 'AVAILABLE',
      };
    });
}

module.exports = {
  getSeatsByTripId,
};