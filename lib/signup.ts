"use server"
import { z } from "zod"
const rolesPermitidos = ['USUARIO EXTERNO', 'ADMIN', 'COLEGIAL', 'ESTUDIANTIL', 'ESTUDIANTE', 'DOCENTE', 'ROOT'] as const
const IntrumentSchema = z.object({
    id: z.optional(z.string()),
    name: z.optional(z.string()),
    email: z.optional(z.string()),
    password: z.optional(z.string()),
    rols: z.optional(z.enum(rolesPermitidos)),
})

export async function signup(formData: FormData) {
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
        await create(validatedData);
    } catch (error) {
        console.error('Error en el guardado:', error);
    }
}
const create = async (validatedData: any) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}users/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedData),
        });

        if (!res.ok) {
            throw new Error('Error al crear el usuario: ' + res.statusText);
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
