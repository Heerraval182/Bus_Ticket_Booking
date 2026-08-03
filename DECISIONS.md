# Decisions

This project uses JSON files as the persistence layer and a small set of business rules to keep booking behavior consistent.

## Seat Hold Expiry

- Hold duration: 5 minutes.
- Enforcement: the system checks hold expiry when bookings are attempted, and a cron job also sweeps expired holds every minute.
- Reasoning: 5 minutes is long enough for payment completion without keeping inventory blocked for too long.

## Refund Windows

- More than 24 hours before departure: 100% refund.
- 6 to 24 hours before departure: 50% refund.
- Less than 6 hours before departure: 0% refund.
- Reasoning: this is a simple and predictable policy that mirrors common travel-platform refund tiers and is easy to explain to users.

## Duplicate Cancellations

- The same booking can only be cancelled once.
- Any later request for the same booking returns a duplicate-cancellation error instead of issuing another refund.
- Reasoning: cancellation must be idempotent and should never refund twice.

## Feedback AI Handling

- Only freeform feedback text is sent to the LLM.
- Phone numbers, email addresses, and payment details are never sent to AI.
- The AI returns sentiment, tags, and urgency.
- Reasoning: this keeps the request minimal and reduces exposure of sensitive user data.

## Urgent Feedback

- Strongly negative or angry feedback is flagged as urgent for priority follow-up.
- Reasoning: this helps support teams focus on high-risk passenger experiences first.

## Waitlist Policy

- If all seats for a trip are booked, passengers can join a waitlist.
- When a booking is cancelled, the first passenger in the waitlist is automatically promoted to a temporary hold.
- Reasoning: this makes seat turnover immediate and reduces manual intervention.

## Passenger Risk Policy

- If a passenger has 3 or more cancellations in the no-refund window, they are marked with `riskFlag: true`.
- Reasoning: the system should flag repeated late cancellations so the business can review or apply stricter handling later.
