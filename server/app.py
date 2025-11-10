# import flask and its helpers
from flask import Flask, request, jsonify, abort
from datetime import date
from flask_cors import CORS
import os

from dotenv import load_dotenv
load_dotenv()

# import database objects
from models import Base, engine, SessionLocal, User, Habit, HabitLog

# create Flask app
app = Flask(__name__)

# configure CORS to let React dev server call from different origins
CORS(app, resources={r"/*": {"origins": os.getenv("ALLOWED_ORIGINS", "*").split(",")}})

# make sure tables exist
with engine.begin() as conn:
    Base.metadata.create_all(bind = conn)

# health check to ensure server is up and running
@app.get("/api/health")
def health():
    return {"ok": True}

# helper function for habits-- convert habits to a dictionary of atributes
def habit_to_dict(h: Habit):
    return {
        "id": h.id,
        "user_id": h.user_id,
        "title": h.title,
        "description": h.description,
        "frequency": h.frequency,
        "created_at": h.created_at.isoformat() if getattr(h, "created_at", None) else None,
    }

# helpfer function for habit logs-- convert habit logs to a dictionary
def log_to_dict(l: HabitLog):
    return {
        "id": l.id,
        "habit_id": l.habit_id,
        "date_logged": l.date_logged.isoformat() if l.date_logged else None,
        "status": l.status,
    }

# get function reads habits and returns json of habits
@app.get("/api/habits")
def list_habits():
    # open up DB connection
    with SessionLocal() as db:
        rows = db.query(Habit).order_by(Habit.id.desc()).all()
        return jsonify([habit_to_dict(r) for r in rows])
    
# get function reads habit logs and returns json of habits
@app.get("/api/habit_logs")
def list_logs():
    with SessionLocal() as db:
        rows = db.query(HabitLog).order_by(HabitLog.id.desc()).all()
        return jsonify([log_to_dict(r) for r in rows])

# post function creates new habit row
@app.post("/api/habits")
def create_habit():
    data = request.get_json(force=True) or {}
    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip()
    frequency = (data.get("frequency") or "daily").strip().lower()
    user_id = data.get("user_id")

    if not title:
        abort(400, "title is required")
    if not description:
        abort(400, "description is required")
    if frequency not in ("daily", "weekly", "monthly"):
        abort(400, "frequency must be one of: daily, weekly, monthly")
    if not isinstance(user_id, int):
        abort(400, "user_id (int) is required")

    with SessionLocal() as db:
        # ensure user exists (basic integrity check)
        user = db.get(User, user_id)
        if not user:
            abort(404, f"user {user_id} not found")

        h = Habit(user_id=user_id, title=title, description=description, frequency=frequency)
        db.add(h)
        db.commit()
        db.refresh(h)
        return jsonify(habit_to_dict(h)), 201
    

# post function creates a habit log
@app.post("/api/habit_logs")
def create_log():
    from datetime import date
    data = request.get_json(force=True) or {}
    habit_id = data.get("habit_id")
    status = (data.get("status") or "done").strip().lower()
    # allow client to send ISO date, else default to today
    date_str = data.get("date_logged")
    try:
        date_logged = date.fromisoformat(date_str) if date_str else date.today()
    except Exception:
        abort(400, "date_logged must be ISO format YYYY-MM-DD")

    if not isinstance(habit_id, int):
        abort(400, "habit_id (int) is required")
    if status not in ("done", "skipped"):
        abort(400, "status must be one of: done, skipped")

    with SessionLocal() as db:
        habit = db.get(Habit, habit_id)
        if not habit:
            abort(404, f"habit {habit_id} not found")

        log = HabitLog(habit_id=habit_id, date_logged=date_logged, status=status)
        db.add(log)
        db.commit()
        db.refresh(log)
        return jsonify(log_to_dict(log)), 201
    
# delete function deletes a habit
@app.delete("/api/habits/<int:habit_id>")
def delete_habit(habit_id: int):
    with SessionLocal() as db:
        h = db.get(Habit, habit_id)
        if not h:
            abort(404, "habit not found")
        db.delete(h)
        db.commit()
        return ("", 204)

# delete function deletes a habit log
@app.delete("/api/habit_logs/<int:log_id>")
def delete_habit_log(log_id: int):
    with SessionLocal() as db:
        l = db.get(HabitLog, log_id)
        if not l:
            abort(404, "habit log not found")
        db.delete(l)
        db.commit()
        return ("", 204)

# patch function updates any title, description, or frequency field for habit and modifies
@app.patch("/api/habits/<int:habit_id>")
def update_habit(habit_id: int):
    data = request.get_json(silent=True) or {}
    updates = {}

    if "title" in data:
        t = (data["title"] or "").strip()
        if not t:
            abort(400, "title cannot be empty")
        updates["title"] = t

    if "description" in data:
        updates["description"] = (data["description"] or "").strip()

    if "frequency" in data:
        f = (data["frequency"] or "").strip().lower()
        if f not in ("daily", "weekly", "monthly"):
            abort(400, "frequency must be one of: daily, weekly, monthly")
        updates["frequency"] = f

    if not updates:
        abort(400, "no fields to update")

    with SessionLocal() as db:
        h = db.get(Habit, habit_id)
        if not h:
            abort(404, "habit not found")

        for k, v in updates.items():
            setattr(h, k, v)

        db.commit()
        db.refresh(h)
        return jsonify(habit_to_dict(h))

# allow changing of habit log date and status
@app.patch("/api/habit_logs/<int:log_id>")
def update_habit_log(log_id: int):
    data = request.get_json(silent=True) or {}
    updates = {}

    if "status" in data:
        s = (data["status"] or "").strip().lower()
        if s not in ("done", "skipped"):
            abort(400, "status must be one of: done, skipped")
        updates["status"] = s

    if "date_logged" in data:
        ds = data["date_logged"]
        try:
            updates["date_logged"] = date.fromisoformat(ds) if ds else None
        except Exception:
            abort(400, "date_logged must be ISO format YYYY-MM-DD")

    if not updates:
        abort(400, "no fields to update")

    with SessionLocal() as db:
        l = db.get(HabitLog, log_id)
        if not l:
            abort(404, "habit log not found")

        for k, v in updates.items():
            setattr(l, k, v)

        db.commit()
        db.refresh(l)
        return jsonify(log_to_dict(l))


# run and debug
if __name__ == "__main__":
    app.run(port=8000, debug=True)
