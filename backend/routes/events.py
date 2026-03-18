import os
import json
import re
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from datetime import datetime

from database import get_events_collection
from models.event import EventRequest, GeminiResponse, EventOut

router = APIRouter()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

GEMINI_PROMPT_TEMPLATE = """You are an expert event planner.

Convert the following user request into structured JSON.

Return ONLY valid JSON with these exact fields:
- venue_name
- location
- estimated_cost
- why_it_fits

User request: {user_input}"""


def extract_json(text: str) -> dict:
    """
    Safely extract JSON from Gemini's response text.
    Handles cases where Gemini wraps JSON in markdown code blocks.
    """
    # Strip markdown code fences if present
    clean = re.sub(r"```(?:json)?", "", text).strip().rstrip("```").strip()

    # Attempt direct JSON parse
    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        # Try to find a JSON object within the text
        match = re.search(r"\{.*\}", clean, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise ValueError(f"No valid JSON found in Gemini response: {text}")


@router.post("/generate-event", response_model=EventOut)
async def generate_event(request: EventRequest):
    """
    Accept a natural language query, call Gemini, parse the JSON response,
    persist to MongoDB, and return the structured result.
    """
    query = request.query.strip()

    # Build and send Gemini prompt
    prompt = GEMINI_PROMPT_TEMPLATE.format(user_input=query)

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        result = model.generate_content(prompt)
        raw_text = result.text
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Gemini API error: {str(e)}"
        )

    # Parse and validate JSON
    try:
        parsed = extract_json(raw_text)
        gemini_response = GeminiResponse(**parsed)
    except (ValueError, KeyError, TypeError) as e:
        raise HTTPException(
            status_code=422,
            detail=f"Failed to parse Gemini response: {str(e)}"
        )

    # Persist to MongoDB
    now = datetime.utcnow()
    document = {
        "query": query,
        "response": gemini_response.model_dump(),
        "created_at": now,
    }

    try:
        collection = get_events_collection()
        insert_result = await collection.insert_one(document)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )

    return EventOut(
        id=str(insert_result.inserted_id),
        query=query,
        response=gemini_response,
        created_at=now,
    )


@router.get("/history", response_model=list[EventOut])
async def get_history():
    """
    Return all previous event searches from MongoDB, most recent first.
    """
    try:
        collection = get_events_collection()
        cursor = collection.find({}).sort("created_at", -1)
        events = []
        async for doc in cursor:
            events.append(
                EventOut(
                    id=str(doc["_id"]),
                    query=doc["query"],
                    response=GeminiResponse(**doc["response"]),
                    created_at=doc["created_at"],
                )
            )
        return events
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch history: {str(e)}"
        )


from bson import ObjectId

@router.delete("/events/{event_id}")
async def delete_event(event_id: str):
    """
    Delete a specific event from history by its ID.
    """
    try:
        collection = get_events_collection()
        result = await collection.delete_one({"_id": ObjectId(event_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Event not found")
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )
