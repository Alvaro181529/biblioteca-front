"use server"
import { z } from "zod"
const IntrumentSchema = z.object({
    publication_title: z.optional(z.string()),
    publication_content: z.optional(z.string()),
    publication_importance: z.optional(z.string()),
    publication_imagen: z.optional(z.string()),
    publication_active: z.optional(z.boolean()),
    id: z.optional(z.string())
})

export async function createPublication(formData: FormData) {
    const data = {
        id: formData.get("id") || "null",
        publication_title: String(formData.get("publication_title")) || "null",
        publication_content: String(formData.get("publication_content")) || "null",
        publication_importance: String(formData.get("publication_importance")) || "null",
        publication_imagen: String(formData.get("publication_imagen")) || "null",
        publication_active: Boolean(formData.get("publication_active") === "true") || false,
    }
    const validatedData = IntrumentSchema.parse(data);
    try {
        await save(String(data.id), validatedData);

    } catch (error) {
        console.error('Error en el guardado:', error);
    }
}

const create = async (validatedData: any) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}publications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedData),
        });

        if (!res.ok) {
            throw new Error('Error al crear la Publicacion: ' + res.statusText);
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        throw error; // Opcional: lanzar el error para manejarlo más arriba
    }
};

const update = async (id: string, validatedData: any) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}publications/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedData),
        });
        if (!res.ok) {
            throw new Error('Error al actualizar la Publicacion: ' + res.statusText);
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error; // Opcional: lanzar el error para manejarlo más arriba
    }
};
const save = async (id: string, validatedData: any) => {
    if (id == "null") {
        return await create(validatedData);
    } else {
        return await update(id, validatedData);
    }
};
