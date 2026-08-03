const express = require('express');
const seatRoutes = require('./src/routes/seatRoutes');
const holdRoutes = require('./src/routes/holdRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const cancelRoutes = require('./src/routes/cancelRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const waitlistRoutes = require('./src/routes/waitlistRoutes');
const trips = require('./src/data/trips.json');

const app = express();
const tripsJson = JSON.stringify(trips);
const tripDataScript = '<script id="trip-data" type="application/json">' + tripsJson + '</script>';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.type('html').send(`<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Bus Ticket Booking Dashboard</title>
	<meta name="description" content="Passenger dashboard for selecting trips, viewing seats, placing holds, confirming bookings, cancelling, joining waitlist, and sending feedback." />
	<style>
		:root {
			--bg: #07111f;
			--bg-2: #0d1b2d;
			--panel: rgba(12, 21, 36, 0.82);
			--panel-2: rgba(16, 31, 52, 0.92);
			--line: rgba(160, 190, 255, 0.14);
			--text: #eff6ff;
			--muted: #a9c0df;
			--accent: #78e4a8;
			--accent-2: #6fb7ff;
			--accent-3: #ffb86b;
			--danger: #ff7ca7;
			--shadow: 0 24px 80px rgba(0, 0, 0, 0.42);
		}

		* { box-sizing: border-box; }
		button, input, select, textarea { font: inherit; }

		html, body {
			margin: 0;
			min-height: 100%;
			font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
			background:
				radial-gradient(circle at top left, rgba(111, 183, 255, 0.18), transparent 30%),
				radial-gradient(circle at top right, rgba(120, 228, 168, 0.14), transparent 24%),
				linear-gradient(135deg, var(--bg), var(--bg-2) 72%);
			color: var(--text);
		}

		body { overflow-x: hidden; }

		.noise {
			position: fixed;
			inset: 0;
			pointer-events: none;
			opacity: 0.06;
			background-image:
				linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
				linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px);
			background-size: 28px 28px;
			mask-image: radial-gradient(circle at center, black 34%, transparent 100%);
		}

		.wrap {
			width: min(1220px, calc(100% - 28px));
			margin: 0 auto;
			padding: 24px 0 56px;
			position: relative;
			z-index: 1;
		}

		.topbar {
			display: flex;
			justify-content: space-between;
			gap: 16px;
			align-items: center;
			padding: 16px 18px;
			border: 1px solid var(--line);
			border-radius: 18px;
			background: rgba(8, 16, 28, 0.62);
			backdrop-filter: blur(18px);
			box-shadow: var(--shadow);
		}

		.brand {
			display: flex;
			align-items: center;
			gap: 12px;
		}

		.mark {
			width: 42px;
			height: 42px;
			border-radius: 14px;
			display: grid;
			place-items: center;
			font-size: 20px;
			background: linear-gradient(135deg, rgba(120, 228, 168, 0.24), rgba(111, 183, 255, 0.34));
			border: 1px solid rgba(255,255,255,0.12);
		}

		.brand h1 {
			margin: 0;
			font-size: 1rem;
			text-transform: uppercase;
			letter-spacing: 0.08em;
		}

		.brand p {
			margin: 4px 0 0;
			font-size: 0.92rem;
			color: var(--muted);
		}

		.status {
			display: inline-flex;
			align-items: center;
			gap: 10px;
			padding: 10px 14px;
			border-radius: 999px;
			border: 1px solid rgba(120, 228, 168, 0.22);
			background: rgba(120, 228, 168, 0.08);
			color: #dbffe9;
			white-space: nowrap;
		}

		.pulse {
			width: 10px;
			height: 10px;
			border-radius: 999px;
			background: var(--accent);
			box-shadow: 0 0 0 0 rgba(120, 228, 168, 0.5);
			animation: pulse 1.7s infinite;
		}

		.hero {
			margin-top: 22px;
			padding: 30px;
			border-radius: 28px;
			border: 1px solid var(--line);
			background: linear-gradient(180deg, rgba(15, 27, 46, 0.84), rgba(8, 15, 28, 0.92));
			box-shadow: var(--shadow);
		}

		.hero-grid {
			display: grid;
			grid-template-columns: 1.1fr 0.9fr;
			gap: 22px;
		}

		.hero-copy h2 {
			margin: 12px 0 12px;
			font-size: clamp(2.3rem, 4.8vw, 4.8rem);
			line-height: 0.98;
			letter-spacing: -0.05em;
			max-width: 12ch;
		}

		.hero-copy h2 .accent {
			color: var(--accent);
		}

		.hero-copy p {
			margin: 0;
			max-width: 62ch;
			color: var(--muted);
			line-height: 1.7;
		}

		.badges {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			margin-top: 22px;
		}

		.badge-pill {
			padding: 8px 12px;
			border-radius: 999px;
			background: rgba(255,255,255,0.05);
			border: 1px solid rgba(255,255,255,0.08);
			color: #dfe9f8;
			font-size: 0.86rem;
		}

		.dashboard {
			display: grid;
			grid-template-columns: 0.95fr 1.05fr 1.2fr;
			gap: 18px;
			margin-top: 22px;
		}

		.panel {
			border: 1px solid var(--line);
			border-radius: 24px;
			background: linear-gradient(180deg, rgba(14, 25, 42, 0.86), rgba(8, 15, 28, 0.94));
			box-shadow: var(--shadow);
			padding: 22px;
		}

		.panel h3 {
			margin: 0 0 10px;
			font-size: 1.08rem;
		}

		.section-label {
			margin: 0 0 8px;
			font-size: 0.8rem;
			letter-spacing: 0.16em;
			text-transform: uppercase;
			color: var(--muted);
		}

		.subtle {
			margin: 0;
			color: var(--muted);
			font-size: 0.92rem;
			line-height: 1.6;
		}

		.field {
			display: grid;
			gap: 8px;
			margin-top: 14px;
		}

		.field-grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 12px;
		}

		label {
			font-size: 0.84rem;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--muted);
		}

		input, select, textarea {
			width: 100%;
			padding: 13px 14px;
			border-radius: 14px;
			border: 1px solid rgba(255,255,255,0.1);
			background: rgba(255,255,255,0.05);
			color: var(--text);
			outline: none;
		}

		textarea {
			min-height: 110px;
			resize: vertical;
		}

		button {
			cursor: pointer;
			border: 0;
		}

		button.btn, a.btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: 10px;
			padding: 12px 16px;
			border-radius: 14px;
			text-decoration: none;
			font-weight: 700;
			letter-spacing: 0.01em;
			transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
		}

		button.btn:hover, a.btn:hover { transform: translateY(-1px); }

		.btn.primary {
			background: linear-gradient(135deg, rgba(120, 228, 168, 0.96), rgba(111, 183, 255, 0.94));
			color: #06111c;
		}

		.btn.secondary {
			color: var(--text);
			background: rgba(255,255,255,0.04);
			border: 1px solid rgba(255,255,255,0.08);
		}

		.actions-row {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			margin-top: 14px;
		}

		.trip-picker {
			display: grid;
			gap: 8px;
			margin-top: 14px;
		}

		.trip-picker select {
			min-height: 48px;
		}

		.trip-grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 12px;
			margin-top: 14px;
		}

		.trip-card {
			padding: 16px;
			border-radius: 18px;
			background: rgba(255,255,255,0.04);
			border: 1px solid rgba(255,255,255,0.08);
			color: var(--text);
			text-align: left;
			transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
		}

		.trip-card:hover { transform: translateY(-1px); }
		.trip-card.active { border-color: rgba(120, 228, 168, 0.34); background: rgba(120, 228, 168, 0.08); }

		.trip-card h4 { margin: 0 0 8px; font-size: 1rem; }
		.trip-card p { margin: 0; color: var(--muted); font-size: 0.9rem; line-height: 1.5; }
		.trip-card small { display: block; margin-top: 8px; color: #dfe9f8; }

		.summary {
			margin-top: 14px;
			padding: 14px;
			border-radius: 16px;
			border: 1px solid rgba(255,255,255,0.08);
			background: rgba(0,0,0,0.18);
			white-space: pre-wrap;
			line-height: 1.6;
		}

		.legend {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			margin-top: 12px;
		}

		.legend span {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			padding: 8px 10px;
			border-radius: 999px;
			background: rgba(255,255,255,0.04);
			border: 1px solid rgba(255,255,255,0.08);
			font-size: 0.85rem;
		}

		.legend i {
			width: 10px;
			height: 10px;
			border-radius: 50%;
			display: inline-block;
		}

		.legend .a { background: var(--accent); }
		.legend .h { background: var(--accent-3); }
		.legend .b { background: var(--danger); }

		.seat-summary {
			margin-top: 14px;
			color: var(--muted);
			font-size: 0.92rem;
		}

		.seat-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
			gap: 10px;
			margin-top: 14px;
		}

		.seat {
			padding: 12px 10px;
			border-radius: 16px;
			text-align: center;
			font-weight: 700;
			border: 1px solid rgba(255,255,255,0.08);
			background: rgba(255,255,255,0.04);
			transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
		}

		.seat:hover { transform: translateY(-1px); }
		.seat.available { color: #dbffe9; border-color: rgba(120, 228, 168, 0.18); }
		.seat.held { color: #ffe9ba; border-color: rgba(255, 184, 107, 0.18); }
		.seat.booked { color: #ffbfd0; border-color: rgba(255, 124, 167, 0.22); }

		.form-output {
			margin-top: 12px;
			padding: 12px 14px;
			border-radius: 16px;
			background: rgba(0,0,0,0.18);
			border: 1px solid rgba(255,255,255,0.08);
			white-space: pre-wrap;
			line-height: 1.6;
		}

		.helper {
			color: var(--muted);
			font-size: 0.88rem;
			line-height: 1.5;
		}

		.stack {
			display: grid;
			gap: 16px;
		}

		@keyframes pulse {
			0% { box-shadow: 0 0 0 0 rgba(120, 228, 168, 0.5); }
			70% { box-shadow: 0 0 0 10px rgba(120, 228, 168, 0); }
			100% { box-shadow: 0 0 0 0 rgba(120, 228, 168, 0); }
		}

		@media (max-width: 1100px) {
			.hero-grid, .dashboard { grid-template-columns: 1fr; }
			.trip-grid { grid-template-columns: 1fr; }
		}

		@media (max-width: 700px) {
			.wrap { width: min(100% - 16px, 1220px); }
			.hero, .panel { padding: 18px; }
			.topbar { flex-direction: column; align-items: flex-start; }
			.field-grid { grid-template-columns: 1fr; }
		}
	</style>
</head>
<body>
	<div class="noise"></div>
	<main class="wrap">
		<header class="topbar">
			<div class="brand">
				<div class="mark">🚌</div>
				<div>
					<h1>Bus Ticket Booking</h1>
					<p>Passenger dashboard for routes, seats, booking, waitlist, and feedback</p>
				</div>
			</div>
			<div class="status"><span class="pulse"></span> Live passenger experience</div>
		</header>

		<section class="hero">
			<div class="hero-grid">
				<div class="hero-copy">
					<div class="badge-pill">Passenger booking workflow</div>
					<h2>Select a route, choose a seat, and finish booking <span class="accent">without confusion</span>.</h2>
					<p>
						The dashboard shows available, held, and booked seats; lets passengers place a hold, confirm a booking,
						cancel with the correct refund, and join the waitlist automatically when a trip is full.
					</p>
					<div class="badges">
						<span class="badge-pill">Route selection</span>
						<span class="badge-pill">Seat map</span>
						<span class="badge-pill">Hold / Booking</span>
						<span class="badge-pill">Waitlist fallback</span>
						<span class="badge-pill">AI feedback</span>
					</div>
				</div>

				<div class="panel stack" id="trip-panel">
					<div>
						<p class="section-label">Passenger details</p>
						<h3>Who is booking?</h3>
						<div class="field">
							<label for="passengerId">Passenger ID</label>
							<input id="passengerId" placeholder="11111111-1111-1111-1111-111111111111" />
						</div>
						<div class="actions-row">
							<button class="btn secondary" type="button" id="useSamplePassenger">Use sample passenger</button>
						</div>
					</div>
					<div>
						<p class="section-label">Trip selection</p>
						<h3>Choose a route and departure time</h3>
						<div class="trip-picker">
							<label for="tripSelect">Available trips</label>
							<select id="tripSelect"></select>
						</div>
						<div class="actions-row">
							<button class="btn primary" type="button" id="refreshTrip">Load Seats</button>
						</div>
						<div id="tripSummary" class="summary">Select a trip to view booking options.</div>
						<div id="tripCards" class="trip-grid"></div>
					</div>
				</div>
			</div>
		</section>

		<section class="dashboard">
			<div class="panel stack" id="seat-panel">
				<div>
					<p class="section-label">Seat map</p>
					<h3>See available, held, and booked seats</h3>
					<p class="subtle">Click an available seat to copy it into the hold and booking forms.</p>
				</div>
				<div class="actions-row">
					<button class="btn primary" type="button" id="loadSeats">Load Seats</button>
				</div>
				<div class="legend">
					<span><i class="a"></i> Available</span>
					<span><i class="h"></i> Held</span>
					<span><i class="b"></i> Booked</span>
				</div>
				<div id="seatSummary" class="seat-summary">Loading the first trip seats on page load...</div>
				<div id="seatMap" class="seat-grid"></div>
				<div id="seatOutput" class="form-output">Load seats to start.</div>
			</div>

			<div class="panel stack">
				<div>
					<p class="section-label">Hold and booking</p>
					<h3>Use the passenger and trip context</h3>
					<p class="subtle">The selected trip and passenger are used automatically for hold and booking actions.</p>
				</div>

				<form id="holdForm" class="stack">
					<div class="field">
						<label for="holdSeatId">Seat ID for hold</label>
						<input id="holdSeatId" placeholder="Select an available seat" />
					</div>
					<div class="actions-row">
						<button class="btn primary" type="submit">Place Hold</button>
					</div>
					<div id="holdOutput" class="form-output">Hold a seat while payment is completed.</div>
				</form>

				<form id="bookingForm" class="stack">
					<div class="field">
						<label for="bookingSeatId">Seat ID for booking</label>
						<input id="bookingSeatId" placeholder="Select an available seat" />
					</div>
					<div class="actions-row">
						<button class="btn primary" type="submit">Confirm Booking</button>
					</div>
					<div id="bookingOutput" class="form-output">Convert a valid hold into a booking.</div>
				</form>

				<div class="stack">
					<p class="section-label">Waitlist</p>
					<p class="subtle">If a trip has no seats available, the dashboard will move the passenger to the waitlist automatically.</p>
					<div class="actions-row">
						<button class="btn secondary" type="button" id="joinWaitlist">Join Waitlist Now</button>
					</div>
					<div id="waitlistOutput" class="form-output">No waitlist action yet.</div>
				</div>
			</div>

			<div class="panel stack">
				<div>
					<p class="section-label">Cancel and feedback</p>
					<h3>Cancel bookings and analyze feedback</h3>
					<p class="subtle">Cancellation refund logic is automatic. Feedback is sent to Groq using only the feedback text.</p>
				</div>

				<form id="cancelForm" class="stack">
					<div class="field">
						<label for="cancelBookingId">Booking ID</label>
						<input id="cancelBookingId" placeholder="55555555-5555-5555-5555-555555555555" />
					</div>
					<div class="field">
						<label for="cancelReason">Cancellation reason</label>
						<input id="cancelReason" placeholder="Change of plans" />
					</div>
					<div class="actions-row">
						<button class="btn secondary" type="submit">Cancel Booking</button>
					</div>
					<div id="cancelOutput" class="form-output">Refund calculated from time to departure.</div>
				</form>

				<form id="feedbackForm" class="stack">
					<div class="field">
						<label for="feedbackBookingId">Booking ID</label>
						<input id="feedbackBookingId" placeholder="55555555-5555-5555-5555-555555555555" />
					</div>
					<div class="field">
						<label for="feedbackText">Feedback</label>
						<textarea id="feedbackText" placeholder="The ride was smooth and the driver was helpful."></textarea>
					</div>
					<div class="actions-row">
						<button class="btn primary" type="submit">Submit Feedback</button>
					</div>
					<div id="feedbackOutput" class="form-output">Sentiment, tags, and urgency will be returned here.</div>
				</form>
			</div>
		</section>

		<section class="hero" style="margin-top: 22px;">
			<div class="hero-copy">
				<h2 style="font-size: clamp(1.6rem, 3vw, 2.4rem); max-width: 100%; margin: 0 0 10px; line-height: 1.1;">What the system does</h2>
				<div class="badges">
					<span class="badge-pill">Show seat status</span>
					<span class="badge-pill">Hold seats temporarily</span>
					<span class="badge-pill">Confirm bookings from holds</span>
					<span class="badge-pill">Cancel with correct refund</span>
					<span class="badge-pill">Analyze feedback with AI</span>
				</div>
			</div>
		</section>

		${tripDataScript}
		<script>
			const tripData = JSON.parse(document.getElementById('trip-data').textContent);
			const passengerIdInput = document.getElementById('passengerId');
			const tripSelect = document.getElementById('tripSelect');
			const tripCards = document.getElementById('tripCards');
			const tripSummary = document.getElementById('tripSummary');
			const seatMap = document.getElementById('seatMap');
			const seatSummary = document.getElementById('seatSummary');
			const seatOutput = document.getElementById('seatOutput');
			const holdSeatIdInput = document.getElementById('holdSeatId');
			const bookingSeatIdInput = document.getElementById('bookingSeatId');
			const cancelBookingIdInput = document.getElementById('cancelBookingId');
			const feedbackBookingIdInput = document.getElementById('feedbackBookingId');
			const cancelReasonInput = document.getElementById('cancelReason');
			const feedbackTextInput = document.getElementById('feedbackText');
			const holdOutput = document.getElementById('holdOutput');
			const bookingOutput = document.getElementById('bookingOutput');
			const cancelOutput = document.getElementById('cancelOutput');
			const feedbackOutput = document.getElementById('feedbackOutput');
			const waitlistOutput = document.getElementById('waitlistOutput');
			const loadSeatsButton = document.getElementById('loadSeats');
			const joinWaitlistButton = document.getElementById('joinWaitlist');
			const useSamplePassengerButton = document.getElementById('useSamplePassenger');
			const refreshTripButton = document.getElementById('refreshTrip');
			const holdForm = document.getElementById('holdForm');
			const bookingForm = document.getElementById('bookingForm');
			const cancelForm = document.getElementById('cancelForm');
			const feedbackForm = document.getElementById('feedbackForm');
			const tripAutoWaitlisted = new Set();
			let selectedTripId = tripData.length ? tripData[0].id : '';

			const samplePassengerId = '11111111-1111-1111-1111-111111111111';
			const formatDateTime = (value) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
			const formatDuration = (minutes) => {
				const hours = Math.floor(minutes / 60);
				const remainder = minutes % 60;
				const parts = [];
				if (hours) parts.push(hours + 'h');
				if (remainder) parts.push(remainder + 'm');
				return parts.length ? parts.join(' ') : '0m';
			};
			const routeLabel = (trip) => trip.route + ' • ' + formatDateTime(trip.departureTime) + ' • ' + formatDuration(trip.durationMinutes || 0);
			const setText = (target, value) => { target.textContent = value; };
			const currentPassengerId = () => passengerIdInput.value.trim();
			const currentTrip = () => tripData.find((item) => item.id === selectedTripId);
			const autoWaitlistKey = (tripId) => tripId + '::' + currentPassengerId();

			function syncTripContext(tripId) {
				selectedTripId = tripId;
				tripSelect.value = tripId;
				const trip = currentTrip();
				setText(tripSummary, trip ? 'Route: ' + trip.route + '\nDeparture: ' + formatDateTime(trip.departureTime) + '\nDuration: ' + formatDuration(trip.durationMinutes || 0) + '\nTrip ID: ' + trip.id : 'Select a trip to view booking options.');
				document.querySelectorAll('.trip-card').forEach((card) => {
					card.classList.toggle('active', card.dataset.tripId === tripId);
				});
			}

			function renderTripControls() {
				tripSelect.innerHTML = '';
				tripCards.innerHTML = '';
				tripData.forEach((trip) => {
					const option = document.createElement('option');
					option.value = trip.id;
					option.textContent = routeLabel(trip);
					tripSelect.appendChild(option);

					const card = document.createElement('button');
					card.type = 'button';
					card.className = 'trip-card';
					card.dataset.tripId = trip.id;
					card.innerHTML = '<h4>' + trip.route + '</h4>' +
						'<p>Departure: ' + formatDateTime(trip.departureTime) + '</p>' +
						'<small>Duration: ' + formatDuration(trip.durationMinutes || 0) + '</small>';
					card.addEventListener('click', () => {
						syncTripContext(trip.id);
						loadSeatsForTrip(trip.id);
					});
					tripCards.appendChild(card);
				});
			}

			function renderSeats(seats) {
				seatMap.innerHTML = '';
				if (!seats.length) {
					seatMap.innerHTML = '<div class="summary" style="grid-column:1/-1;">No seats found for this trip.</div>';
					return;
				}

				seats.forEach((seat) => {
					const button = document.createElement('button');
					button.type = 'button';
					button.className = 'seat ' + String(seat.status || '').toLowerCase();
					button.textContent = seat.seatNumber + '\n' + seat.status;
					button.addEventListener('click', () => {
						if (String(seat.status || '').toUpperCase() !== 'AVAILABLE') {
							setText(seatOutput, 'Seat ' + seat.seatNumber + ' is ' + seat.status + '. Select an available seat.');
							return;
						}
						holdSeatIdInput.value = seat.id;
						bookingSeatIdInput.value = seat.id;
						setText(seatOutput, 'Selected seat ' + seat.seatNumber + ' for hold/booking.');
					});
					seatMap.appendChild(button);
				});
			}

			async function autoJoinWaitlist(tripId) {
				const passengerId = currentPassengerId();
				if (!passengerId) {
					setText(waitlistOutput, 'This trip is full. Enter a passenger ID to auto-join the waitlist.');
					return;
				}

				const key = autoWaitlistKey(tripId);
				if (tripAutoWaitlisted.has(key)) {
					return;
				}

				tripAutoWaitlisted.add(key);
				setText(waitlistOutput, 'This trip is full. Joining the waitlist automatically...');

				const response = await fetch('/waitlist', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ passengerId, tripId }),
				});

				const data = await response.json();
				setText(waitlistOutput, JSON.stringify(data, null, 2));
			}

			async function loadSeatsForTrip(tripId) {
				if (!tripId) {
					setText(seatSummary, 'Select a trip first.');
					return;
				}

				setText(seatOutput, 'Loading seats for this trip...');
				const response = await fetch('/trips/' + encodeURIComponent(tripId) + '/seats');
				const seats = await response.json();
				if (!response.ok) {
					throw new Error(seats.message || 'Unable to load seats.');
				}

				renderSeats(seats);
				const counts = seats.reduce((accumulator, seat) => {
					const status = String(seat.status || '').toUpperCase();
					accumulator[status] = (accumulator[status] || 0) + 1;
					return accumulator;
				}, { AVAILABLE: 0, HELD: 0, BOOKED: 0 });

				setText(seatSummary, 'Available: ' + counts.AVAILABLE + ' | Held: ' + counts.HELD + ' | Booked: ' + counts.BOOKED);
				setText(seatOutput, 'Seat map loaded for trip ' + tripId + '. Choose an available seat to continue.');

				if (counts.AVAILABLE === 0) {
					await autoJoinWaitlist(tripId);
					seatMap.scrollIntoView({ behavior: 'smooth', block: 'start' });
				} else {
					tripAutoWaitlisted.delete(autoWaitlistKey(tripId));
				}
			}

			renderTripControls();
			passengerIdInput.value = samplePassengerId;
			cancelBookingIdInput.value = '55555555-5555-5555-5555-555555555555';
			feedbackBookingIdInput.value = '55555555-5555-5555-5555-555555555555';
			syncTripContext(selectedTripId);

			tripSelect.addEventListener('change', async (event) => {
				syncTripContext(event.target.value);
				await loadSeatsForTrip(event.target.value).catch((error) => setText(seatOutput, error.message));
			});

			document.getElementById('useSamplePassenger').addEventListener('click', async () => {
				passengerIdInput.value = samplePassengerId;
				setText(waitlistOutput, 'Sample passenger selected.');
				await loadSeatsForTrip(selectedTripId).catch((error) => setText(seatOutput, error.message));
			});

			document.getElementById('refreshTrip').addEventListener('click', async () => {
				await loadSeatsForTrip(selectedTripId).catch((error) => setText(seatOutput, error.message));
			});

			loadSeatsButton.addEventListener('click', async () => {
				await loadSeatsForTrip(selectedTripId).catch((error) => setText(seatOutput, error.message));
			});

			seatMap.addEventListener('keydown', () => {});

			holdForm.addEventListener('submit', async (event) => {
				event.preventDefault();
				const passengerId = currentPassengerId();
				const seatId = holdSeatIdInput.value.trim();

				if (!passengerId) {
					setText(holdOutput, 'Enter passenger ID first.');
					return;
				}

				if (!selectedTripId) {
					setText(holdOutput, 'Select a trip first.');
					return;
				}

				if (!seatId) {
					setText(holdOutput, 'Choose an available seat first.');
					return;
				}

				const response = await fetch('/seats/hold', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ passengerId, tripId: selectedTripId, seatId }),
				});

				const data = await response.json();
				setText(holdOutput, JSON.stringify(data, null, 2));
				if (response.ok) {
					await loadSeatsForTrip(selectedTripId).catch((error) => setText(seatOutput, error.message));
				}
			});

			bookingForm.addEventListener('submit', async (event) => {
				event.preventDefault();
				const passengerId = currentPassengerId();
				const seatId = bookingSeatIdInput.value.trim();

				if (!passengerId) {
					setText(bookingOutput, 'Enter passenger ID first.');
					return;
				}

				if (!selectedTripId) {
					setText(bookingOutput, 'Select a trip first.');
					return;
				}

				if (!seatId) {
					setText(bookingOutput, 'Choose an available seat first.');
					return;
				}

				const response = await fetch('/bookings', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ passengerId, tripId: selectedTripId, seatId }),
				});

				const data = await response.json();
				setText(bookingOutput, JSON.stringify(data, null, 2));
				if (response.ok) {
					await loadSeatsForTrip(selectedTripId).catch((error) => setText(seatOutput, error.message));
				}
			});

			joinWaitlistButton.addEventListener('click', async () => {
				const passengerId = currentPassengerId();
				if (!passengerId) {
					setText(waitlistOutput, 'Enter passenger ID first.');
					return;
				}

				if (!selectedTripId) {
					setText(waitlistOutput, 'Select a trip first.');
					return;
				}

				const response = await fetch('/waitlist', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ passengerId, tripId: selectedTripId }),
				});
				const data = await response.json();
				setText(waitlistOutput, JSON.stringify(data, null, 2));
			});

			cancelForm.addEventListener('submit', async (event) => {
				event.preventDefault();
				const bookingId = cancelBookingIdInput.value.trim();
				if (!bookingId) {
					setText(cancelOutput, 'Enter booking ID first.');
					return;
				}

				const response = await fetch('/bookings/' + encodeURIComponent(bookingId) + '/cancel', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ reason: cancelReasonInput.value.trim() }),
				});

				const data = await response.json();
				setText(cancelOutput, JSON.stringify(data, null, 2));
				if (response.ok) {
					await loadSeatsForTrip(selectedTripId).catch((error) => setText(seatOutput, error.message));
				}
			});

			feedbackForm.addEventListener('submit', async (event) => {
				event.preventDefault();
				const bookingId = feedbackBookingIdInput.value.trim();
				if (!bookingId) {
					setText(feedbackOutput, 'Enter booking ID first.');
					return;
				}

				const response = await fetch('/bookings/' + encodeURIComponent(bookingId) + '/feedback', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ feedback: feedbackTextInput.value.trim() }),
				});

				const data = await response.json();
				setText(feedbackOutput, JSON.stringify(data, null, 2));
			});

			renderTripControls();
			syncTripContext(selectedTripId);
			loadSeatsForTrip(selectedTripId).catch((error) => setText(seatOutput, error.message));
		</script>
</body>
</html>`);
});

app.use(seatRoutes);
app.use(holdRoutes);
app.use(bookingRoutes);
app.use(cancelRoutes);
app.use(feedbackRoutes);
app.use(waitlistRoutes);

module.exports = app;