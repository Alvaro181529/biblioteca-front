"use server"
import { getTokenFromSession } from "@/app/api/utils/auth";

import { z } from "zod"

const bookSchema = z.object({
    register_ci: z.optional(z.string()),
    register_contact: z.optional(z.string()),
    register_ubication: z.optional(z.string()),
    register_category: z.optional(z.array(z.string())),
    register_intrument: z.optional(z.array(z.string())),
    register_professor: z.optional(z.string()),
})
export async function updateRegister(formData: FormData) {
    const data = {
        register_ci: formData.get('register_ci') || "null",
        register_contact: formData.get('register_contact') || "null",
        register_ubication: formData.get('register_ubication') || "null",
        register_category: formData.get('register_category') || [],
        register_intrument: formData.get('register_intrument') || [],
        register_professor: formData.get('register_professor') || "null",
    }
    console.log(data);
    const validatedData = bookSchema.parse(data);
    try {
        await update(validatedData);
    } catch (error) {
        console.error('Error en el guardado:', error);
    }
}

const update = async (validatedData: any) => {
    const token = await getTokenFromSession()
    console.log(token);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}registers/`, {
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