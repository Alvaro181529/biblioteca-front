"use server"
import { getTokenFromSession } from "@/app/api/utils/auth"
import { z } from "zod"
const IntrumentSchema = z.object({
    author_name: z.optional(z.string()),
    author_biografia: z.optional(z.string()),
    id: z.optional(z.string())
})

export async function createAuthor(formData: FormData) {
    const data = {
        id: formData.get("id") || "null",
        author_name: String(formData.get("author_name")) || null,
        author_biografia: String(formData.get("author_biografia")) || null,
    }
    const validatedData = IntrumentSchema.parse(data);
    try {
        await save(String(data.id), validatedData);

    } catch (error) {
        console.error('Error en el guardado:', error);
    }
}

const create = async (validatedData: any) => {
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

        if (!res.ok) {
            throw new Error('Error al crear el instrumento: ' + res.statusText);
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        throw error; // Opcional: lanzar el error para manejarlo más arriba
    }
};

const update = async (id: string, validatedData: any) => {
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
        if (!res.ok) {
            throw new Error('Error al actualizar el instrumento: ' + res.statusText);
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
