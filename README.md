#  LeadFlow CRM — Lead Management System
Live Demon Link : https://lead-8823dsa00-sam-ayyy15s-projects.vercel.app/
A full-stack Lead Management CRM built with **React.js**, **Node.js + Express**, and **MongoDB**.

---

## Features

- **Dashboard** with real-time lead statistics (Total, New, Contacted, Qualified, Converted, Lost)
- **Add / Edit / Delete** leads with full form validation
- **Search** leads by name, email, or company (debounced for performance)
- **Filter** by lead status
- **Sort** by any column (name, email, company, status, date)
- **Pagination** with configurable page size
- **Confirmation dialog** before deleting leads
- **Toast notifications** for all actions
- **Responsive design** — works on mobile, tablet, and desktop

---

## 🗂️ Project Structure

```
crm/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── validate.js        # Input validation rules
│   ├── models/
│   │   └── Lead.js            # Mongoose schema
│   ├── routes/
│   │   └── leads.js           # All API routes
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   └── server.js              # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── DeleteConfirmModal.jsx
    │   │   ├── LeadForm.jsx        # Add/Edit modal form
    │   │   ├── LeadsTable.jsx      # Data table with sorting & pagination
    │   │   └── StatsCards.jsx      # Dashboard stat cards
    │   ├── hooks/
    │   │   └── useLeads.js         # Custom React hook for API calls
    │   ├── utils/
    │   │   └── api.js              # Axios instance & API functions
    │   ├── App.jsx                 # Root component
    │   ├── App.css
    │   └── index.js
    └── package.json
```



### 1. Clone the Repository

```bash
git clone https://github.com/your-username/leadflow-crm.git
cd leadflow-crm
```

---

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/crm_leads
PORT=5000
FRONTEND_URL=http://localhost:3000
```

> 💡 **Using MongoDB Atlas?* Replace `MONGODB_URI` with your Atlas connection string:
> `mongodb+srv://<user>:<password>@cluster.mongodb.net/crm_leads?retryWrites=true&w=majority`

Start the backend server:

```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

The API will be available at: `http://localhost:5000`

---

### 3. Set Up the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file:

```bash
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

Start the frontend:

```bash
npm start
```

The app will open at: `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/leads` | Get all leads (supports `?status=`, `?page=`, `?limit=`, `?sortBy=`, `?sortOrder=`) |
| `POST` | `/api/leads` | Create a new lead |
| `PUT` | `/api/leads/:id` | Update a lead by ID |
| `DELETE` | `/api/leads/:id` | Delete a lead by ID |
| `GET` | `/api/leads/search?q=keyword` | Search leads by name, email, or company |

### Example: Create a Lead

```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@acme.com",
    "phone": "+1-555-123-4567",
    "company": "Acme Corp",
    "status": "New",
    "notes": "Interested in Enterprise plan"
  }'
```

### Lead Status Values
`New` | `Contacted` | `Qualified` | `Converted` | `Lost`

---

## 🌐 Deployment

### Deploy Backend to Railway / Render

1. Push your backend folder to GitHub
2. Connect to [Railway](https://railway.app) or [Render](https://render.com)
3. Set environment variables in the dashboard
4. Deploy!

### Deploy Frontend to Vercel / Netlify

1. Push your frontend folder to GitHub
2. Connect to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
3. Set `REACT_APP_API_URL` to your deployed backend URL
4. Deploy!

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Axios, CSS |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose |
| Validation | express-validator |

---

