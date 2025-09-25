'use server'
import { getSessionUser } from "@/app/api/utils/auth";
import { BookFormData } from "@/interface/Interface";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const conversationMemory = new Map<string, any>();
export async function Respuesta(mensaje: string) {
    const userEmail: string = String(await getSessionUser());
    try {
        const isBusqueda = /recomienda|libros de|quiero leer|recomiéndame|recomendarme|necesito/i.test(mensaje);
        if (isBusqueda) {
            const respuesta = await BusquedaBooksIA(mensaje, userEmail)
            return `Aquí tienes algunas recomendaciones:\n\n${respuesta}`;
        } else {
            return await ConversacionIA(mensaje, userEmail);
        }
    } catch (error) {
        console.error(error);
        return "Lo siento, no pude procesar tu mensaje.";
    }
}

export async function Signatura(titulo: string, autor: string) {
    console.log('titulo', titulo);
    console.log('autor', autor);
    try {
        const response = await ai.models.generateContent({
            model: process.env.GOOGLE_MODEL || "gemini-2.5-flash-lite",
            contents: `Eres un asistente preciso y respetuoso.
                    Responde de forma clara y concisa.

                    Tu tarea es la siguiente:
                    Dado el título ${titulo}, proporciona únicamente el número de la signatura Dewey correspondiente, seguido del número Cutter del autor ${autor}.
                    No repitas el título ni añadas información adicional; solo devuelve los dos datos separados por "/".

                    Si no entiendes el título o no puedes encontrar la información, responde con:

                    "No encontrado" si no entiendes.

                    "Lo siento, no puedo ayudarte en este momento" si no puedes ayudar.`,
        });
        return response.text
    } catch (error) {
        return "No se encontro"

    }
}
async function BusquedaBooksIA(mensaje: string, userEmail: string) {
    const liempiezaBusqueda = await ai.models.generateContent({
        model: process.env.GOOGLE_MODEL || "gemini-2.5-flash-lite",
        contents: `Extrae el tema o palabra clave del siguiente mensaje, relacionado con libros o música. Solo responde con la palabra o frase clave más relevante, sin explicaciones: ${mensaje}`,
        config: {
            systemInstruction: `Eres Aria, un asistente amable, claro y en español.
                                    si te piden recomendaciones solo realizalas recomendaciones de libros, revistas o artículos de musica de cualquier rama.`,
            temperature: 0.2,
            maxOutputTokens: 200,
        },
    });
    const empiezaBusqueda: string = String(liempiezaBusqueda.text);
    const libros = await searchBooks(empiezaBusqueda);
    if (libros.length === 0) {
        return "No se encontraron libros relacionados con tu búsqueda.";
    }
    conversationMemory.set(userEmail || 'public', {
        tema: empiezaBusqueda,
        titulos: libros.map(libro => libro.book_title_original),
        libros,
        timestamp: Date.now(),
    });


    const respuesta = libros.map(libro => {
        const autores = libro.book_authors?.map(a => a.author_name).join(', ') || 'Autor desconocido';
        // return `📖 *${libro.book_title_original}* de ${libro.book_authors.map(a => a.author_name).join(', ')}.
        //     Puedes verlo aquí: /content/${libro.id}`;

        return `
            <div style="margin-bottom: 1rem;">
            <p style="margin: 0;">📖 <strong>${libro.book_title_original}</strong></p>
            <p style="margin: 0;">${autores ? `Autor: ${autores}` : ''}</p>
            <a href="/content/${libro.id}" target="_blank" style="color: #1e90ff; text-decoration: underline;">Ver más detalles</a>
            </div>
            `;
    }).join('');
    return respuesta;
}
async function ConversacionIA(mensaje: string, userEmail: string) {
    const memory = conversationMemory.get(userEmail || 'public');
    const contents = memory
        ? `El usuario ya solicitó recomendaciones de libros sobre: "${memory.tema} y estos serian los titulos: ${memory.titulos}". 
        Ahora te envía este nuevo mensaje: "${mensaje}".
        Si el mensaje se relaciona con los libros recomendados previamente, responde de forma coherente teniendo en cuenta esa información. 
        Si no está relacionado, simplemente responde normalmente al mensaje.`
        : `Responde al siguiente mensaje del usuario de forma clara, amable y en español: "${mensaje}".`;
    const response = await ai.models.generateContent({
        model: process.env.GOOGLE_MODEL || "gemini-2.5-flash-lite",
        contents,
        config: {
            systemInstruction: `Eres Aria, un asistente amable, claro y en español.
                                si te piden recomendaciones solo realizalas recomendaciones de libros, revistas o artículos de musica de cualquier rama.`,
            temperature: 0.2,
            maxOutputTokens: 200,
        },
    });
    return response.text;
}
async function searchBooks(query: string): Promise<BookFormData[]> {
    const urlBase = process.env.NEXTAUTH_URL || "http://localhost:3000";
    try {
        const url = `${urlBase}/api/books?query=${encodeURIComponent(query)}&page=1&size=5`;
        const res = await fetch(url);

        if (!res.ok) throw new Error("Error en la API de libros");

        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error("Error buscando libros:", error);
        return [];
    }
}