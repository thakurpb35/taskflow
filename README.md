# TaskFlow – Task Management Web App

A full-stack task manager. Users sign up, log in, and manage their own tasks with priorities, deadlines and status tracking.

**Tech stack:** React.js (Vite), Node.js, Express.js, MongoDB (Mongoose), JWT authentication

## Features
- Sign up / log in with JWT authentication (passwords hashed with bcrypt)
- Create, edit, delete tasks with title, description, priority, status and due date
- Dashboard counters (total / to do / in progress / done)
- Search, filter by status and priority, sort by newest / due date / priority
- Overdue tasks highlighted
- Every API route is protected; users can only access their own tasks
- Responsive layout

## Project structure
```
taskflow/
├── server/   Express REST API  (routes, models, JWT middleware)
└── client/   React front-end   (Vite)
```

## API
| Method | Endpoint             | Description                     | Auth |
|--------|----------------------|---------------------------------|------|
| POST   | /api/auth/register   | Create account                  | No   |
| POST   | /api/auth/login      | Log in, returns JWT             | No   |
| GET    | /api/auth/me         | Current user                    | Yes  |
| GET    | /api/tasks           | List tasks (`status`, `priority`, `search`, `sort`) | Yes |
| GET    | /api/tasks/stats     | Counts per status               | Yes  |
| POST   | /api/tasks           | Create task                     | Yes  |
| PUT    | /api/tasks/:id       | Update task                     | Yes  |
| DELETE | /api/tasks/:id       | Delete task                     | Yes  |

## Run locally
Requirements: Node.js 18+ and MongoDB (local install or a free MongoDB Atlas cluster).

```bash
# 1. API
cd server
npm install
cp .env.example .env        # on Windows: copy .env.example .env  (then edit JWT_SECRET)
npm start                   # http://localhost:5001

# 2. Front-end (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173
```

### Single-process mode (production-style)
```bash
cd client && npm install && npm run build
cd ../server && npm install && npm start
# open http://localhost:5001  (Express serves the built React app)
```

## Environment variables (`server/.env`)
| Name       | Example                                | Purpose                 |
|------------|----------------------------------------|-------------------------|
| PORT       | 5001                                   | API port                |
| MONGO_URI  | mongodb://127.0.0.1:27017/taskflow     | MongoDB connection      |
| JWT_SECRET | a long random string                   | Signs login tokens      |
