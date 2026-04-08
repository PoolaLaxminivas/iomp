# LifeOS – Personal Life Management System

A full-stack MERN application that centralizes personal productivity into a single intelligent platform.

## Features

| Module | Capabilities |
|---|---|
| ✅ **Tasks** | CRUD, priority (low/medium/high), status toggle, due dates |
| 💰 **Expenses** | CRUD, 7 categories, running total, PieChart analytics |
| 📓 **Diary** | CRUD, 6 mood options, comma-separated tags, expandable entries |
| 🎯 **Goals** | CRUD, progress slider (0–100%), auto-complete at 100% |
| 🤖 **AI Chat** | OpenAI GPT-3.5-turbo with typing indicator |
| 🌙 **Dark Mode** | Full Tailwind `class` dark-mode toggle |
| 🔐 **Auth** | JWT + bcrypt, protected routes |

## Tech Stack

- **Frontend:** React 18, Tailwind CSS 3, Axios, React Router v6, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcryptjs
- **AI:** OpenAI API (gpt-3.5-turbo)

## Project Structure

```
lifeos/
├── server/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/           User, Task, Expense, Diary, Goal
│   ├── controllers/      auth, task, expense, diary, goal, chat
│   ├── routes/           auth, tasks, expenses, diary, goals, chat
│   └── server.js
└── client/
    └── src/
        ├── services/api.js
        ├── pages/        Login, Register, Dashboard
        └── components/   Navbar, Tasks, Expenses, Diary, Goals, Chatbot
```

## Quick Start

### 1. Backend

```bash
cd server
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, OPENAI_API_KEY
npm install
npm run dev       # runs on http://localhost:5000
```

### 2. Frontend

```bash
cd client
cp .env.example .env
npm install
npm start         # runs on http://localhost:3000
```

## Environment Variables

**`server/.env`**
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/lifeos
JWT_SECRET=your_super_secret_key
OPENAI_API_KEY=sk-...
PORT=5000
```

**`client/.env`**
```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get profile | ✅ |
| GET | `/api/tasks` | List tasks | ✅ |
| POST | `/api/tasks` | Create task | ✅ |
| PUT | `/api/tasks/:id` | Update task | ✅ |
| DELETE | `/api/tasks/:id` | Delete task | ✅ |
| GET | `/api/expenses` | List + total | ✅ |
| POST | `/api/expenses` | Add expense | ✅ |
| DELETE | `/api/expenses/:id` | Delete | ✅ |
| GET | `/api/expenses/analytics` | Category breakdown | ✅ |
| GET | `/api/diary` | List entries | ✅ |
| POST | `/api/diary` | Create entry | ✅ |
| DELETE | `/api/diary/:id` | Delete entry | ✅ |
| GET | `/api/goals` | List goals | ✅ |
| POST | `/api/goals` | Create goal | ✅ |
| PUT | `/api/goals/:id` | Update progress | ✅ |
| DELETE | `/api/goals/:id` | Delete goal | ✅ |
| POST | `/api/chat` | AI assistant | ✅ |

## Deployment

### Backend → Render / Railway
1. Push to GitHub
2. Create Web Service → set root to `server/`
3. Build: `npm install` · Start: `npm start`
4. Add environment variables

### Frontend → Vercel
1. Import repo → set root to `client/`
2. Add `REACT_APP_API_URL` pointing to your deployed backend URL

### MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create DB user + whitelist IP `0.0.0.0/0`
3. Copy connection string into `MONGO_URI`
