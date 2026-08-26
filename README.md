# Attendance Tracker

A simple, fully client-side Attendance Tracker for event/club participants.

## Features
- Add/register participants with Name + Participant ID (duplicate ID prevention).
- Mark each participant Present / Absent for a session (click again to unmark).
- Search participants by name/ID and filter by status (All / Present / Absent / Not Marked).
- Live summary cards: Total, Present, Absent, Not Marked counts.
- "Reset All to Absent" and "Clear All Data" bulk actions.
- Remove individual participants.
- Data persists in the browser via `localStorage` — no backend/database required.

## Tech Stack
- **HTML5** — structure (`index.html`)
- **CSS3** — styling, responsive grid/flex layout (`style.css`)
- **Vanilla JavaScript (ES6)** — all logic: state management, rendering, event handling, localStorage persistence (`script.js`)

No frameworks, build tools, or servers needed.

## How it works
1. Participants are stored as an array of objects `{ id, name, participantId, status }` in `localStorage` under the key `attendance_tracker_participants`.
2. Adding a participant validates required fields and checks for duplicate Participant IDs.
3. Marking Present/Absent updates the `status` field and immediately re-renders the table + summary counts.
4. All state changes are persisted to `localStorage` so data survives page refreshes.

## Run locally
Just open `index.html` in any browser — no build step required.

## Deploy to Vercel
This is a static site, so it deploys with zero configuration:
1. Push this folder to a GitHub repo (or drag-and-drop the folder into the Vercel dashboard).
2. In Vercel, import the project — Framework Preset: **Other** (static).
3. Deploy. `index.html` will be served at the root.
