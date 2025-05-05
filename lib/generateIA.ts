'use server'
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function Respuesta(titulo: string) {
    try {


        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: `Tu tarea ahora es responder a la siguiente pregunta es ${titulo}:`,
            config: {
                systemInstruction: `Eres un asistente muy preciso y respetuoso que te llamas Aria. 
                Por favor, responde siempre en español, de forma clara y concisa. 
                Utiliza un tono amigable y evita respuestas muy largas.`,
                temperature: 0.2,
                maxOutputTokens: 200,
            },
        });
        console.log(response.text);
        return response.text
    } catch (error) {

        return "No hay respuesta"
    }
}
export async function Signatura(titulo: string) {
    try {


        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `hay respuesta
        Eres un asistente muy preciso y respetuoso. 
        Por favor, responde de forma clara y concisa.  
        Tu tarea ahora es responder a la siguiente pregunta es cual es la signatura Dewey del libro, revista de ${titulo} solo dame el número de la signatura Dewey sin repetir el titulo ni nada solo el numero:

        Si no entiendes algo, devuelve no encontrado.
        Si no puedes ayudarle, dile que lo sienta y que no puede ayudarle en ese momento. 
    `,
        });
        return response.text
    } catch (error) {
        return "No se encontro"

    }
}