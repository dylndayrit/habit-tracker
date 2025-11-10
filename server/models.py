from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from sqlalchemy import create_engine, Column, Integer, String, text, TIMESTAMP, ForeignKey, Enum, Text, func, Date
import os
from dotenv import load_dotenv
load_dotenv()
print(os.getenv("DATABASE_URL"))

# grab database url from .env file
DATABASE_URL = os.getenv('DATABASE_URL')

# initialize engine
engine = create_engine(DATABASE_URL, pool_pre_ping = True, future = True)

# create session factor
SessionLocal = sessionmaker(bind = engine, autoflush=False, autocommit = False, future = True)

# initialize ORM models to inherit from
Base = declarative_base()

# define python class that maps its objects to mysql table
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key = True)
    username = Column(String(24), nullable = False)
    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        nullable=False
    )

    habits = relationship("Habit", back_populates="user")  # if you have Habit

    

# define habit class
class Habit(Base):
    __tablename__ = "habits"
    id = Column(Integer, primary_key = True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    frequency = Column(Enum("daily", "weekly", "monthly"), server_default="daily", nullable=False)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"), nullable=False)

    user  = relationship("User", back_populates="habits")

    logs = relationship(
        "HabitLog",
        back_populates="habit",
        cascade="all, delete-orphan",   # ORM will delete children if you delete parent in session
        passive_deletes=True            # don't try to NULL the FK; let DB handle ON DELETE CASCADE
    )

# define habit log class
class HabitLog(Base):
    __tablename__ = "habit_logs"
    id = Column(Integer, primary_key=True)
    habit_id = Column(Integer, ForeignKey("habits.id"), nullable=False)

    # DATE (no time of day) – perfect for daily check-ins
    date_logged = Column(Date, nullable=False)

    status = Column(Enum("done", "skipped"), server_default="done", nullable=False)

    habit = relationship("Habit", back_populates="logs")