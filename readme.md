# Wrench — Community Build Network

## Project Structure

- `backend/` — Node.js + Express API with MongoDB models and JWT authentication
- `frontend/` — React + Vite + Tailwind client with routing, auth flows, and project management UI
- `backend/env.example` — sample environment variables (copy to `.env`)

## Getting Started

### Requirements

- Node.js 18+
- npm or yarn
- MongoDB instance (local or hosted)

### Backend Setup

```bash
cd backend
cp env.example .env # adjust values as needed
npm install
npm run dev
```

The API runs on `http://localhost:5000` by default and exposes:

- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `GET /projects`, `POST /projects`, `GET /projects/:id`, `PUT /projects/:id`, `DELETE /projects/:id`, `POST /projects/:id/volunteer`
- `GET /chat/:projectId`, `POST /chat/:projectId`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

By default the client runs on `http://localhost:3000`. Create a `.env` with `VITE_API_URL=http://localhost:5000` if you need a custom API base.

### Run Concurrently

In separate terminals:

```bash
cd backend && npm run dev
```

```bash
cd frontend && npm run dev
```

Or use a process manager like `npm-run-all`/`concurrently` if you prefer a single command script.

## Core Flows

- Community organizers can register, post projects, and manage status (protected routes under `/projects/new`).
- Volunteers can browse projects, view match scores based on owned tools, join teams, and chat with teammates.
- Authenticated users access a dashboard summarizing their active projects and participation.

## Next Steps

- Add persistent chat (Socket.io or polling).
- Extend filtering with geo-distance and calendar availability.
- Polish UI styling and add component-level tests.