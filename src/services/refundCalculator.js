function calculateRefundAmount(baseAmount, departureTime) {
  const hoursUntilDeparture = (new Date(departureTime).getTime() - Date.now()) / (1000 * 60 * 60);

  if (hoursUntilDeparture > 24) {
    return baseAmount;
  }

  if (hoursUntilDeparture >= 6) {
    return baseAmount * 0.5;
  }

  return 0;
}

module.exports = {
  calculateRefundAmount,
};