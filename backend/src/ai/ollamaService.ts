import axios from "axios";

export async function generateAIResponse(prompt: string) {
    try {
        const response = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: "phi3",            // Faster than llama3
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.4,       // Faster + more focused
                    num_predict: 120,       // Limits response length
                    top_k: 40
                }
            },
            {
                timeout: 20000            // Prevents long hangs
            }
        );

        return response.data.response;

    } catch (error) {
        console.error("Ollama performance error:", error);
        throw new Error("AI processing failed");
    }
}
