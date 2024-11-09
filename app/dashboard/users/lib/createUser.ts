"use server"
import { getTokenFromSession } from "@/app/api/utils/auth"
import { z } from "zod"
const IntrumentSchema = z.object({
    id: z.optional(z.string()),
    name: z.optional(z.string()),
    email: z.optional(z.string()),
    password: z.optional(z.string()),
    rols: z.optional(z.enum(['USUARIO EXTERNO', 'ESTUDIANTE'])),
})

export async function createUser(formData: FormData) {
    const data = {
        id: String(formData.get("id")) || "null",
        name: String(formData.get("name")) || null,
        email: String(formData.get("email")) || null,
        rols: String(formData.get("rols")) || "USUARIO EXTERNO",
        password: String(formData.get("password")) || "null",
    }

    const update = {
        id: String(formData.get("id")) || "null",
        name: String(formData.get("name")) || null,
        email: String(formData.get("email")) || null,
        rols: String(formData.get("rols")) || "USUARIO EXTERNO",
    }
    console.log(data);
    if (data.rols !== 'USUARIO EXTERNO' && data.rols !== 'ESTUDIANTE') {
        update.rols = 'USUARIO EXTERNO';
        data.rols = 'USUARIO EXTERNO';
    }
    // if (update.rols !== 'USUARIO EXTERNO' && update.rols !== 'ESTUDIANTE') {
    // }
    const validatedData = IntrumentSchema.parse(data);
    const validatedUpdate = IntrumentSchema.parse(update);

    try {
        await save(String(data.id), validatedData, validatedUpdate);
    } catch (error) {
        console.error('Error en el guardado:', error);
    }
}
const create = async (validatedData: any) => {
    const token = await getTokenFromSession()
    console.log(token);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(validatedData),
        });

        if (!res.ok) {
            throw new Error('Error al crear el usuario: ' + res.statusText);
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(validatedData),
        });
        if (!res.ok) {
            throw new Error('Error al actualizar el usuario: ' + res.statusText);
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error; // Opcional: lanzar el error para manejarlo más arriba
    }
};
const save = async (id: string, validatedData: any, validatedUpdate: any) => {
    if (id == "null") {
        return await create(validatedData);
    } else {
        return await update(id, validatedUpdate);
    }
};