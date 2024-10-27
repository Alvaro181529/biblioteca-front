"use server"
import { z } from "zod"
const IntrumentSchema = z.object({
    category_name: z.optional(z.string()),
    category_description: z.optional(z.string()),
    id: z.optional(z.string())
})

export async function createCategory(formData: FormData) {
    const data = {
        id: formData.get("id") || "null",
        category_name: String(formData.get("category_name")) || null,
        category_description: String(formData.get("category_description")) || null,
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}categories/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
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