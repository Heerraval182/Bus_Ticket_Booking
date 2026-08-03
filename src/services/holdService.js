const path = require('path');
const { v4: uuidv4 } = require('uuid');

const { readJSON, writeJSON } = require('../utils/fileHelper');

const seatsPath = path.join(__dirname, '../data/seats.json');
const holdsPath = path.join(__dirname, '../data/holds.json');
const bookingsPath = path.join(__dirname, '../data/bookings.json');

function holdSeat({ passengerId, tripId, seatId }) {
  const now = Date.now();
  const seats = readJSON(seatsPath);
  const holds = readJSON(holdsPath);
  const bookings = readJSON(bookingsPath);

  const seat = seats.find((item) => item.id === seatId && item.tripId === tripId);

  if (!seat) {
    return {
      statusCode: 404,
      body: { message: 'Seat not found' },
    };
  }

  const activeHolds = holds.filter((hold) => Date.parse(hold.expiresAt) > now);
  const activeHold = activeHolds.find((hold) => hold.tripId === tripId && hold.seatId === seatId);

  const isBooked = bookings.some(
    (booking) => booking.tripId === tripId && booking.seatId === seatId && booking.status === 'confirmed'
  );

  const normalizedStatus = String(seat.status || '').toUpperCase();

  if (normalizedStatus === 'BOOKED' || isBooked) {
    return {
      statusCode: 409,
      body: { message: 'Seat is already booked' },
    };
  }

  if (activeHold) {
    return {
      statusCode: 409,
      body: { message: 'Seat is already held' },
    };
  }

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const hold = {
    id: uuidv4(),
    passengerId,
    tripId,
    seatId,
    expiresAt,
  };

  const updatedSeats = seats.map((item) =>
    item.id === seatId && item.tripId === tripId ? { ...item, status: 'HELD' } : item
  );

  const nextHolds = activeHolds.filter((holdItem) => !(holdItem.tripId === tripId && holdItem.seatId === seatId));

  writeJSON(holdsPath, [...nextHolds, hold]);
  writeJSON(seatsPath, updatedSeats);

  return {
    statusCode: 201,
    body: hold,
  };
}

module.exports = {
  holdSeat,
};