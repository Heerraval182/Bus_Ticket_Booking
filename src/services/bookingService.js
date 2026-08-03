const path = require('path');
const { v4: uuidv4 } = require('uuid');

const { readJSON, writeJSON } = require('../utils/fileHelper');

const seatsPath = path.join(__dirname, '../data/seats.json');
const holdsPath = path.join(__dirname, '../data/holds.json');
const bookingsPath = path.join(__dirname, '../data/bookings.json');

function createBooking({ passengerId, tripId, seatId }) {
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

  const hold = holds.find(
    (item) => item.passengerId === passengerId && item.tripId === tripId && item.seatId === seatId
  );

  if (!hold) {
    return {
      statusCode: 404,
      body: { message: 'Hold not found' },
    };
  }

  if (Date.parse(hold.expiresAt) <= now) {
    const nextHolds = holds.filter((item) => item.id !== hold.id);
    const releasedSeats = seats.map((item) =>
      item.id === seatId && item.tripId === tripId ? { ...item, status: 'available' } : item
    );

    writeJSON(holdsPath, nextHolds);
    writeJSON(seatsPath, releasedSeats);

    return {
      statusCode: 410,
      body: { message: 'Hold expired' },
    };
  }

  const existingBooking = bookings.find(
    (item) => item.passengerId === passengerId && item.tripId === tripId && item.seatId === seatId
  );

  if (existingBooking) {
    return {
      statusCode: 409,
      body: { message: 'Booking already exists' },
    };
  }

  const booking = {
    id: uuidv4(),
    passengerId,
    tripId,
    seatId,
    status: 'confirmed',
  };

  const updatedSeats = seats.map((item) =>
    item.id === seatId && item.tripId === tripId ? { ...item, status: 'BOOKED' } : item
  );

  const updatedHolds = holds.filter((item) => item.id !== hold.id);

  writeJSON(bookingsPath, [...bookings, booking]);
  writeJSON(seatsPath, updatedSeats);
  writeJSON(holdsPath, updatedHolds);

  return {
    statusCode: 201,
    body: booking,
  };
}

module.exports = {
  createBooking,
};