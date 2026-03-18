import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import connect_db, close_db
from routes.events import router as events_router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle hooks."""
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="AI Event Concierge API",
    description="Convert natural language into structured event venue recommendations using Google Gemini.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — Allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(events_router, tags=["Events"])


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "AI Event Concierge API is running 🎉"}
