const path = require('path');
const { v4: uuidv4 } = require('uuid');

const { readJSON, writeJSON } = require('../utils/fileHelper');

const seatsPath = path.join(__dirname, '../data/seats.json');
const waitlistPath = path.join(__dirname, '../data/waitlist.json');

function joinWaitlist({ passengerId, tripId }) {
  const seats = readJSON(seatsPath);
  const waitlist = readJSON(waitlistPath);

  const tripSeats = seats.filter((seat) => seat.tripId === tripId);

  if (tripSeats.length === 0) {
    return {
      statusCode: 404,
      body: { message: 'Trip not found' },
    };
  }

  const hasAvailableSeat = tripSeats.some((seat) => String(seat.status || '').toUpperCase() === 'AVAILABLE');

  if (hasAvailableSeat) {
    return {
      statusCode: 409,
      body: { message: 'Seats are still available' },
    };
  }

  const existingEntry = waitlist.find(
    (item) => item.passengerId === passengerId && item.tripId === tripId
  );

  if (existingEntry) {
    return {
      statusCode: 409,
      body: { message: 'Passenger already in waitlist' },
    };
  }

  const entry = {
    id: uuidv4(),
    passengerId,
    tripId,
    joinedAt: new Date().toISOString(),
  };

  writeJSON(waitlistPath, [...waitlist, entry]);

  return {
    statusCode: 201,
    body: entry,
  };
}

function getFirstWaitlistEntry(tripId) {
  const waitlist = readJSON(waitlistPath);

  return waitlist
    .filter((item) => item.tripId === tripId)
    .sort((a, b) => new Date(a.joinedAt) - new Date(b.joinedAt))[0] || null;
}

function removeWaitlistEntry(entryId) {
  const waitlist = readJSON(waitlistPath);
  writeJSON(waitlistPath, waitlist.filter((item) => item.id !== entryId));
}

module.exports = {
  joinWaitlist,
  getFirstWaitlistEntry,
  removeWaitlistEntry,
};