# AI Event Concierge 🎉

A full-stack AI-powered web app that converts natural language event queries into structured venue recommendations using **Google Gemini**, **FastAPI**, **MongoDB**, and **Next.js**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), Tailwind CSS, Axios |
| Backend | FastAPI (Python), Pydantic, Uvicorn |
| Database | MongoDB (Motor – async driver) |
| AI | Google Gemini 1.5 Flash |

---

## Project Structure

```
AI Event Concierge/
├── backend/
│   ├── main.py            # FastAPI app entry point
│   ├── database.py        # MongoDB async connection
│   ├── models/
│   │   └── event.py       # Pydantic models
│   ├── routes/
│   │   └── events.py      # API endpoints + Gemini integration
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx       # Main home page
│   │   └── globals.css
│   ├── components/
│   │   ├── EventCard.tsx
│   │   ├── HistorySection.tsx
│   │   └── Spinner.tsx
│   ├── services/
│   │   └── api.ts         # Axios API service
│   └── .env.local.example
└── README.md
```

---

## Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **MongoDB** running locally (`mongodb://localhost:27017`) — or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Google Gemini API Key** — get one free at [Google AI Studio](https://aistudio.google.com)

---

## Backend Setup

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create your .env file from the example
copy .env.example .env      # Windows
cp .env.example .env        # macOS/Linux

# 5. Edit .env with your keys
#    GEMINI_API_KEY=<your key>
#    MONGO_URI=mongodb://localhost:27017
#    DB_NAME=ai_event_concierge

# 6. Start the backend
uvicorn main:app --reload --port 8000
```

The API will be live at **http://localhost:8000**  
Swagger docs at **http://localhost:8000/docs**

---

## Frontend Setup

```bash
# 1. Navigate to the frontend folder
cd frontend

# 2. Create your .env.local file
copy .env.local.example .env.local     # Windows
cp .env.local.example .env.local       # macOS/Linux

# 3. Edit .env.local if your backend runs on a different port
#    NEXT_PUBLIC_API_URL=http://localhost:8000

# 4. Install dependencies (already done if you ran create-next-app)
npm install

# 5. Start the dev server
npm run dev
```

The frontend will be live at **http://localhost:3000**

---

## API Endpoints

### `POST /generate-event`
Accepts a natural language query and returns an AI venue recommendation.

**Request body:**
```json
{ "query": "Plan a 10-person leadership retreat in the mountains for 3 days with a $4000 budget" }
```

**Response:**
```json
{
  "id": "...",
  "query": "...",
  "response": {
    "venue_name": "Mountain Haven Lodge",
    "location": "Blue Ridge Mountains, NC",
    "estimated_cost": "$3,800",
    "why_it_fits": "..."
  },
  "created_at": "2026-03-18T12:00:00"
}
```

### `GET /history`
Returns all previous searches, sorted most recent first.

---

## MongoDB Schema

Collection: `events`

```json
{
  "query": "string",
  "response": {
    "venue_name": "string",
    "location": "string",
    "estimated_cost": "string",
    "why_it_fits": "string"
  },
  "created_at": "ISODate"
}
```

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `MONGO_URI` | MongoDB connection string |
| `DB_NAME` | Database name (default: `ai_event_concierge`) |

### Frontend (`frontend/.env.local`)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

---

## Features

- 🤖 **AI-Powered** — Google Gemini 1.5 Flash for structured venue recommendations
- 🔄 **Async** — Full async/await throughout (Motor + FastAPI + Next.js)
- 🗄️ **Persistent** — All queries saved to MongoDB
- 📜 **History** — Browse all previous searches with refresh
- ❌ **Error Handling** — Graceful fallbacks for API and network failures
- 📱 **Responsive** — Mobile-first Tailwind CSS design
- ⌨️ **Keyboard UX** — Ctrl+Enter to submit, example chips to get started
