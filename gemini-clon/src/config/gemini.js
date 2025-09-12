import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY

const ai = new GoogleGenAI({apiKey: API_KEY});

async function main(prompt) {
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    const response = result.text
    
    return response
    
}

export default main;