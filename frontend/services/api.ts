import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
    timeout: 30000, // 30s timeout for Gemini calls
});

// ---- Types ----

export interface GeminiResponse {
    venue_name: string;
    location: string;
    estimated_cost: string;
    why_it_fits: string;
}

export interface EventRecord {
    id: string;
    query: string;
    response: GeminiResponse;
    created_at: string;
}

// ---- API Calls ----

/**
 * POST /generate-event
 * Send a natural language query to the backend and get a venue recommendation.
 */
export async function generateEvent(query: string): Promise<EventRecord> {
    const { data } = await api.post<EventRecord>("/generate-event", { query });
    return data;
}

/**
 * GET /history
 * Fetch all previous event searches, sorted latest first.
 */
export async function fetchHistory(): Promise<EventRecord[]> {
    const { data } = await api.get<EventRecord[]>("/history");
    return data;
}

/**
 * DELETE /events/:id
 * Delete a specific event from history.
 */
export async function deleteEvent(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
}
