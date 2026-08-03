const express = require('express');
const seatRoutes = require('./src/routes/seatRoutes');
const holdRoutes = require('./src/routes/holdRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const cancelRoutes = require('./src/routes/cancelRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const waitlistRoutes = require('./src/routes/waitlistRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.type('html').send(`<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content="Passenger dashboard for booking seats, holding seats, cancelling bookings, submitting feedback, and joining the waitlist." />
	<title>Bus Ticket Booking Dashboard</title>
	<style>
		:root {
			--bg: #07111f;
			--bg-2: #0d1b2d;
			--card: rgba(11, 20, 34, 0.74);
			--card-strong: rgba(14, 28, 48, 0.92);
			--line: rgba(160, 190, 255, 0.16);
			--text: #eff6ff;
			--muted: #aac0de;
			--accent: #73e2a7;
			--accent-2: #6fb7ff;
			--accent-3: #ffb86b;
			--shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
		}

		* { box-sizing: border-box; }
		button, input, select, textarea { font: inherit; }

		html, body {
			margin: 0;
			min-height: 100%;
			font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
			background:
				radial-gradient(circle at top left, rgba(111, 183, 255, 0.18), transparent 28%),
				radial-gradient(circle at top right, rgba(115, 226, 167, 0.14), transparent 24%),
				linear-gradient(135deg, var(--bg), var(--bg-2) 72%);
			color: var(--text);
		}

		body {
			overflow-x: hidden;
		}

		.noise {
			position: fixed;
			inset: 0;
			pointer-events: none;
			opacity: 0.07;
			background-image:
				linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
				linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px);
			background-size: 28px 28px;
			mask-image: radial-gradient(circle at center, black 34%, transparent 100%);
		}

		.wrap {
			width: min(1180px, calc(100% - 32px));
			margin: 0 auto;
			padding: 28px 0 56px;
			position: relative;
			z-index: 1;
		}

		.topbar {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 16px;
			padding: 14px 18px;
			border: 1px solid var(--line);
			border-radius: 18px;
			background: rgba(9, 16, 28, 0.56);
			backdrop-filter: blur(18px);
			box-shadow: var(--shadow);
		}

		.brand {
			display: flex;
			align-items: center;
			gap: 12px;
			min-width: 0;
		}

		.mark {
			width: 42px;
			height: 42px;
			border-radius: 14px;
			display: grid;
			place-items: center;
			background: linear-gradient(135deg, rgba(115,226,167,0.22), rgba(111,183,255,0.32));
			border: 1px solid rgba(255,255,255,0.12);
			box-shadow: inset 0 1px 0 rgba(255,255,255,0.16);
			font-size: 20px;
		}

		.brand h1 {
			margin: 0;
			font-size: 1rem;
			letter-spacing: 0.04em;
			text-transform: uppercase;
		}

		.brand p {
			margin: 4px 0 0;
			color: var(--muted);
			font-size: 0.92rem;
		}

		.status {
			display: inline-flex;
			align-items: center;
			gap: 10px;
			padding: 10px 14px;
			border-radius: 999px;
			border: 1px solid rgba(115, 226, 167, 0.24);
			background: rgba(115, 226, 167, 0.08);
			color: #d7ffe8;
			font-size: 0.92rem;
			white-space: nowrap;
		}

		.pulse {
			width: 10px;
			height: 10px;
			border-radius: 999px;
			background: var(--accent);
			box-shadow: 0 0 0 0 rgba(115, 226, 167, 0.55);
			animation: pulse 1.7s infinite;
		}

		.hero {
			display: grid;
			grid-template-columns: 1fr;
			gap: 22px;
			margin-top: 22px;
		}

		.panel {
			border: 1px solid var(--line);
			border-radius: 28px;
			background: linear-gradient(180deg, rgba(13, 24, 41, 0.78), rgba(8, 15, 28, 0.88));
			backdrop-filter: blur(18px);
			box-shadow: var(--shadow);
			overflow: hidden;
		}

		.hero-copy {
			padding: 34px;
			position: relative;
			min-height: 100%;
		}

		.dashboard-grid {
			display: grid;
			grid-template-columns: 1.1fr 0.9fr;
			gap: 22px;
			margin-top: 22px;
		}

		.eyebrow {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			padding: 8px 12px;
			border-radius: 999px;
			background: rgba(111, 183, 255, 0.10);
			border: 1px solid rgba(111, 183, 255, 0.18);
			color: #d7e9ff;
			font-size: 0.84rem;
			text-transform: uppercase;
			letter-spacing: 0.12em;
		}

		.hero h2 {
			margin: 18px 0 14px;
			font-size: clamp(2.4rem, 4.6vw, 4.8rem);
			line-height: 0.98;
			letter-spacing: -0.05em;
			max-width: 15ch;
		}

		.hero h2 .accent {
			color: var(--accent);
		}

		.hero p {
			margin: 0;
			max-width: 62ch;
			color: var(--muted);
			font-size: 1.02rem;
			line-height: 1.7;
		}

		.actions {
			display: flex;
			flex-wrap: wrap;
			gap: 12px;
			margin-top: 26px;
		}

		.btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: 10px;
			padding: 13px 18px;
			border-radius: 14px;
			text-decoration: none;
			font-weight: 700;
			letter-spacing: 0.01em;
			border: 1px solid transparent;
			transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
		}

		.btn:hover {
			transform: translateY(-2px);
		}

		.btn.primary {
			background: linear-gradient(135deg, rgba(115,226,167,0.96), rgba(111,183,255,0.94));
			color: #06111c;
			box-shadow: 0 14px 34px rgba(111, 183, 255, 0.18);
		}

		.btn.secondary {
			color: var(--text);
			background: rgba(255,255,255,0.04);
			border-color: rgba(255,255,255,0.10);
		}

		.meta-grid {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 12px;
			margin-top: 26px;
		}

		.mini-card {
			padding: 16px;
			border-radius: 18px;
			background: rgba(255,255,255,0.04);
			border: 1px solid rgba(255,255,255,0.08);
		}

		.mini-card strong {
			display: block;
			font-size: 1.2rem;
			margin-bottom: 6px;
		}

		.mini-card span {
			color: var(--muted);
			font-size: 0.92rem;
		}

		.rail {
			padding: 26px;
			display: grid;
			gap: 16px;
		}

		.section-title {
			margin: 0 0 8px;
			font-size: 0.82rem;
			text-transform: uppercase;
			letter-spacing: 0.16em;
			color: var(--muted);
		}

		.endpoint {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 16px;
			padding: 15px 16px;
			border-radius: 18px;
			background: rgba(255,255,255,0.04);
			border: 1px solid rgba(255,255,255,0.08);
		}

		.endpoint code {
			font-size: 0.92rem;
			color: #e5f1ff;
		}

		.badge {
			padding: 7px 10px;
			border-radius: 999px;
			font-size: 0.76rem;
			text-transform: uppercase;
			letter-spacing: 0.12em;
			background: rgba(111, 183, 255, 0.12);
			color: #cfe3ff;
			border: 1px solid rgba(111, 183, 255, 0.18);
			white-space: nowrap;
		}

		form {
			display: grid;
			gap: 12px;
		}

		.field-grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 12px;
		}

		.field {
			display: grid;
			gap: 8px;
		}

		label {
			font-size: 0.85rem;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--muted);
		}

		input,
		select,
		textarea {
			width: 100%;
			padding: 13px 14px;
			border-radius: 14px;
			border: 1px solid rgba(255,255,255,0.10);
			background: rgba(255,255,255,0.05);
			color: var(--text);
			outline: none;
		}

		input::placeholder,
		textarea::placeholder {
			color: rgba(170,192,222,0.55);
		}

		textarea {
			min-height: 110px;
			resize: vertical;
		}

		.btn-row {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
		}

		button {
			cursor: pointer;
		}

		button.btn {
			border: 0;
		}

		.output {
			margin-top: 12px;
			padding: 14px;
			border-radius: 16px;
			border: 1px solid rgba(255,255,255,0.08);
			background: rgba(0,0,0,0.18);
			color: #dff3ff;
			font-size: 0.92rem;
			line-height: 1.65;
			white-space: pre-wrap;
		}

		.seats {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(78px, 1fr));
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
			cursor: pointer;
			transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
		}

		.seat:hover {
			transform: translateY(-1px);
		}

		.seat.available { color: #dbffe9; border-color: rgba(115,226,167,0.18); }
		.seat.held { color: #ffe9ba; border-color: rgba(255,184,107,0.18); }
		.seat.booked { color: #ffb8c8; border-color: rgba(255,120,160,0.20); }

		.legend {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			margin-top: 10px;
		}

		.legend span {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			padding: 8px 11px;
			border-radius: 999px;
			background: rgba(255,255,255,0.04);
			border: 1px solid rgba(255,255,255,0.08);
			font-size: 0.86rem;
		}

		.legend i {
			width: 10px;
			height: 10px;
			border-radius: 999px;
			display: inline-block;
		}

		.legend .a { background: var(--accent); }
		.legend .h { background: var(--accent-3); }
		.legend .b { background: #ff7ca7; }

		.panel h3 {
			margin: 0 0 14px;
			font-size: 1.15rem;
		}

		.subtle {
			color: var(--muted);
			font-size: 0.92rem;
			line-height: 1.6;
		}

		.info-grid {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			gap: 16px;
			margin-top: 22px;
		}

		.info-card {
			padding: 18px;
			border-radius: 22px;
			background: rgba(255,255,255,0.04);
			border: 1px solid rgba(255,255,255,0.08);
			min-height: 140px;
		}

		.info-card .icon {
			width: 44px;
			height: 44px;
			border-radius: 14px;
			display: grid;
			place-items: center;
			margin-bottom: 14px;
			background: rgba(115,226,167,0.12);
			border: 1px solid rgba(115,226,167,0.18);
			font-size: 1.1rem;
		}

		.info-card h3 {
			margin: 0 0 8px;
			font-size: 1rem;
		}

		.info-card p {
			margin: 0;
			font-size: 0.93rem;
			line-height: 1.65;
			color: var(--muted);
		}

		.footer {
			margin-top: 22px;
			text-align: center;
			color: rgba(170, 192, 222, 0.75);
			font-size: 0.9rem;
		}

		.glow {
			position: absolute;
			inset: auto auto -40px -40px;
			width: 240px;
			height: 240px;
			border-radius: 50%;
			background: radial-gradient(circle, rgba(115,226,167,0.18), transparent 65%);
			filter: blur(10px);
			pointer-events: none;
		}

		@keyframes pulse {
			0% { box-shadow: 0 0 0 0 rgba(115, 226, 167, 0.5); }
			70% { box-shadow: 0 0 0 10px rgba(115, 226, 167, 0); }
			100% { box-shadow: 0 0 0 0 rgba(115, 226, 167, 0); }
		}

		@media (max-width: 980px) {
			.hero,
			.info-grid,
			.meta-grid {
				grid-template-columns: 1fr;
			}

			.topbar {
				flex-direction: column;
				align-items: flex-start;
			}

			.endpoint {
				flex-direction: column;
				align-items: flex-start;
			}
		}

		@media (max-width: 640px) {
			.wrap {
				width: min(100% - 18px, 1180px);
				padding-top: 10px;
			}

			.hero-copy,
			.rail {
				padding: 22px;
			}

			.hero h2 {
				max-width: 100%;
			}

			.field-grid,
			.dashboard-grid {
				grid-template-columns: 1fr;
			}
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
					<h1>Bus Ticket Booking Dashboard</h1>
					<p>Search, hold, book, cancel, and submit feedback in one place</p>
				</div>
			</div>
			<div class="status"><span class="pulse"></span> Passenger UI live on port 3000</div>
		</header>

		<section class="hero">
			<article class="panel hero-copy">
				<div class="glow"></div>
				<div class="eyebrow">Passenger dashboard • JSON database • Groq-powered feedback</div>
				<h2>Book seats, manage trips, and keep everything <span class="accent">in sync</span>.</h2>
				<p>
					A polished passenger workspace for viewing seat maps, placing holds, confirming bookings,
					cancelling trips, joining the waitlist, and sending feedback that is analyzed by AI.
				</p>

				<div class="actions">
					<a class="btn primary" href="#dashboard">Open Dashboard</a>
					<a class="btn secondary" href="#endpoints">See APIs</a>
				</div>

				<div class="meta-grid">
					<div class="mini-card">
						<strong>5 min</strong>
						<span>Temporary seat holds</span>
					</div>
					<div class="mini-card">
						<strong>Waitlist</strong>
						<span>Promotes the next passenger automatically</span>
					</div>
					<div class="mini-card">
						<strong>Groq</strong>
						<span>Feedback sentiment, tags and urgency</span>
					</div>
				</div>
			</article>

			<div class="dashboard-grid" id="dashboard">
				<aside class="panel rail">
					<div>
						<p class="section-title">Trip Search</p>
						<h3>View the seat map</h3>
						<p class="subtle">Enter a trip ID to fetch availability. Available seats are shown in green, held in amber, and booked in red.</p>
						<form id="seatForm">
							<div class="field">
								<label for="tripId">Trip ID</label>
								<input id="tripId" name="tripId" placeholder="22222222-2222-2222-2222-222222222222" required />
							</div>
							<div class="btn-row">
								<button class="btn primary" type="submit">Load Seats</button>
								<button class="btn secondary" type="button" id="loadSample">Use Sample Trip</button>
							</div>
						</form>
						<div class="legend">
							<span><i class="a"></i> Available</span>
							<span><i class="h"></i> Held</span>
							<span><i class="b"></i> Booked</span>
						</div>
						<div id="seatMap" class="seats"></div>
						<div id="seatOutput" class="output">Load a trip to see the seat map.</div>
					</div>
				</aside>

				<aside class="panel rail" id="endpoints">
					<div>
						<p class="section-title">Passenger Actions</p>
						<h3>Hold, book, cancel, feedback, waitlist</h3>
						<p class="subtle">Use these forms to interact with the API without leaving the dashboard.</p>
					</div>

					<form id="holdForm">
						<div class="field-grid">
							<div class="field">
								<label for="holdPassengerId">Passenger ID</label>
								<input id="holdPassengerId" placeholder="11111111-1111-1111-1111-111111111111" required />
							</div>
							<div class="field">
								<label for="holdTripId">Trip ID</label>
								<input id="holdTripId" placeholder="22222222-2222-2222-2222-222222222222" required />
							</div>
						</div>
						<div class="field">
							<label for="holdSeatId">Seat ID</label>
							<input id="holdSeatId" placeholder="33333333-3333-3333-3333-333333333333" required />
						</div>
						<div class="btn-row"><button class="btn primary" type="submit">Place Hold</button></div>
						<div id="holdOutput" class="output">Hold a seat while payment is completed.</div>
					</form>

					<form id="bookingForm">
						<div class="field-grid">
							<div class="field">
								<label for="bookingPassengerId">Passenger ID</label>
								<input id="bookingPassengerId" placeholder="11111111-1111-1111-1111-111111111111" required />
							</div>
							<div class="field">
								<label for="bookingTripId">Trip ID</label>
								<input id="bookingTripId" placeholder="22222222-2222-2222-2222-222222222222" required />
							</div>
						</div>
						<div class="field">
							<label for="bookingSeatId">Seat ID</label>
							<input id="bookingSeatId" placeholder="33333333-3333-3333-3333-333333333333" required />
						</div>
						<div class="btn-row"><button class="btn primary" type="submit">Confirm Booking</button></div>
						<div id="bookingOutput" class="output">Convert a valid hold into a booking.</div>
					</form>

					<form id="cancelForm">
						<div class="field">
							<label for="cancelBookingId">Booking ID</label>
							<input id="cancelBookingId" placeholder="55555555-5555-5555-5555-555555555555" required />
						</div>
						<div class="field">
							<label for="cancelReason">Reason</label>
							<input id="cancelReason" placeholder="Change of plans" />
						</div>
						<div class="btn-row"><button class="btn secondary" type="submit">Cancel Booking</button></div>
						<div id="cancelOutput" class="output">Refunds are calculated using the configured time-window policy.</div>
					</form>

					<form id="feedbackForm">
						<div class="field">
							<label for="feedbackBookingId">Booking ID</label>
							<input id="feedbackBookingId" placeholder="55555555-5555-5555-5555-555555555555" required />
						</div>
						<div class="field">
							<label for="feedbackText">Feedback</label>
							<textarea id="feedbackText" placeholder="The ride was smooth and the driver was helpful." required></textarea>
						</div>
						<div class="btn-row"><button class="btn primary" type="submit">Submit Feedback</button></div>
						<div id="feedbackOutput" class="output">Only the feedback text is sent to the AI analysis service.</div>
					</form>

					<form id="waitlistForm">
						<div class="field-grid">
							<div class="field">
								<label for="waitPassengerId">Passenger ID</label>
								<input id="waitPassengerId" placeholder="11111111-1111-1111-1111-111111111111" required />
							</div>
							<div class="field">
								<label for="waitTripId">Trip ID</label>
								<input id="waitTripId" placeholder="22222222-2222-2222-2222-222222222222" required />
							</div>
						</div>
						<div class="btn-row"><button class="btn secondary" type="submit">Join Waitlist</button></div>
						<div id="waitlistOutput" class="output">Join the waitlist when all seats are booked.</div>
					</form>
				</aside>
			</div>
				<div>
					<p class="section-title">API Endpoints</p>
					<div class="endpoint"><code>GET /trips/:tripId/seats</code><span class="badge">Seats</span></div>
				</div>
				<div class="endpoint"><code>POST /seats/hold</code><span class="badge">Hold</span></div>
				<div class="endpoint"><code>POST /bookings</code><span class="badge">Booking</span></div>
				<div class="endpoint"><code>POST /bookings/:id/cancel</code><span class="badge">Cancel</span></div>
				<div class="endpoint"><code>POST /bookings/:id/feedback</code><span class="badge">Feedback</span></div>
				<div class="endpoint"><code>POST /waitlist</code><span class="badge">Waitlist</span></div>
			</aside>
		</section>

		<section class="info-grid" id="overview">
			<article class="info-card">
				<div class="icon">⌁</div>
				<h3>Unique visual direction</h3>
				<p>Deep blue glass panels, soft gradients, and crisp typography create a distinctive but professional interface.</p>
			</article>
			<article class="info-card">
				<div class="icon">⚡</div>
				<h3>Fast system overview</h3>
				<p>Operators can see the core API flows and understand booking lifecycle behavior at a glance.</p>
			</article>
			<article class="info-card">
				<div class="icon">🛡</div>
				<h3>Reliable by design</h3>
				<p>Built around the existing JSON-backed services, holds, cancellations, and waitlist promotion logic.</p>
			</article>
			<article class="info-card">
				<div class="icon">✦</div>
				<h3>Responsive layout</h3>
				<p>The homepage adapts cleanly across desktop and mobile so it feels polished in the browser.</p>
			</article>
		</section>

		<div class="footer">Bus Ticket Booking API • Professional UI landing page</div>
	</main>
	<script>
		const sampleTripId = '22222222-2222-2222-2222-222222222222';
		const samplePassengerId = '11111111-1111-1111-1111-111111111111';
		const sampleSeatId = '33333333-3333-3333-3333-333333333333';
		const sampleBookingId = '55555555-5555-5555-5555-555555555555';

		const seatForm = document.getElementById('seatForm');
		const holdForm = document.getElementById('holdForm');
		const bookingForm = document.getElementById('bookingForm');
		const cancelForm = document.getElementById('cancelForm');
		const feedbackForm = document.getElementById('feedbackForm');
		const waitlistForm = document.getElementById('waitlistForm');
		const seatMap = document.getElementById('seatMap');

		const setText = (id, value) => { document.getElementById(id).textContent = value; };
		const pretty = (value) => JSON.stringify(value, null, 2);

		function renderSeats(seats) {
			seatMap.innerHTML = '';
			if (!seats.length) {
				seatMap.innerHTML = '<div class="output" style="grid-column:1/-1">No seats found for this trip.</div>';
				return;
			}

			seats.forEach((seat) => {
				const seatEl = document.createElement('button');
				seatEl.type = 'button';
				seatEl.className = 'seat ' + String(seat.status || '').toLowerCase();
				seatEl.textContent = seat.seatNumber + '\n' + seat.status;
				seatEl.addEventListener('click', () => {
					document.getElementById('holdSeatId').value = seat.id || '';
					document.getElementById('bookingSeatId').value = seat.id || '';
					document.getElementById('holdTripId').value = document.getElementById('tripId').value;
					document.getElementById('bookingTripId').value = document.getElementById('tripId').value;
					setText('seatOutput', 'Selected seat ' + seat.seatNumber + ' (' + seat.status + ')');
				});
				seatMap.appendChild(seatEl);
			});
		}

		async function fetchSeats(tripId) {
			setText('seatOutput', 'Loading seat map...');
			const response = await fetch('/trips/' + encodeURIComponent(tripId) + '/seats');
			const data = await response.json();
			if (!response.ok) throw new Error(data.message || 'Unable to load seats');
			renderSeats(data);
			setText('seatOutput', pretty(data));
		}

		seatForm.addEventListener('submit', async (event) => {
			event.preventDefault();
			try {
				await fetchSeats(document.getElementById('tripId').value.trim());
			} catch (error) {
				setText('seatOutput', error.message);
			}
		});

		document.getElementById('loadSample').addEventListener('click', async () => {
			document.getElementById('tripId').value = sampleTripId;
			document.getElementById('holdTripId').value = sampleTripId;
			document.getElementById('bookingTripId').value = sampleTripId;
			document.getElementById('waitTripId').value = sampleTripId;
			try {
				await fetchSeats(sampleTripId);
			} catch (error) {
				setText('seatOutput', error.message);
			}
		});

		document.getElementById('holdPassengerId').value = samplePassengerId;
		document.getElementById('bookingPassengerId').value = samplePassengerId;
		document.getElementById('waitPassengerId').value = samplePassengerId;
		document.getElementById('cancelBookingId').value = sampleBookingId;
		document.getElementById('feedbackBookingId').value = sampleBookingId;

		holdForm.addEventListener('submit', async (event) => {
			event.preventDefault();
			const payload = {
				passengerId: document.getElementById('holdPassengerId').value.trim(),
				tripId: document.getElementById('holdTripId').value.trim(),
				seatId: document.getElementById('holdSeatId').value.trim(),
			};
			const response = await fetch('/seats/hold', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			const data = await response.json();
			setText('holdOutput', pretty(data));
		});

		bookingForm.addEventListener('submit', async (event) => {
			event.preventDefault();
			const payload = {
				passengerId: document.getElementById('bookingPassengerId').value.trim(),
				tripId: document.getElementById('bookingTripId').value.trim(),
				seatId: document.getElementById('bookingSeatId').value.trim(),
			};
			const response = await fetch('/bookings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			const data = await response.json();
			setText('bookingOutput', pretty(data));
		});

		cancelForm.addEventListener('submit', async (event) => {
			event.preventDefault();
			const response = await fetch('/bookings/' + encodeURIComponent(document.getElementById('cancelBookingId').value.trim()) + '/cancel', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ reason: document.getElementById('cancelReason').value.trim() }),
			});
			const data = await response.json();
			setText('cancelOutput', pretty(data));
		});

		feedbackForm.addEventListener('submit', async (event) => {
			event.preventDefault();
			const response = await fetch('/bookings/' + encodeURIComponent(document.getElementById('feedbackBookingId').value.trim()) + '/feedback', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ feedback: document.getElementById('feedbackText').value.trim() }),
			});
			const data = await response.json();
			setText('feedbackOutput', pretty(data));
		});

		waitlistForm.addEventListener('submit', async (event) => {
			event.preventDefault();
			const response = await fetch('/waitlist', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					passengerId: document.getElementById('waitPassengerId').value.trim(),
					tripId: document.getElementById('waitTripId').value.trim(),
				}),
			});
			const data = await response.json();
			setText('waitlistOutput', pretty(data));
		});
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
