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
	<meta name="description" content="Bus Ticket Booking API - bookings, holds, cancellations, feedback, and waitlist." />
	<title>Bus Ticket Booking API</title>
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
			grid-template-columns: 1.15fr 0.85fr;
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
			max-width: 12ch;
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
					<h1>Bus Ticket Booking API</h1>
					<p>Modern seat booking, waitlist, and feedback workflow</p>
				</div>
			</div>
			<div class="status"><span class="pulse"></span> Live on port 3000</div>
		</header>

		<section class="hero">
			<article class="panel hero-copy">
				<div class="glow"></div>
				<div class="eyebrow">Seat booking engine • JSON database • Groq-powered feedback</div>
				<h2>Fast, <span class="accent">clean</span> and professional booking operations.</h2>
				<p>
					A polished backend platform for bus seat holds, bookings, cancellations, feedback analysis,
					and waitlist promotion. Designed to feel like a modern operations console while keeping the
					API simple and file-backed.
				</p>

				<div class="actions">
					<a class="btn primary" href="#endpoints">Explore API</a>
					<a class="btn secondary" href="#overview">View Platform</a>
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

			<aside class="panel rail" id="endpoints">
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
