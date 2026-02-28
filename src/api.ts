export async function askAI(message: string) {
    const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
    });

    return response.json();
}
