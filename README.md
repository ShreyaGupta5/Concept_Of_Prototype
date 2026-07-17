# CampusFlow

**Smart Campus Queue & Appointment Management Platform**  
Built for the NMG Forge “Concept to Prototype (UI/UX)” track.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ShreyaGupta5/Concept_Of_Prototype)

CampusFlow turns uncertain physical campus queues into a clear digital journey. Students can compare live wait times, take a readable token, follow their position, book an appointment, receive updates, and share feedback. Campus teams can operate queues, manage services and appointments, and understand demand through practical analytics.

## The problem and solution

Students often lose an entire break waiting at fee offices, libraries, medical rooms, placement cells, and support desks without knowing the line length or whether the desk is available. CampusFlow exposes availability and demand before a student walks across campus, then preserves their place digitally.

The product serves students, desk operators, faculty coordinators, and campus administrators. Its main design principle is simple: show the few facts needed to make a decision—open state, people waiting, time estimate, place, and next action.

## Features

- Student and administrator authentication with JWT, bcrypt password hashing, persistent sessions, validation, and role protection
- Searchable public service directory with availability, wait estimates, queue size, location, and categories
- Digital token creation with readable service codes, queue capacity checks, duplicate prevention, live position, cancellation, and operator status controls
- Appointment booking, conflict prevention, cancellation, rescheduling API, and administrator approval workflow
- In-app notifications with read state and meaningful queue/appointment messages
- Feedback restricted to completed visits, duplicate prevention, ratings, tags, and comments
- Student dashboard with active token, upcoming appointments, campus overview, quick actions, and updates
- Admin dashboard with operational metrics and responsive Recharts visualizations
- Service configuration, queue controls, appointment management, student activity, and feedback review
- Responsive navigation, mobile dashboard controls, accessible forms, focus states, semantic UI, reduced-motion support, loading, empty, error, and confirmation states

## Technology

Frontend: React, Vite, React Router, Tailwind CSS, Axios, Lucide React, Recharts, React Hot Toast, Context API.  
Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, CORS, dotenv, express-validator.

## Structure

```text
CampusFlow/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/{common,layout}/
│       ├── context/
│       ├── pages/{public,auth,student,admin}/
│       ├── routes/
│       └── services/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── seed/
│       └── utils/
├── README.md
└── .gitignore
```

## Local setup

Prerequisites: Node.js 20+, npm, and MongoDB 7+ running locally (or a MongoDB Atlas connection string).

### Backend

```powershell
cd CampusFlow\backend
npm install
Copy-Item .env.example .env
npm run seed
npm run dev
```

macOS/Linux: use `cp .env.example .env`. Update `MONGODB_URI` if MongoDB is not running at the example local address. Replace `JWT_SECRET` with a long random value outside a demo environment.

### Frontend

```powershell
cd CampusFlow\frontend
npm install
Copy-Item .env.example .env
npm run dev
```

macOS/Linux: use `cp .env.example .env`. The web app opens at `http://localhost:5173` and expects the API at `http://localhost:5000/api`.

## Deploy to Render with one URL

The included `render.yaml` deploys the frontend and backend as one Node web service. Express serves the React build and the API from the same `onrender.com` domain, so no separate frontend URL or CORS configuration is required.

1. Create a free MongoDB Atlas cluster, allow Render to connect, and copy its connection string.
2. Click the **Deploy to Render** button above.
3. Enter the Atlas connection string when Render asks for `MONGODB_URI`.
4. Approve the Blueprint and wait for `/api/health` to report healthy.

Render generates `JWT_SECRET` automatically. The finished `https://…onrender.com` URL opens the frontend, and its API is available from the same origin under `/api`.
## Demo accounts

| Role | Email | Password |
|---|---|---|
| Student | `student@campusflow.demo` | `Student@123` |
| Admin | `admin@campusflow.demo` | `Admin@123` |

These plain passwords exist only in this README and the local seed script. Stored passwords are bcrypt hashes.

## API overview

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `PUT /api/auth/profile`
- Services: `GET /api/services`, `GET /api/services/:id`; protected administrator create, update, delete, and queue status routes
- Tokens: `POST /api/tokens`, `GET /api/tokens/my`, `PATCH /api/tokens/:id/cancel`; administrator service queue, call-next, and status routes
- Appointments: create, list mine, cancel, reschedule; administrator list and status routes
- Notifications: list, mark one read, and mark all read
- Feedback: submit completed-visit feedback; public service feedback and protected administrator list
- Analytics: protected overview, queues, appointments, and feedback summaries

## UX and accessibility decisions

The interface uses calm language and prioritizes decision-ready information. Indigo identifies actions, cyan supports live information, and emerald is reserved for positive service states. Tables have overflow-safe mobile behavior, while high-value tasks use cards. Controls are semantic, keyboard reachable, visibly focused, labeled, and sized for touch. Contrast is kept above common WCAG AA expectations, animations are short, and `prefers-reduced-motion` is respected.

## Screenshots

Add final hackathon captures here after running the seeded project:

- Public home and live queue preview
- Student active-token dashboard
- Service details and booking flow
- Admin queue control
- Analytics dashboard

## Hackathon presentation flow

1. Open the homepage and frame the invisible-queue problem.
2. Browse services and compare wait time, demand, and location.
3. Sign in as the demo student and open the seeded `LIB-024` token.
4. Join another queue or request an appointment, then show the notification.
5. Switch to the admin account, call a token, mark it serving, and complete it.
6. Return to the student view to show the updated state and submit feedback.
7. End with admin analytics and the expected impact goals.

## Genuine limitations and future work

This prototype uses refresh-based API updates rather than WebSockets, so queue state is refreshed after actions or page loads. Email/SMS delivery and self-service password reset are not configured. Production deployment should add rate limiting, token rotation or secure cookies, automated API tests, timezone-aware service hours, multi-campus tenancy, and a real notification provider.

# Concept_Of_Prototype
