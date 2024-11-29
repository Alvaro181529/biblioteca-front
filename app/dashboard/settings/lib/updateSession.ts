"use server"
import { getTokenFromSession } from "@/app/api/utils/auth";

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
export async function updateSession(formData: FormData) {
    const data = {
        id: formData.get('id') || null,
        name: formData.get('name') || null,
        email: formData.get('email') || null,
    }
    const validatedData = userSchema.parse(data);
    const id = validatedData?.id || ""
    try {
        await update(validatedData, id);
    } catch (error) {
        console.error('Error en el guardado:', error);
    }
}
export async function updatePass(formData: FormData) {
    const data = {
        currentPassword: formData.get('password-current') || null,
        newPassword: formData.get('password-new') || null,
        confirmedPassword: formData.get('password-confirmed') || null,
    }
    const validatedData = passSchema.parse(data);
    try {
        await updatePassword(validatedData);
    } catch (error) {
        console.error('Error en el guardado:', error);
    }
}

const update = async (validatedData: any, id: string) => {
    const token = await getTokenFromSession()
    console.log(validatedData);
    console.log(id);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(validatedData),
        });
        if (!res.ok) {
            throw new Error('Error al actualizar el email o usuario: ' + res.statusText);
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
const updatePassword = async (validatedData: any) => {
    const token = await getTokenFromSession()
    console.log(token);
    console.log(validatedData);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}users/update-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(validatedData),
        });
        console.log(await res.json());

        if (!res.ok) {
            throw new Error('Error al actualizar la contraseña: ' + res.statusText);
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};