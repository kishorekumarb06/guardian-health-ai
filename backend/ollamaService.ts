import axios from "axios";

export async function generateResponse(prompt: string) {
    const response = await axios.post(
        "http://localhost:11434/api/generate",
        {
            model: "phi3:mini",
            prompt,
            stream: false,
        }
    );

    return response.data.response;
}
