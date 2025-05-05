"use server";
import { getTokenFromSession } from "@/app/api/utils/auth";
import { Content, Respuest } from "@/interface/Interface";
import { z } from "zod";

const contentSchema = z.object({
    content_sectionTitle: z.optional(z.string()),
    content_sectionTitleParallel: z.optional(z.string()).nullable(),
    content_pageNumber: z.optional(z.number()),
    book: z.optional(z.number()),
    id: z.optional(z.string())
});

export async function createContent(formData: FormData): Promise<Respuest> {
    const contents = [];
    for (let i = 0; formData.get(`content_sectionTitle_${i}`) !== null; i++) {
        const data = {
            content_sectionTitle: formData.get(`content_sectionTitle_${i}`) || null,
            content_sectionTitleParallel: formData.get(`content_sectionTitleParallel_${i}`) || null,
            content_pageNumber: Number(formData.get(`content_pageNumber_${i}`)) || 0,
            book: Number(formData.get("book")) || null,
            id: String(formData.get(`id_${i}`)) || "null",
        };
        contents.push(data);
    }

    const validatedContents = [];
    try {
        for (const content of contents) {
            const validatedData = contentSchema.parse(content);
            validatedContents.push(validatedData);
        }
        return await save(contents[0]?.id, validatedContents);
    } catch (error) {
        console.error('Error en el guardado:', error);
        return { success: false, message: 'Error en el contenido' };
    }
}

const create = async (validatedData: any): Promise<Respuest> => {
    const token = await getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}contents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(validatedData),
        });

        const result: Content = await res.json()
        if (!res.ok) {
            return { success: false, message: 'No se pudo añadir el contenido' };
        }
        return { success: true, message: 'Contenido añadida correctamente' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al añadir el contenido' };
    }
};

const update = async (id: string, validatedData: any): Promise<Respuest> => {
    const token = await getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}contents/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(validatedData),
        });
        const result = await res.json()
        if (!res.ok) {
            return { success: false, message: 'No se pudo actualizar el contenido' };
        }
        return { success: true, message: 'Contenido actualizado correctamente', description: result.content_sectionTitle };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al actualizar el contenido' };
    }
};

const save = async (id: string, validatedData: any[]) => {
    const payload = {
        contents: validatedData // Aquí simplemente asignamos validatedData
    };

    if (id === "null" || id === "undefined") {
        return await create(payload);
    } else {
        return await update(id, validatedData[0]); // Enviamos el primer objeto para actualizar
    }
};
