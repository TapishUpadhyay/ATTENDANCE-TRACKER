Attendance Tracker

A simple, fully client-side Attendance Tracker for event/club participants.

Features
- Add/register participants with Name + Participant ID (duplicate ID prevention).
- Mark each participant Present / Absent for a session (click again to unmark).
- Search participants by name/ID and filter by status (All / Present / Absent / Not Marked).
- Live summary cards: Total, Present, Absent, Not Marked counts.
- "Reset All to Absent" and "Clear All Data" bulk actions.
- Remove individual participants.

Used
-HTML
-CSS
-JS

How it works
1. Participants are stored as an array of objects `{ id, name, participantId, status }` in `localStorage` under the key `attendance_tracker_participants`.
2. Adding a participant validates required fields and checks for duplicate Participant IDs.
3. Marking Present/Absent updates the `status` field and immediately re-renders the table + summary counts.


ALTERNATIVE URL:-https://tapish.online/attendance-tracker
