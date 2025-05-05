"use server"
import { getTokenFromSession } from "@/app/api/utils/auth"
import { Author, Respuest } from "@/interface/Interface"
import { z } from "zod"
const IntrumentSchema = z.object({
    author_name: z.optional(z.string()),
    author_biografia: z.optional(z.string()).nullable(),
    id: z.optional(z.string())
})

export async function createAuthor(formData: FormData): Promise<Respuest> {
    const data = {
        id: formData.get("id") || "null",
        author_name: String(formData.get("author_name")) || null,
        author_biografia: String(formData.get("author_biografia")) || null,
    }
    const validatedData = IntrumentSchema.parse(data);
    try {
        return await save(String(data.id), validatedData);
    } catch (error) {
        console.error('Error en el guardado:', error);
        return { success: false, message: 'Error al crear el autor' };
    }
}

const create = async (validatedData: any): Promise<Respuest> => {
    const token = await getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}authors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(validatedData),
        });
        const result: Author = await res.json();
        if (!res.ok) {
            return { success: false, message: 'No se pudo crear el autor' };
        }
        return { success: true, message: 'Autor creado exitosamente', description: result.author_name };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al crear el autor' };
    }
};

const update = async (id: string, validatedData: any): Promise<Respuest> => {
    const token = await getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}authors/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(validatedData),
        });
        const result: Author = await res.json()
        if (!res.ok) {
            return { success: false, message: 'No se pudo crear el autor' };
        }
        return { success: true, message: 'Autor actualizado correctamente', description: result.author_name };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al actualizar el autor' };
    }
};
const save = async (id: string, validatedData: any) => {
    if (id == "null") {
        return await create(validatedData);
    } else {
        return await update(id, validatedData);
    }
};
