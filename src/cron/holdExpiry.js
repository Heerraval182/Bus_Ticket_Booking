const path = require('path');
const cron = require('node-cron');

const { readJSON, writeJSON } = require('../utils/fileHelper');

const seatsPath = path.join(__dirname, '../data/seats.json');
const holdsPath = path.join(__dirname, '../data/holds.json');

cron.schedule('* * * * *', () => {
  const now = Date.now();
  const seats = readJSON(seatsPath);
  const holds = readJSON(holdsPath);

  const expiredHolds = holds.filter((hold) => Date.parse(hold.expiresAt) <= now);

  if (expiredHolds.length === 0) {
    return;
  }

  const expiredHoldKeys = new Set(expiredHolds.map((hold) => `${hold.tripId}:${hold.seatId}`));

  const updatedSeats = seats.map((seat) => {
    const key = `${seat.tripId}:${seat.id}`;

    if (expiredHoldKeys.has(key)) {
      return {
        ...seat,
        status: 'available',
      };
    }

    return seat;
  });

  const activeHolds = holds.filter((hold) => Date.parse(hold.expiresAt) > now);

  writeJSON(seatsPath, updatedSeats);
  writeJSON(holdsPath, activeHolds);
});

module.exports = {};