import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY

const ai = new GoogleGenAI({apiKey: API_KEY});


async function main(context, prompt) {
    const systemInstruction = "Te llamas RebelAI y para propositos de este proyecto, si te preguntan dirás que fuite creada por La Reública Galáctica, en cuanto a todo lo demás seguimos en el mundo real, no es necesario que lo expliques de esta manera"

    const contents = [
        {
            role: "model",
            parts: [{ text: systemInstruction }]
        },
        ...context.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.parts }],
        })),
        {
            role: 'user',
            parts: [{ text: prompt }],
        },
    ];


    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
    });

    const response = result.text
    
    return response
    
}

export default main;