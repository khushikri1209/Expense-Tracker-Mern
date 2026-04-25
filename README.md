# Expense Tracker – MERN Stack

A full-stack **Expense Tracker** web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

---

## ✨ Features

- 🔐 **User Authentication** – Register, Login, Logout with JWT
- 📊 **Dashboard** – Total income, total expense, and current balance
- ➕ **CRUD Transactions** – Add, edit, delete income & expense records
- 🗂️ **Categories** – Food, Transport, Housing, Entertainment, Health, etc.
- 📅 **Date-wise Filtering** – Filter transactions by date range and type
- 📈 **Charts** – Monthly bar chart and category-wise doughnut chart (Chart.js)
- 📱 **Responsive UI** – Works on desktop, tablet, and mobile
- 🌐 **REST API** – Express + MongoDB backend
- 🔒 **Secure** – Passwords hashed with bcrypt, routes protected by JWT middleware

---

## 🛠️ Tech Stack

| Layer    | Technology               |
|----------|--------------------------|
| Frontend | React 18, React Router 6, Chart.js, Axios |
| Backend  | Node.js, Express.js      |
| Database | MongoDB + Mongoose        |
| Auth     | JSON Web Tokens (JWT), bcryptjs |

---

## 📁 Folder Structure

```
Expense-Tracker-Mern/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Route logic (auth, transactions)
│   ├── middleware/     # JWT auth middleware
│   ├── models/         # Mongoose schemas (User, Transaction)
│   ├── routes/         # Express routers
│   ├── .env.example    # Environment variable template
│   └── server.js       # App entry point
└── frontend/
    ├── public/
    └── src/
        ├── components/ # Reusable UI components + charts
        ├── context/    # React AuthContext
        ├── pages/      # Login, Register, Dashboard
        └── utils/      # Axios API instance
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 16
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repo
```bash
git clone https://github.com/khushikri1209/Expense-Tracker-Mern.git
cd Expense-Tracker-Mern
```

### 2. Configure the backend
```bash
cd backend
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET
npm install
npm run dev       # Starts on http://localhost:5000
```

### 3. Start the frontend
```bash
cd ../frontend
npm install
npm start         # Starts on http://localhost:3000
```

The React app proxies `/api` requests to `http://localhost:5000` automatically.

---

## 📡 API Endpoints

### Auth (`/api/auth`)
| Method | Route      | Description          |
|--------|------------|----------------------|
| POST   | /register  | Register new user    |
| POST   | /login     | Login, returns JWT   |
| GET    | /me        | Get current user     |

### Transactions (`/api/transactions`) — *All routes require Bearer token*
| Method | Route        | Description                     |
|--------|--------------|---------------------------------|
| GET    | /            | List transactions (filterable)  |
| POST   | /            | Create transaction              |
| PUT    | /:id         | Update transaction              |
| DELETE | /:id         | Delete transaction              |
| GET    | /summary     | Income, expense, balance totals |

**Query params for GET /:** `startDate`, `endDate`, `type` (`income`/`expense`)

---

## 🔑 Environment Variables

Create `backend/.env` from `backend/.env.example`:

```
MONGO_URI=mongodb://localhost:27017/expense_tracker
JWT_SECRET=your_super_secret_key
PORT=5000
```
