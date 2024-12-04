"use server"
import { getTokenFromSession } from "@/app/api/utils/auth"
import { Respuest } from "@/interface/Interface"
import { z } from "zod"
const rolesPermitidos = ['USUARIO EXTERNO', 'ADMIN', 'COLEGIAL', 'ESTUDIANTIL', 'ESTUDIANTE', 'DOCENTE', 'ROOT'] as const
const IntrumentSchema = z.object({
    id: z.optional(z.string()),
    name: z.optional(z.string()),
    email: z.optional(z.string()),
    password: z.optional(z.string()),
    rols: z.optional(z.enum(rolesPermitidos)),
})

export async function createUser(formData: FormData): Promise<Respuest> {
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

    if (!rolesPermitidos.includes(data.rols as typeof rolesPermitidos[number])) {
        update.rols = 'USUARIO EXTERNO';
        data.rols = 'USUARIO EXTERNO';
    }

    const validatedData = IntrumentSchema.parse(data);
    const validatedUpdate = IntrumentSchema.parse(update);
    try {
        return await save(String(data.id), validatedData, validatedUpdate);
    } catch (error) {
        return { success: false, message: 'Error al crear el usuario' };

    }
}
const create = async (validatedData: any): Promise<Respuest> => {
    const token = await getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(validatedData),
        });

        const result = await res.json()
        if (!res.ok) {
            return { success: false, message: 'No se pudo añadir el usuario' };
        }
        return { success: true, message: 'Usuario añadido correctamente' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al añadir el usuario' };
    }
};

const update = async (id: string, validatedData: any): Promise<Respuest> => {
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

        const result = await res.json()
        if (!res.ok) {
            return { success: false, message: 'No se pudo actualizar el usuario' };
        }
        return { success: true, message: 'Usuario actualizado correctamente' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al actualizar el usuario' };
    }
};
const save = async (id: string, validatedData: any, validatedUpdate: any) => {
    if (id == "null") {
        return await create(validatedData);
    } else {
        return await update(id, validatedUpdate);
    }
};