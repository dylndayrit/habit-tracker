from pathlib import Path
from dotenv import load_dotenv
load_dotenv(dotenv_path=Path(__file__).with_name(".env"))

from models import Base, engine, SessionLocal, User, Habit, HabitLog
from datetime import date

# 1) ensure tables exist
with engine.begin() as conn:
    Base.metadata.create_all(bind=conn)

# 2) simple round-trip
with SessionLocal() as db:
    # make sure a user exists
    u = User(username="tester")
    db.add(u); db.commit(); db.refresh(u)

    # insert a habit
    h = Habit(user_id=u.id, title="Read", description="20 pages", frequency="daily")
    db.add(h); db.commit(); db.refresh(h)

    # insert a log
    l = HabitLog(habit_id=h.id, date_logged=date.today(), status="done")
    db.add(l); db.commit(); db.refresh(l)

    # query back
    habits = db.query(Habit).all()
    logs = db.query(HabitLog).all()

print(f"OK: {len(habits)} habit(s), {len(logs)} log(s)")
