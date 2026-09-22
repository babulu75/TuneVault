import os
from pathlib import Path
from urllib.parse import quote_plus

from dotenv import load_dotenv

load_dotenv(Path(__file__).with_name(".env"))

# ── Database ──────────────────────────────────────────────────────────────────
DB_USER     = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST     = os.getenv("DB_HOST", "localhost")
DB_PORT     = os.getenv("DB_PORT", "3306")
DB_NAME     = os.getenv("DB_NAME", "tuneVault_db")

if DB_PASSWORD is None:
    raise RuntimeError("DB_PASSWORD environment variable is required")

DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{quote_plus(DB_PASSWORD)}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# ── JWT / Auth ────────────────────────────────────────────────────────────────
SECRET_KEY        = os.getenv("SECRET_KEY", "tunefault-super-secret-key-change-in-prod")
ALGORITHM         = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24 h

# ── App ───────────────────────────────────────────────────────────────────────
APP_NAME    = "TuneFault"
APP_VERSION = "2.0.0"
DEBUG       = os.getenv("DEBUG", "true").lower() == "true"

# ── CORS ─────────────────────────────────────────────────────────────────────
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
