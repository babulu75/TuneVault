# TuneVault

TuneVault is a full-stack music-library application. It lets visitors browse and play uploaded MP3 files, while signed-in users can create playlists and save favorite songs.

## Technology overview

| Technology | Where it is used | Purpose |
| --- | --- | --- |
| React + TypeScript | `frontend/` | Builds the browser interface and keeps UI data typed. |
| Vite | `frontend/` | Runs the local development server and produces a production frontend build. |
| Atomic Design | `frontend/src/_components/` | Organizes reusable UI into `atoms`, `molecules`, `organisms`, and `templates`. |
| React Router | `frontend/src/App.tsx` | Provides pages for Home, Library, Login, Favorites, Playlists, and Now Playing. |
| Axios | `frontend/src/services/` | Sends frontend requests to the FastAPI REST API. |
| FastAPI | `backend/` | Provides REST endpoints for authentication, songs, playlists, and favorites. |
| SQLAlchemy + PyMySQL | `backend/database.py` | Connects FastAPI models and queries to MySQL. |
| MySQL | Database server | Stores users, playlists, favorites, song metadata, and MP3 audio data. |
| JWT + bcrypt | `backend/services/auth_service.py` | Hashes passwords and authenticates API requests with bearer tokens. |
| Selenium + TestNG | `Testing/` | Runs browser-based end-to-end tests with Java and Maven. |

## Project structure

```text
TuneFault/
├── backend/                  # FastAPI API and MySQL models
│   ├── routers/              # API endpoints
│   ├── models/               # SQLAlchemy database models
│   ├── schemas/              # Request/response validation models
│   ├── services/             # Authentication helpers
│   ├── songs/                # Source MP3 files for bulk import
│   └── migrations/           # Manual SQL migrations
├── frontend/                 # React + Vite client
│   └── src/
│       ├── _components/      # Atomic Design UI components
│       │   ├── atoms/
│       │   ├── molecules/
│       │   ├── organisms/
│       │   └── templates/
│       ├── pages/            # Route-level screens
│       ├── services/         # API clients
│       ├── hooks/            # Reusable React logic
│       └── context/          # Authentication and audio-player state
└── Testing/                  # Maven Selenium + TestNG browser tests
    └── src/test/
        ├── java/             # Test classes
        └── resources/        # TestNG suite configuration
```

## Prerequisites

Install or have available:

- Python 3.13 or later
- Node.js and npm
- MySQL 8 or later
- Java 17 or later and Maven
- Google Chrome

## 1. Configure MySQL

Start MySQL and create the database once:

```sql
CREATE DATABASE tuneVault_db;
```

The backend reads `DB_USER`, `DB_HOST`, `DB_PORT`, and `DB_NAME` from the environment, and requires `DB_PASSWORD` to be set there.

Example PowerShell configuration for the current terminal:

```powershell
$env:DB_USER = "root"
$env:DB_PASSWORD = "your-mysql-password"
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:DB_NAME = "tuneVault_db"
```

If the database was created before `duration_seconds` was added to songs, apply this one-time migration:

```powershell
mysql -u root -p tuneVault_db < backend\migrations\001_add_song_duration_seconds.sql
```

## 2. Run the backend

Open a terminal in the project root:

```powershell
cd C:\Users\babul\Desktop\TuneFault\backend
```

Create and activate a virtual environment if one is not already present:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Start FastAPI:

```powershell
.\venv\Scripts\python.exe -m uvicorn main:app --reload
```

The API runs at `http://127.0.0.1:8000`. Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

### Import the supplied songs

The bulk importer reads MP3 files from `backend/songs/`, skips duplicate titles, and stores audio in MySQL:

```powershell
cd C:\Users\babul\Desktop\TuneFault\backend
.\venv\Scripts\python.exe upload_all_songs.py
```

## 3. Run the frontend

In a second terminal:

```powershell
cd C:\Users\babul\Desktop\TuneFault\frontend
npm install
npm run dev
```

Open `http://localhost:5173` in Chrome.

### Build the frontend

```powershell
cd C:\Users\babul\Desktop\TuneFault\frontend
npm run build
```

## 4. Use the application

1. Open **Home** or **Library** to see the available songs.
2. Click a song’s play icon. Playback controls appear in the footer.
3. Click the song area in the footer, or choose **Now Playing** in the sidebar, for the full player screen.
4. Register or sign in to enable Favorites and Playlists.
5. Use the heart icon to add a favorite, or the plus icon to add a song to an existing playlist.

## 5. Run Selenium + TestNG tests

Keep both the backend and frontend running before executing browser tests.

```powershell
cd C:\Users\babul\Desktop\TuneFault\Testing
mvn test
```

The Selenium suite runs Chrome headlessly by default. To watch the tests run in a browser:

```powershell
mvn test -Dheadless=false
```

Test coverage includes:

- Sign-up, logout, and sign-in
- Playing a song and using Previous / Next controls
- Opening the Now Playing screen
- Adding a song to Favorites
- Creating a playlist and adding a song to it

Reports are generated in `Testing/target/surefire-reports/`. The user-flow tests create temporary test accounts and playlist/favorite records in the configured MySQL database.

## Troubleshooting

| Problem | Check |
| --- | --- |
| Songs do not load | Confirm FastAPI is running at port `8000`, MySQL is running, and the `songs` table has the `duration_seconds` column. |
| Sign-up or sign-in fails | Confirm the backend was restarted after installing the current `bcrypt` dependency and verify the MySQL environment variables. |
| Selenium shows `ERR_CONNECTION_REFUSED` | Start the Vite frontend and use `http://localhost:5173`. |
| Selenium cannot create Chrome session | Close stale Chrome/ChromeDriver processes, then retry with `mvn test -Dheadless=false`. |
| Playlist/favorite tests fail with 401 | Confirm FastAPI is running and the frontend points to `http://127.0.0.1:8000`. |
