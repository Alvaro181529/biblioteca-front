"use server";
import { getTokenFromSession } from "@/app/api/utils/auth";
import { Respuest } from "@/interface/Interface";
import { z } from "zod";

const orderSchema = z.object({
    orders: z.array(z.object({
        id: z.number(),
    })),
    userId: z.number(),
});

export async function createOrder(formData: FormData): Promise<Respuest> {
    const data = {
        orders: [
            { id: Number(formData.get("book")) || null } // Asegúrate de convertir a número
        ],
        userId: Number(formData.get("id")) || null, // Asegúrate de convertir a número
    };

    const validatedData = orderSchema.parse(data);
    try {
        return await create(validatedData);
    } catch (error) {
        return { success: false, message: 'Error en la solicitud de prestamo' };

    }
}

const create = async (validatedData: any): Promise<Respuest> => {
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
        const result = await res.json()
        console.log(result);
        if (!res.ok) {
            return { success: false, message: 'No se pudo realizar la solicitud del prestamo' };
        }
        return { success: true, message: 'Solicitud de prestamo realizada ' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error en la solicitud de prestamo' };
    }
};
