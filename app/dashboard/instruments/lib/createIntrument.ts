"use server"
import { z } from "zod"
const IntrumentSchema = z.object({
    instrument_name: z.optional(z.string()),
    instrument_family: z.optional(z.string()),
    id: z.optional(z.string())
})

export async function createInstrument(formData: FormData) {
    const data = {
        id: formData.get("id") || "null",
        instrument_name: String(formData.get("instrument_name")) || null,
        instrument_family: String(formData.get("instrument_family")) || null,
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}instruments`, {
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}instruments/${id}`, {
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
