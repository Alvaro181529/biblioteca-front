"use client"
import { Publication, Respuest } from "@/interface/Interface";
import { z } from "zod"
const IntrumentSchema = z.object({
    file: z.instanceof(File).nullable(),
    publication_title: z.optional(z.string()),
    publication_content: z.optional(z.string()),
    publication_importance: z.optional(z.string()),
    publication_imagen: z.optional(z.string()).nullable(),
    publication_active: z.optional(z.boolean()),
    id: z.optional(z.string())
})

export async function createPublication(formData: FormData, token?: string): Promise<Respuest> {
    const data = {
        id: formData.get("id") || "null",
        file: formData.get("file") || null,
        publication_title: String(formData.get("publication_title")) || "null",
        publication_content: String(formData.get("publication_content")) || "null",
        publication_importance: String(formData.get("publication_importance")) || "null",
        publication_imagen: String(formData.get("publication_imagen")) || null,
        publication_active: Boolean(formData.get("publication_active") === "true") || false,
    }
    const validatedData = IntrumentSchema.parse(data);
    try {
        return await save(String(data.id), validatedData, token || "");
    } catch (error) {
        return { success: false, message: 'Error al crear la publicacion' };
    }
}

const create = async (validatedData: any, token: string): Promise<Respuest> => {

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}publications`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: validatedData
        });

        const result: Publication = await res.json()
        if (!res.ok) {
            return { success: false, message: 'No se pudo añadir la publicacion' };
        }
        return { success: true, message: 'Publicacion añadida correctamente', description: result.publication_title };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al añadir la publicacion' };
    }
};

const update = async (id: string, validatedData: any, token: string): Promise<Respuest> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}publications/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: validatedData
        });
        const result = await res.json();
        if (!res.ok) {
            return { success: false, message: 'No se pudo añadir la publicacion' };
        }
        return { success: true, message: 'Publicacion actualizada correctamente', description: result.publication_title };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al actualizar la publicacion' };
    }
};
const save = async (id: string, validatedData: any, token: string): Promise<Respuest> => {
    const formData = new FormData();
    for (const key in validatedData) {
        if (validatedData[key] !== null && validatedData[key] !== undefined) {
            formData.append(key, validatedData[key]);
        }
    }
    if (id == "null") {
        return await create(formData, token);
    } else {
        return await update(id, formData, token);
    }
};
