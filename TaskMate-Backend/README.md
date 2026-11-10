# TaskMate Backend

Express + MongoDB backend starter for the TaskMate student assignment manager.

## 1. Install dependencies

Open a terminal inside this folder and run:

```bash
npm install
```

## 2. Add environment variables

1. Copy `.env.example` and rename the copy to `.env`.
2. Replace the placeholder `MONGO_URI` with your MongoDB connection string.
3. Replace `JWT_SECRET` with a long random secret.
4. Keep `.env` private. Do not upload it to GitHub or share it in screenshots.

You can use MongoDB Atlas or a local MongoDB installation.

## 3. Start the server

```bash
npm run dev
```

The server starts at `http://localhost:5000` after it connects to MongoDB. For production, set `NODE_ENV=production`, use a long random `JWT_SECRET`, and set `CLIENT_URL` to the deployed frontend origin (multiple comma-separated origins are supported).

Test these URLs in your browser:
- `http://localhost:5000/`
- `http://localhost:5000/api/health`

## Assignment API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/assignments` | Get all assignments |
| POST | `/api/assignments` | Create an assignment |
| GET | `/api/assignments/:id` | Get one assignment |
| PUT | `/api/assignments/:id` | Update an assignment |
| DELETE | `/api/assignments/:id` | Delete an assignment |

Example JSON for `POST /api/assignments`:

```json
{
  "title": "Prepare DBMS assignment",
  "subject": "DBMS",
  "description": "Complete questions 1 to 5",
  "dueDate": "2026-11-20",
  "priority": "High",
  "status": "Pending"
}
```

## Project structure

```text
taskmate-backend/
├── config/
│   └── db.js
├── controllers/
│   └── assignmentController.js
├── middleware/
│   └── errorHandler.js
├── models/
│   └── Assignment.js
├── routes/
│   └── assignmentRoutes.js
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

Note: Registration/login and JWT authentication are not wired up yet. The dependencies are included so we can add authentication as a later step.

## Production start

```bash
npm install --omit=dev
npm start
```

The API requires a reachable MongoDB instance through `MONGO_URI`. Deploy the backend as a Node service and expose `/api/health` for health checks. The frontend should use the backend origin in `VITE_API_URL`.
