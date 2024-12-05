"use server"
import { getTokenFromSession } from "@/app/api/utils/auth";
import { Instrument, Respuest } from "@/interface/Interface";
import { z } from "zod"
const IntrumentSchema = z.object({
    instrument_name: z.optional(z.string()),
    instrument_family: z.optional(z.string()),
    id: z.optional(z.string())
})

export async function createInstrument(formData: FormData): Promise<Respuest> {
    const data = {
        id: formData.get("id") || "null",
        instrument_name: String(formData.get("instrument_name")) || null,
        instrument_family: String(formData.get("instrument_family")) || null,
    }
    const validatedData = IntrumentSchema.parse(data);
    try {
        return await save(String(data.id), validatedData);
    } catch (error) {
        return { success: false, message: 'Error al crear el instrumento' };
    }
}


const create = async (validatedData: any): Promise<Respuest> => {
    const token = await getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}instruments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(validatedData),
        });

        const result = await res.json()
        if (!res.ok) {
            return { success: false, message: 'No se pudo añadir el instrumento' };
        }
        return { success: true, message: 'Instrumento añadido exitosamente', description: result.instrument_name };

    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al añadir el instrumento' };
    }
};

const update = async (id: string, validatedData: any): Promise<Respuest> => {
    const token = await getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}instruments/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(validatedData),
        });
        const result: Instrument = await res.json()
        if (!res.ok) {
            return { success: false, message: 'No se pudo actualizar el instrumento' };
        }
        return { success: true, message: 'Instrumento actualizado exitosamente', description: result.instrument_name };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al actualizar el instrumento' };
    }
};
const save = async (id: string, validatedData: any) => {
    if (id == "null") {
        return await create(validatedData);
    } else {
        return await update(id, validatedData);
    }
};
