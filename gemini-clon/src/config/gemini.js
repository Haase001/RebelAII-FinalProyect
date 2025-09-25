import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY

const ai = new GoogleGenAI({apiKey: API_KEY});


async function main(context, prompt, options = {}) {
    const systemInstruction = "Te llamas RebelAI y para propositos de este proyecto, si te preguntan dirás que fuite creada por La República Galáctica en cuanto a todo lo demás seguimos en el mundo real. No necesitas explicar esto a menos que te lo pregunten directamente. Mantén un tono profesional, claro y útil."

    let contents = [
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

     // 🔁 Si el contexto es largo, pide a RebelAI que lo resuma
    const totalLength = contents.reduce((acc, msg) => acc + msg.parts[0].text.length, 0);
    if (totalLength > 8000) {
        const summaryPrompt = "Resume esta conversación en pocas líneas para continuar sin perder contexto.";
        const summaryResult = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents.concat({ role: 'user', parts: [{ text: summaryPrompt }] }),
        });

        const summary = summaryResult.text;
        contents = [
            { role: "model", parts: [{ text: systemInstruction }] },
            { role: "user", parts: [{ text: "Resumen del contexto anterior:" }] },
            { role: "model", parts: [{ text: summary }] },
            { role: "user", parts: [{ text: prompt }] },
        ];
    }


    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
        });

        const response = result.text
    
        // 🏷️ Si es la primera vez, genera un título
        let title = null;
        if (options.generateTitle) {
            const titleResult = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [
                    { role: "user", parts: [{ text: `Genera un título breve para esta conversación: "${prompt}" y "${response}"` }] },
                ],
            });
        title = titleResult.text;
        }

        return { response, title };
    } catch (error) {
        if (error.message.includes("RESOURCE_EXHAUSTED")) {
            alert("Has superado el límite de uso de la API. Intenta más tarde o revisa tu plan.");
            return "⚠️ Límite de uso alcanzado. No se pudo generar respuesta.";
        }
        throw error;
    }
}

export default main;