const path = require('path');

const { readJSON, writeJSON } = require('../utils/fileHelper');
const { analyzeFeedback } = require('../ai/groqService');

const bookingsPath = path.join(__dirname, '../data/bookings.json');
const feedbackPath = path.join(__dirname, '../data/feedback.json');

async function createFeedback(bookingId, feedbackText) {
  const bookings = readJSON(bookingsPath);
  const feedbackEntries = readJSON(feedbackPath);

  const booking = bookings.find((item) => item.id === bookingId && item.status === 'confirmed');

  if (!booking) {
    return {
      statusCode: 404,
      body: { message: 'Booking not found' },
    };
  }

  const analysis = await analyzeFeedback(feedbackText);

  const feedbackEntry = {
    feedback: feedbackText,
    sentiment: analysis.sentiment,
    tags: analysis.tags,
    urgent: analysis.urgent,
  };

  writeJSON(feedbackPath, [...feedbackEntries, feedbackEntry]);

  return {
    statusCode: 201,
    body: feedbackEntry,
  };
}

module.exports = {
  createFeedback,
};