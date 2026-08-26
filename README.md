# Attendance Tracker for Participants

A simple web-based attendance tracker built with **Python (Flask)** and **SQLite**.

## Features
- Register participants with a unique **Participant ID** and **Name**
- Mark each participant **Present** or **Absent** for a session
- "Mark All Present" / "Mark All Absent" bulk actions to reset for a new session
- View a live table of every participant's current attendance status
- Dashboard showing **Total**, **Present**, and **Absent** counts
- Remove participants no longer needed

## Technologies Used
- **Python 3** with **Flask** (lightweight web framework) for routing and server logic
- **SQLite** (via Python's built-in `sqlite3` module) for persistent storage — no separate database server needed
- **Jinja2** templates (bundled with Flask) for rendering HTML
- **HTML/CSS** for the front end (no JavaScript frameworks required, keeps it simple and dependency-free)

## Project Structure
```
attendance-tracker/
├── app.py                 # Flask application (routes + database logic)
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html         # Main UI template
├── static/
│   └── style.css          # Styling
└── README.md
```

## How to Run
1. Make sure Python 3.8+ is installed.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the app:
   ```bash
   python app.py
   ```
4. Open your browser to `http://127.0.0.1:5000`

The SQLite database file (`attendance.db`) is created automatically on first run.

## Approach
The app follows a simple **MVC-like** pattern:
- **Model**: a single `participants` table in SQLite with columns `participant_id` (primary key), `name`, and `status` (`Present`/`Absent`).
- **View**: one Jinja2 template (`index.html`) renders the registration form, bulk-action buttons, and a live table with per-row Present/Absent/Delete controls, plus summary cards for total/present/absent counts.
- **Controller**: Flask routes handle adding participants, marking individual/bulk attendance, and deletion, each redirecting back to the main page so the table always reflects the current database state.

Data persists across restarts since it's stored in a local SQLite file, and duplicate Participant IDs are rejected using the database's primary-key constraint.
