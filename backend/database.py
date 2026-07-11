from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Always resolve DB path relative to THIS file's directory
# so it works regardless of which directory uvicorn is launched from
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))

_raw_url = os.getenv("DATABASE_URL", "sqlite:///./nutrition.db")

# Convert relative sqlite path → absolute path anchored to backend folder
if _raw_url.startswith("sqlite:///./") or _raw_url == "sqlite:///./nutrition.db":
    _db_filename = _raw_url.replace("sqlite:///./", "").replace("sqlite:///", "")
    _abs_db_path = os.path.join(_THIS_DIR, _db_filename)
    DATABASE_URL = f"sqlite:///{_abs_db_path}"
    print(f"[DB] Using database: {_abs_db_path}")
else:
    DATABASE_URL = _raw_url
    _abs_db_path = DATABASE_URL.replace("sqlite:///", "")

# Ensure parent directory exists (for Docker volumes)
_db_dir = os.path.dirname(_abs_db_path) if "sqlite" in DATABASE_URL else None
if _db_dir and not os.path.exists(_db_dir):
    os.makedirs(_db_dir, exist_ok=True)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
