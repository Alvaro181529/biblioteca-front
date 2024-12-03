"use server";
import { getTokenFromSession } from "@/app/api/utils/auth";
import { z } from "zod";

const orderSchema = z.object({
    orders: z.array(z.object({
        id: z.number(),
    })),
    userId: z.number(),
});

export async function createOrder(formData: FormData) {
    const data = {
        orders: [
            { id: Number(formData.get("book")) || null } // Asegúrate de convertir a número
        ],
        userId: Number(formData.get("id")) || null, // Asegúrate de convertir a número
    };

    const validatedData = orderSchema.parse(data);
    try {
        await create(validatedData);

    } catch (error) {
        console.error('Error en el guardado:', error);
    }
}

const create = async (validatedData: any) => {
    const token = await getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(validatedData),
        });

        if (!res.ok) {
            const errorBody = await res.text(); // O res.json() si esperas un JSON
            throw new Error(`Error al crear el instrumento: ${res.statusText} - ${errorBody}`);
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        throw error; // Opcional: lanzar el error para manejarlo más arriba
    }
};
