"use server"
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

export async function signup(formData: FormData): Promise<Respuest> {
    const data = {
        id: String(formData.get("id")) || "null",
        name: String(formData.get("name")) || null,
        email: String(formData.get("email")) || null,
        rols: String(formData.get("rols")) || "USUARIO EXTERNO",
        password: String(formData.get("password")) || "null",
    }
    if (!rolesPermitidos.includes(data.rols as typeof rolesPermitidos[number])) {
        data.rols = 'USUARIO EXTERNO';
    }

    const validatedData = IntrumentSchema.parse(data);
    try {
        return await create(validatedData);
    } catch (error) {
        return { success: false, message: 'Error al crear el usuario' };
    }
}
const create = async (validatedData: any): Promise<Respuest> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}users/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedData),
        });
        const result = await res.json()
        if (!res.ok) {
            return { success: false, message: 'No se pudo registrar el usuario', description: result.message };
        }
        return { success: true, message: 'Usuario registrado correctamente', description: result.message };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al registrar el usuario' };
    }
};
