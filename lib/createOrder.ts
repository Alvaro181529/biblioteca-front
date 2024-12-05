"use server";
import { getTokenFromSession } from "@/app/api/utils/auth";
import { Orders, Respuest } from "@/interface/Interface";
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

    try {
        const validatedData = orderSchema.parse(data);
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
        const result: Orders = await res.json()
        console.log(result);
        if (!res.ok) {
            return { success: false, message: 'No se pudo realizar el prestamo' };
        }
        return { success: true, message: 'Prestamo realizado a:', description: result.user.name };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error en el prestamo' };
    }
};
