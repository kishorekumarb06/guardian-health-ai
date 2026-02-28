const API_URL = "http://localhost:3000/api";

// Hardcode a user ID for demo purposes (the one generated from our seed script)
// In a real app, this would come from an auth context.
export const USER_ID = "f63a605c-5dac-469a-a809-530f83bd4d4e";

export async function fetchUser(userId: string) {
    const res = await fetch(`${API_URL}/users/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
}

export async function fetchContacts(userId: string) {
    const res = await fetch(`${API_URL}/users/${userId}/contacts`);
    if (!res.ok) throw new Error("Failed to fetch contacts");
    return res.json();
}

export async function fetchLatestVitals(userId: string) {
    const res = await fetch(`${API_URL}/users/${userId}/vitals/latest`);
    if (!res.ok) throw new Error("Failed to fetch vitals");
    return res.json();
}

export async function fetchHealthHistory(userId: string) {
    const res = await fetch(`${API_URL}/users/${userId}/health-history`);
    if (!res.ok) throw new Error("Failed to fetch history");
    return res.json();
}

export async function fetchTelemetry(userId: string) {
    const res = await fetch(`${API_URL}/users/${userId}/telemetry/latest`);
    if (!res.ok) throw new Error("Failed to fetch telemetry");
    return res.json();
}

export async function fetchMedicalRecords(userId: string) {
    const res = await fetch(`${API_URL}/users/${userId}/medical-records`);
    if (!res.ok) throw new Error("Failed to fetch medical records");
    return res.json();
}

export async function fetchAiAnalysis(userId: string) {
    const res = await fetch(`${API_URL}/ai/analyze/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch AI analysis");
    return res.json();
}

export async function sendAiChatMessage(userId: string, message: string) {
    const res = await fetch(`${API_URL}/ai/chat/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error("Failed to send chat message");
    return res.json();
}
