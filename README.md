# 🥛 Maram Manager — Dairy Operations Web App

A mobile-optimized web application for managing daily dairy/milk distribution operations. Built for branch managers to handle morning dispatch workflow end-to-end.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| State | Zustand |
| HTTP Client | Axios |
| Styling | Vanilla CSS (custom design system) |
| Icons | Lucide React |
| Toasts | react-hot-toast |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |

## Project Structure

```
Morning_Dispatch/
├── frontend/     # React + Vite (port 5173)
├── backend/      # Node + Express (port 5000)
└── .gitignore
```

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Backend Setup

```bash
cd backend
npm install

# Copy env file (edit MONGO_URI and JWT_SECRET for production)
copy .env.example .env

# Start dev server
npm run dev

# Seed database with mock data (first time)
npm run seed
```

**Default manager credentials after seeding:**
- Phone: `9999999999`
- Password: `manager123`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Features

| Module | Description |
|---|---|
| 🔐 Auth | Login with phone + password/PIN |
| 📊 Dashboard | Morning workflow checklist + urgent issues |
| 👥 Attendance | Mark staff as Present / Absent / Standby |
| 🗺 Routes | Assign delivery persons to routes |
| 📦 Inventory | Load reconciliation with steppers |
| ⛽ Petrol Allowance | Disburse daily PA to DPs |
| 💰 Transactions | Income/expense cash log |
| 🛒 Point of Sale | Counter walk-in sales with checkout |
| 🧴 Empty Bottles | Track bottle collection per route |
| 👤 Staff | Team directory with add/activate |
| 💸 Salary | Base salary, advances, net payable |
| 📈 Reports | End-of-day summary dashboard |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Manager login |
| GET | `/api/auth/me` | Current user |
| GET/POST | `/api/staff` | Staff list / add |
| GET/PUT | `/api/attendance` | Attendance by date |
| GET/PUT | `/api/routes` | Routes + DP assign |
| GET/PUT | `/api/inventory` | Inventory + stepper |
| GET/PUT | `/api/petrol` | Petrol allowances |
| GET/POST | `/api/transactions` | Cash transactions |
| GET/PUT/POST | `/api/pos` | POS items + checkout |
| GET/PUT | `/api/bottles` | Bottle records |
| GET/PUT | `/api/salary` | Salary + advances |
| GET | `/api/reports` | Daily report summary |

## Database Migration Note

The backend is designed with clean, flat Mongoose schemas (no nested documents) to make future migration to **PostgreSQL** straightforward. Each model maps 1:1 to a SQL table. When migrating:
1. Replace Mongoose models with Sequelize/Prisma models
2. All relationships use ObjectId references → convert to foreign keys
3. Virtual computed fields → SQL computed columns or view queries

## Deployment

- **Frontend**: Deploy `frontend/dist` to Vercel or Netlify
- **Backend**: Deploy to Render, Railway, or any Node.js host
- **Database**: Use MongoDB Atlas (free M0 cluster)
- Update `CLIENT_URL` in backend `.env` and Vite proxy in production
