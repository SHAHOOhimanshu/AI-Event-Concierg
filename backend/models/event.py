from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class EventRequest(BaseModel):
    """Request model for the /generate-event endpoint."""
    query: str = Field(..., min_length=5, description="Natural language event planning query")


class GeminiResponse(BaseModel):
    """Validates the structured JSON returned by Gemini."""
    venue_name: str
    location: str
    estimated_cost: str
    why_it_fits: str


class EventDocument(BaseModel):
    """Full MongoDB document shape."""
    query: str
    response: GeminiResponse
    created_at: datetime = Field(default_factory=datetime.utcnow)


class EventOut(BaseModel):
    """Response model returned to the frontend."""
    id: Optional[str] = None
    query: str
    response: GeminiResponse
    created_at: datetime
