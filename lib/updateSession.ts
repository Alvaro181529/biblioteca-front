"use server"
import { getTokenFromSession } from "@/app/api/utils/auth";
import { Respuest } from "@/interface/Interface";

import { z } from "zod"

const userSchema = z.object({
    id: z.optional(z.string().nullable()),
    name: z.optional(z.string().nullable()),
    email: z.optional(z.string().nullable()),
})
const passSchema = z.object({
    currentPassword: z.optional(z.string().nullable()),
    newPassword: z.optional(z.string().nullable()),
    confirmedPassword: z.optional(z.string().nullable()),
})
export async function updateSession(formData: FormData): Promise<Respuest> {
    const data = {
        id: formData.get('id') || null,
        name: formData.get('name') || null,
        email: formData.get('email') || null,
    }
    const validatedData = userSchema.parse(data);
    const id = validatedData?.id || ""
    try {
        return await update(validatedData, id);
    } catch (error) {
        return { success: false, message: 'Error con el usuario' };
    }
}
export async function updatePass(formData: FormData): Promise<Respuest> {
    const data = {
        currentPassword: formData.get('password-current') || null,
        newPassword: formData.get('password-new') || null,
        confirmedPassword: formData.get('password-confirmed') || null,
    }
    const validatedData = passSchema.parse(data);
    try {
        return await updatePassword(validatedData);
    } catch (error) {
        return { success: false, message: 'Error con la contraseña' };
    }
}

const update = async (validatedData: any, id: string): Promise<Respuest> => {
    const token = await getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(validatedData),
        });
        const result = await res.json();
        if (!res.ok) {
            return { success: false, message: 'No se pudo actualizar el usuario ' };
        }
        return { success: true, message: 'Usuario actualizado correctamente' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al actualizar el usuario' };
    }
};
const updatePassword = async (validatedData: any): Promise<Respuest> => {
    const token = await getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}users/update-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(validatedData),
        });
        const result = await res.json();
        if (!res.ok) {
            return { success: false, message: 'No se pudo actualizar la contraseña' };
        }
        return { success: true, message: 'Contraseña actualizada correctamente' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al actualizar la constraseña' };
    }
};