"use server"
import { getTokenFromSession } from "@/app/api/utils/auth";
import { Respuest } from "@/interface/Interface";
import { z } from "zod"
const IntrumentSchema = z.object({
    category_name: z.optional(z.string()),
    category_description: z.optional(z.string()),
    id: z.optional(z.string())
})

export async function createCategory(formData: FormData): Promise<Respuest> {
    const data = {
        id: formData.get("id") || "null",
        category_name: String(formData.get("category_name")) || null,
        category_description: String(formData.get("category_description")) || null,
    }
    const validatedData = IntrumentSchema.parse(data);
    try {
        return await save(String(data.id), validatedData);

    } catch (error) {
        return { success: false, message: 'Error al crear la categoria' };
    }
}

const create = async (validatedData: any): Promise<Respuest> => {
    const token = await getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(validatedData),
        });
        const result = await res.json()

        if (!res.ok) {
            return { success: false, message: 'No se pudo añadir la categoria' };
        }
        return { success: true, message: 'Categoria añadida exitosamente' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al añadir la categoria' };
    }
};

const update = async (id: string, validatedData: any): Promise<Respuest> => {
    const token = await getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}categories/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(validatedData),
        });
        const result = await res.json();
        if (!res.ok) {
            return { success: false, message: 'No se pudo añadir la categoria' };
        }
        return { success: true, message: 'Categoria actualizada correctamente' };

    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al actualizar la categoria' };
    }
};
const save = async (id: string, validatedData: any) => {
    if (id == "null") {
        return await create(validatedData);
    } else {
        return await update(id, validatedData);
    }
};