"use server"
import { getTokenFromSession } from "@/app/api/utils/auth";

import { z } from "zod"

const bookSchema = z.object({
    register_ci: z.optional(z.string()),
    register_contact: z.optional(z.number()),
    register_ubication: z.optional(z.string()),
    register_category: z.optional(z.array(z.string())),
    register_intrument: z.optional(z.array(z.string())),
    register_professor: z.optional(z.string()),
})
export async function updateRegister(formData: FormData) {
    const exp = String(formData.get('register_exp'))
    const ci = String(formData.get('register_ci'))
    const data = {
        register_ci: `${ci} - ${exp}` || "null",
        register_contact: Number(formData.get('register_contact')) || 0,
        register_ubication: formData.get('register_ubication') || "null",
        register_category: formData.get('register_category') || [],
        register_intrument: formData.get('register_intrument') || [],
        register_professor: formData.get('register_professor') || "null",
    }
    const validatedData = bookSchema.parse(data);
    try {
        return await update(validatedData);
    } catch (error) {
        return { success: false, message: 'Error al registrar' };
    }
}

const update = async (validatedData: any) => {
    const token = await getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}registers/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(validatedData),
        });
        const result = await res.json();
        if (!res.ok) {
            return { success: false, message: 'No se pudo registar la informacion' };
        }
        return { success: true, message: 'Informacion registrada correctamente' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al registrar la informacion' };
    }
};