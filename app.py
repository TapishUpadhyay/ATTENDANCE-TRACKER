"""
Attendance Tracker for Participants
------------------------------------
A simple Flask + SQLite web application to:
  - Register participants (Name + Participant ID)
  - Mark participants Present/Absent for a session
  - View attendance status of all participants
  - Display total Present/Absent counts

Run with:
    pip install -r requirements.txt
    python app.py

Then open http://127.0.0.1:5000 in your browser.
"""

from flask import Flask, render_template, request, redirect, url_for, flash
import sqlite3
import os

APP_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(APP_DIR, "attendance.db")

app = Flask(__name__)
app.secret_key = "attendance-tracker-secret-key"  # needed for flash messages


def get_db_connection():
    """Create a database connection with rows accessible by column name."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    """Initialize the database schema if it doesn't already exist."""
    conn = get_db_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS participants (
            participant_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Absent'
                CHECK (status IN ('Present', 'Absent')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()
    conn.close()


@app.route("/")
def index():
    """Home page: shows registration form + list of all participants."""
    conn = get_db_connection()
    participants = conn.execute(
        "SELECT * FROM participants ORDER BY created_at ASC"
    ).fetchall()

    present_count = sum(1 for p in participants if p["status"] == "Present")
    absent_count = sum(1 for p in participants if p["status"] == "Absent")
    conn.close()

    return render_template(
        "index.html",
        participants=participants,
        present_count=present_count,
        absent_count=absent_count,
        total_count=len(participants),
    )


@app.route("/add", methods=["POST"])
def add_participant():
    """Register a new participant with Name + Participant ID."""
    participant_id = request.form.get("participant_id", "").strip()
    name = request.form.get("name", "").strip()

    if not participant_id or not name:
        flash("Both Participant ID and Name are required.", "error")
        return redirect(url_for("index"))

    conn = get_db_connection()
    try:
        conn.execute(
            "INSERT INTO participants (participant_id, name, status) VALUES (?, ?, 'Absent')",
            (participant_id, name),
        )
        conn.commit()
        flash(f"Participant '{name}' ({participant_id}) added successfully.", "success")
    except sqlite3.IntegrityError:
        flash(f"A participant with ID '{participant_id}' already exists.", "error")
    finally:
        conn.close()

    return redirect(url_for("index"))


@app.route("/mark/<participant_id>/<status>", methods=["POST"])
def mark_attendance(participant_id, status):
    """Mark a specific participant as Present or Absent."""
    if status not in ("Present", "Absent"):
        flash("Invalid status.", "error")
        return redirect(url_for("index"))

    conn = get_db_connection()
    conn.execute(
        "UPDATE participants SET status = ? WHERE participant_id = ?",
        (status, participant_id),
    )
    conn.commit()
    conn.close()

    return redirect(url_for("index"))


@app.route("/mark_all/<status>", methods=["POST"])
def mark_all(status):
    """Bulk action: mark every participant Present or Absent (new session reset)."""
    if status not in ("Present", "Absent"):
        flash("Invalid status.", "error")
        return redirect(url_for("index"))

    conn = get_db_connection()
    conn.execute("UPDATE participants SET status = ?", (status,))
    conn.commit()
    conn.close()

    flash(f"All participants marked as {status}.", "success")
    return redirect(url_for("index"))


@app.route("/delete/<participant_id>", methods=["POST"])
def delete_participant(participant_id):
    """Remove a participant from the tracker."""
    conn = get_db_connection()
    conn.execute("DELETE FROM participants WHERE participant_id = ?", (participant_id,))
    conn.commit()
    conn.close()

    flash("Participant removed.", "success")
    return redirect(url_for("index"))


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
