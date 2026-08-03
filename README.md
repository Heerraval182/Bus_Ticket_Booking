# Bus Ticket Booking

Minimal Node.js and Express.js backend for bus seat booking, holds, cancellations, feedback, and Groq-based feedback analysis using JSON files as the database.

See [DECISIONS.md](DECISIONS.md) for the hold, refund, AI, waitlist, and risk-policy choices used in the system.

## What Your System Should Do

When a passenger interacts with a trip, the system should:

- Show which seats are available, on hold, or already booked.
- Let a passenger place a short hold on selected seats while they complete payment.
- Confirm a booking once payment is done, converting a valid hold into a booking.
- Cancel a booking and work out the correct refund based on how close to departure the request comes in.
- Read a passenger's post-trip feedback, understand its sentiment, and flag the ones that need urgent follow-up.

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create your environment file from the example and add your Groq key:

```bash
cp .env.example .env
```

## Run Commands

Start the server:

```bash
npm start
```

The application runs on the port defined in `PORT` and defaults to `3000`.

## Groq Setup

Set the following environment variable in `.env`:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

The feedback flow sends only the feedback text to Groq and expects a response that can be normalized into:

- `sentiment`
- `tags`
- `urgent`

## API Endpoints

### Seats

- `GET /trips/:tripId/seats`  
  Returns seat numbers and status for a trip.

### Holds

- `POST /seats/hold`  
  Creates a 5-minute hold for an available seat.

### Bookings

- `POST /bookings`  
  Converts a valid hold into a booking.

- `POST /bookings/:id/cancel`  
  Cancels a booking, releases the seat, and stores the cancellation.

### Feedback

- `POST /bookings/:id/feedback`  
  Stores booking feedback and Groq analysis.

## JSON Database Structure

All data is stored in `src/data` as JSON arrays.

### `passengers.json`

```json
[
  {
    "id": "string",
    "name": "string",
    "phone": "string",
    "riskFlag": true
  }
]
```

### `trips.json`

```json
[
  {
    "id": "string",
    "route": "string",
    "departureTime": "ISO-8601 string"
  }
]
```

### `seats.json`

```json
[
  {
    "id": "string",
    "tripId": "string",
    "seatNumber": "string",
    "status": "available | HELD | BOOKED"
  }
]
```

### `holds.json`

```json
[
  {
    "id": "string",
    "passengerId": "string",
    "tripId": "string",
    "seatId": "string",
    "expiresAt": "ISO-8601 string"
  }
]
```

### `bookings.json`

```json
[
  {
    "id": "string",
    "passengerId": "string",
    "tripId": "string",
    "seatId": "string",
    "status": "confirmed | cancelled"
  }
]
```

### `cancellations.json`

```json
[
  {
    "id": "string",
    "bookingId": "string",
    "passengerId": "string",
    "tripId": "string",
    "seatId": "string",
    "refundAmount": 0,
    "reason": "string",
    "cancelledAt": "ISO-8601 string"
  }
]
```

### `feedback.json`

```json
[
  {
    "feedback": "string",
    "sentiment": "string",
    "tags": [],
    "urgent": false
  }
]
```

## Notes

- The app uses JSON files only for persistence.
- Seat holds expire after 5 minutes.
- Feedback analysis is handled through Groq.