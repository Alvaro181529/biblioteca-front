// 'use server'
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// export async function Respuesta(titulo: string) {
//     try {


//         const response = await ai.models.generateContent({
//             model: "gemini-2.0-flash-lite",
//             contents: `Tu tarea ahora es responder a la siguiente pregunta es ${titulo}:`,
//             config: {
//                 systemInstruction: `Eres un asistente muy preciso y respetuoso que te llamas Aria. 
//                 Por favor, responde siempre en español, de forma clara y concisa. 
//                 Utiliza un tono amigable y evita respuestas muy largas.`,
//                 temperature: 0.2,
//                 maxOutputTokens: 200,
//             },
//         });
//         console.log(response.text);
//         return response.text
//     } catch (error) {

//         return "No hay respuesta"
//     }
// }
'use server'
import { BookFormData } from "@/interface/Interface";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function Respuesta(mensaje: string) {
    const isBusqueda = /recomienda|libros de|quiero leer|recomiéndame|solfeo/i.test(mensaje);

    if (isBusqueda) {
        const libros = await searchBooks(mensaje);
        // console.log(libros);
        if (libros.length === 0) {
            return "No se encontraron libros relacionados con tu búsqueda.";
        }

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

        return `Aquí tienes algunas recomendaciones:\n\n${respuesta}`;
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: `Tu tarea es responder a este mensaje: ${mensaje}`,
            config: {
                systemInstruction: `Eres Aria, un asistente amable, claro y en español.
                                    si te piden recomendaciones solo realizalas recomendaciones de libros, revistas o artículos de musica de cualquier rama.`,
                temperature: 0.2,
                maxOutputTokens: 200,
            },
        });

        return response.text;
    } catch (error) {
        console.error(error);
        return "Lo siento, no pude procesar tu mensaje.";
    }
}

export async function searchBooks(query: string): Promise<BookFormData[]> {
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