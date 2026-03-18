# SoulTalk - Mental Health Platform

SoulTalk is a full-stack mental health and wellness platform that connects clients with verified mental health professionals. It provides AI-powered emotional support, real-time video/audio/chat sessions, appointment scheduling, mood tracking, and secure payment processing.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Run Both Servers](#4-run-both-servers)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Users & Profiles](#users--profiles)
  - [AI Chat](#ai-chat)
  - [Appointments](#appointments)
  - [Connections & Messaging](#connections--messaging)
  - [Live Sessions](#live-sessions)
  - [Payments & Withdrawals](#payments--withdrawals)
  - [Mood Tracking](#mood-tracking)
  - [Journal Entries](#journal-entries)
  - [Service Marketplace](#service-marketplace)
  - [Notifications](#notifications)
  - [Public Stats](#public-stats)
- [Data Models](#data-models)
- [Testing](#testing)
- [Deployment](#deployment)
- [CI/CD](#cicd)
- [License](#license)

---

## Features

### For Clients
- **AI Companion** -- Chat with SoulTalk AI (powered by Google Gemini) for instant emotional support, scoped strictly to mental health topics.
- **Find Professionals** -- Browse and connect with verified mental health professionals.
- **Live Sessions** -- Start video, audio, or text-based therapy sessions in real time via ZegoCloud.
- **Appointment Booking** -- Schedule sessions with professionals; automatic cancellation of past or duplicate bookings.
- **Mood Tracking** -- Log daily mood scores (1--5) with optional notes and view mood history over time.
- **Service Marketplace** -- Post service requests describing your needs; receive proposals from professionals.
- **Payments** -- Pay for services securely via Chapa (Ethiopian Birr).
- **Crisis Support** -- Access dedicated crisis support resources.
- **Dark Mode** -- Toggle between light and dark themes.
- **Internationalization** -- Multi-language support via i18next.

### For Professionals
- **Verification Workflow** -- Submit ID documents and certificates during registration; admin reviews and approves.
- **Client Management** -- View connected clients and appointment history.
- **Journal Entries** -- Create text, audio, or video journal entries about client sessions.
- **Opportunity Board** -- Browse open service requests from clients and submit proposals.
- **Earnings & Withdrawals** -- Track earnings and request bank withdrawals via Chapa.
- **Online Status** -- Toggle availability so clients can see who is available.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| Tailwind CSS + DaisyUI | Styling |
| React Router v7 | Client-side routing |
| Framer Motion | Animations |
| i18next | Internationalization |
| ZegoCloud UIKit | Real-time video/audio calls |
| Lucide React / React Icons | Iconography |
| React Markdown | Rendering AI responses |

### Backend
| Technology | Purpose |
|---|---|
| Django 6.0 | Web framework |
| Django REST Framework | REST API |
| SimpleJWT | Token-based authentication |
| Google Gemini API | AI chat capabilities |
| Chapa API | Payment processing (ETB) |
| Supabase (S3-compatible) | Cloud file storage |
| PostgreSQL | Primary database |
| WhiteNoise | Static file serving |
| Gunicorn | Production WSGI server |

---

## Project Structure

```
Soultalk/
├── backend/                    # Django backend
│   ├── accounts/               # Main Django app
│   │   ├── models.py           # Data models (User, Profiles, Appointments, etc.)
│   │   ├── views.py            # API views
│   │   ├── serializers.py      # DRF serializers
│   │   ├── urls.py             # API URL routing
│   │   └── migrations/         # Database migrations
│   ├── soultalk_backend/       # Django project settings
│   │   ├── settings.py         # Configuration (DB, auth, storage, etc.)
│   │   ├── urls.py             # Root URL configuration
│   │   ├── wsgi.py             # WSGI entry point
│   │   └── asgi.py             # ASGI entry point
│   ├── build.sh                # Backend build script
│   ├── requirements.txt        # Python dependencies
│   ├── runtime.txt             # Python runtime version (3.12)
│   └── manage.py               # Django management CLI
├── src/                        # React frontend source
│   ├── App.tsx                 # Root component with route definitions
│   ├── main.tsx                # Application entry point
│   ├── config.ts               # API base URL configuration
│   ├── contexts/               # React context providers
│   │   ├── AuthContext.tsx      # Authentication state and API helpers
│   │   ├── ThemeContext.tsx     # Light/dark theme management
│   │   └── SearchContext.tsx    # Global search state
│   ├── components/             # Reusable UI components
│   │   ├── AICompanion.tsx     # AI chat widget
│   │   ├── MoodTracker.tsx     # Mood logging component
│   │   ├── MobileNav.tsx       # Mobile navigation
│   │   └── WarningModal.tsx    # Warning dialog
│   ├── pages/                  # Page-level components (46 pages)
│   ├── data/                   # Static data (country list, etc.)
│   ├── utils/                  # Utility functions
│   └── assets/                 # Images and videos
├── test/                       # Test suites
│   ├── setup.ts                # Test environment setup
│   ├── frontend.test.tsx       # Frontend component tests
│   ├── backend.test.ts         # Backend API tests
│   └── integration_api.test.tsx# Integration tests
├── .github/workflows/ci.yml   # GitHub Actions CI pipeline
├── index.html                  # HTML entry point
├── package.json                # Node.js dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
├── eslint.config.js            # ESLint configuration
├── vercel.json                 # Vercel deployment config (SPA rewrites)
└── start.sh                    # Script to start both servers locally
```

---

## Prerequisites

- **Node.js** >= 20
- **Python** >= 3.12
- **PostgreSQL** (or use SQLite for local development)
- **pip** and **npm**

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Yoseph-M/Soultalk.git
cd Soultalk
```

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Create a .env file (see Environment Variables section below)
cp .env.example .env        # or create manually

# Run database migrations
python3 manage.py migrate

# Collect static files
python3 manage.py collectstatic --noinput

# Start the backend server
python3 manage.py runserver
```

The backend will be available at `http://127.0.0.1:8000`.

### 3. Frontend Setup

```bash
# From the project root
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### 4. Run Both Servers

A convenience script is provided to start both servers simultaneously:

```bash
chmod +x start.sh
./start.sh
```

This will:
1. Check the database connection.
2. Run any pending migrations.
3. Start the Django backend on port 8000.
4. Start the Vite dev server on port 5173.

Press `Ctrl+C` to stop both servers.

---

## Environment Variables

Create a `.env` file in the `backend/` directory (or project root) with the following variables:

### Required

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (e.g., `postgresql://user:pass@localhost:5432/soultalk_db`) |
| `DJANGO_SECRET_KEY` | Django secret key for cryptographic signing |
| `GEMINI_API_KEY` | Google Gemini API key for the AI chat feature |

### Optional

| Variable | Default | Description |
|---|---|---|
| `DJANGO_DEBUG` | `True` | Enable/disable Django debug mode |
| `ALLOWED_HOSTS` | `""` | Comma-separated list of allowed hostnames |
| `FRONTEND_URL` | `http://localhost:5173` | Frontend URL (used for payment return URLs) |
| `CHAPA_SECRET_KEY` | -- | Chapa payment gateway secret key |
| `ZEGO_APP_ID` | -- | ZegoCloud App ID for video/audio calls |
| `ZEGO_SERVER_SECRET` | -- | ZegoCloud server secret |

### Cloud Storage (Supabase S3)

| Variable | Description |
|---|---|
| `USE_S3` | Set to `True` to enable cloud storage (default: `True`) |
| `AWS_ACCESS_KEY_ID` | Supabase S3 access key |
| `AWS_SECRET_ACCESS_KEY` | Supabase S3 secret key |
| `AWS_STORAGE_BUCKET_NAME` | Storage bucket name (default: `profiles`) |
| `AWS_S3_ENDPOINT_URL` | Supabase S3 endpoint URL |
| `AWS_S3_REGION_NAME` | S3 region (default: `us-west-2`) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |

### Frontend Environment Variables

Set these in a `.env` file at the project root for the Vite frontend:

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL (overrides auto-detection) |

> When running locally, the frontend automatically detects `localhost` and points to `http://localhost:8000`.

---

## API Reference

All API endpoints are prefixed with `/api/auth/`. Authentication uses JWT Bearer tokens unless noted otherwise.

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Register a new user (supports multipart form data for file uploads) | No |
| `POST` | `/api/auth/login/` | Obtain JWT access and refresh tokens | No |
| `POST` | `/api/auth/token/refresh/` | Refresh an expired access token | No |

### Users & Profiles

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/auth/me/` | Get the authenticated user's profile | Yes |
| `PUT/PATCH` | `/api/auth/me/` | Update the authenticated user's profile | Yes |
| `GET` | `/api/auth/professionals/` | List professionals (clients see verified only) | Yes |
| `GET` | `/api/auth/clients/` | List clients (professionals see connected clients only) | Yes |
| `GET` | `/api/auth/users/detail/<id>/` | Get public details of a specific user | Yes |

### AI Chat

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/ai-chat/` | Send a message to SoulTalk AI | Yes |
| `GET` | `/api/auth/chat-sessions/` | List the user's chat sessions | Yes |
| `GET` | `/api/auth/chat-sessions/<id>/` | Get a session with its message history | Yes |
| `PUT/DELETE` | `/api/auth/chat-sessions/<id>/` | Update or delete a chat session | Yes |

**AI Chat request body:**
```json
{
  "message": "I'm feeling anxious today",
  "session_id": 1
}
```
Omit `session_id` to create a new session automatically.

### Appointments

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/auth/appointments/` | List the user's appointments | Yes |
| `POST` | `/api/auth/appointments/` | Create a new appointment | Yes |
| `GET` | `/api/auth/appointments/<id>/` | Get appointment details | Yes |
| `PUT/PATCH` | `/api/auth/appointments/<id>/` | Update an appointment (e.g., change status) | Yes |
| `DELETE` | `/api/auth/appointments/<id>/` | Cancel an appointment | Yes |

### Connections & Messaging

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/auth/connections/` | List the user's connections | Yes |
| `POST` | `/api/auth/connections/` | Send a connection request | Yes |
| `GET/PUT/DELETE` | `/api/auth/connections/<id>/` | Manage a specific connection | Yes |
| `GET` | `/api/auth/messages/?user_id=<id>` | Get direct messages with a user | Yes |
| `POST` | `/api/auth/messages/` | Send a direct message | Yes |

### Live Sessions

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/live/initiate/` | Initiate a live session request (sends notification to professional) | Yes |
| `POST` | `/api/auth/professional/status/` | Update online/offline status (professionals only) | Yes |

### Payments & Withdrawals

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/payment/initialize/` | Initialize a Chapa payment | Yes |
| `GET` | `/api/auth/payment/verify/<tx_ref>/` | Verify a payment by transaction reference | Yes |
| `POST` | `/api/auth/payment/callback/<tx_ref>/` | Chapa payment webhook callback | No |
| `GET` | `/api/auth/payment/history/` | List the user's payment history | Yes |
| `GET` | `/api/auth/payout/earnings/` | Get professional earnings summary | Yes |
| `GET` | `/api/auth/payout/banks/` | List supported Ethiopian banks | Yes |
| `POST` | `/api/auth/payout/withdraw/` | Request a withdrawal to a bank account | Yes |

### Mood Tracking

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/auth/mood-updates/` | List the user's mood entries | Yes |
| `POST` | `/api/auth/mood-updates/` | Log a new mood entry | Yes |

**Mood entry request body:**
```json
{
  "mood_score": 4,
  "note": "Had a good therapy session today"
}
```

### Journal Entries

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/auth/journal-entries/` | List journal entries (professionals see own; clients see entries about them) | Yes |
| `POST` | `/api/auth/journal-entries/` | Create a journal entry (professionals only) | Yes |
| `GET/PUT/DELETE` | `/api/auth/journal-entries/<id>/` | Manage a specific journal entry | Yes |

### Service Marketplace

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/auth/service-requests/` | List service requests (clients see own; professionals see all open) | Yes |
| `POST` | `/api/auth/service-requests/` | Create a service request (clients only) | Yes |
| `GET/PUT/DELETE` | `/api/auth/service-requests/<id>/` | Manage a specific request | Yes |
| `GET` | `/api/auth/service-proposals/` | List proposals | Yes |
| `POST` | `/api/auth/service-proposals/` | Submit a proposal (professionals only) | Yes |
| `POST` | `/api/auth/service-proposals/<id>/action/` | Accept or reject a proposal (clients only) | Yes |

### Notifications

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/auth/notifications/` | List the user's notifications | Yes |
| `POST` | `/api/auth/notifications/<id>/read/` | Mark a notification as read | Yes |

### Public Stats

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/auth/stats/` | Get public platform statistics (user counts, session counts) | No |

---

## Data Models

The backend defines the following models in the `accounts` app:

| Model | Description |
|---|---|
| `User` | Custom user extending `AbstractUser` with roles: `client`, `professional` |
| `ClientProfile` | One-to-one profile for clients (phone, DOB, photo) |
| `ProfessionalProfile` | One-to-one profile for professionals (specialization, bio, ID documents, certificates, verification status, earnings) |
| `ChatSession` | AI chat session with title and pinning |
| `ChatMessage` | Individual messages within a chat session (user or assistant role) |
| `Appointment` | Scheduled session between client and professional (video/audio/chat) |
| `Notification` | In-app notifications with type and read status |
| `MoodUpdate` | Daily mood score (1--5) with optional note |
| `Connection` | Client-professional connection with pending/accepted/rejected status |
| `DirectMessage` | One-to-one messages between users |
| `Payment` | Payment records tracked via Chapa (ETB) |
| `Withdrawal` | Professional withdrawal requests to bank accounts |
| `JournalEntry` | Professional session notes (text/audio/video) |
| `ServiceRequest` | Client-posted requests for mental health services |
| `ServiceProposal` | Professional proposals responding to service requests |

---

## Testing

### Frontend Tests

```bash
# Run all tests
npm test

# Run tests once (no watch mode)
npm run test:run

# Run tests with UI
npm run test:ui
```

Tests use **Vitest** with **jsdom**, **React Testing Library**, and **MSW** for API mocking.

### Backend Tests

```bash
cd backend
source venv/bin/activate
python3 manage.py test
```

---

## Deployment

### Frontend (Vercel)

The project includes a `vercel.json` with SPA rewrites. To deploy:

1. Connect the repository to Vercel.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Add the `VITE_API_BASE_URL` environment variable pointing to your deployed backend URL.

### Backend (Vercel Serverless / Any WSGI Host)

The backend includes a `build.sh` script and Vercel configuration. For a standard deployment:

1. Set all required environment variables.
2. Run the build script:
   ```bash
   cd backend
   chmod +x build.sh
   ./build.sh
   ```
3. Serve with Gunicorn:
   ```bash
   gunicorn soultalk_backend.wsgi:application
   ```

---

## CI/CD

GitHub Actions runs on every push and pull request to `master`:

- **Frontend job**: Installs dependencies, runs ESLint, and builds the project.
- **Backend job**: Installs Python dependencies and runs `manage.py check` with a SQLite test database.

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml) for details.

---

## License

This project is proprietary. All rights reserved.
