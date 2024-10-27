"use server";
import { z } from "zod";

var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImVtYWlsIjoiYWxqYWtAeHpjY3p4Y3pjYy5jb20iLCJpYXQiOjE3Mjk4OTcwNzMsImV4cCI6MTcyOTkwMDY3M30.cnxmyOxm0DEEDNkkTsO06IWHUmyMtfmz6ljQptMdi4Q"

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
    console.log('Datos a enviar:', validatedData);
    try {
        await create(validatedData);

    } catch (error) {
        console.error('Error en el guardado:', error);
    }
}

const create = async (validatedData: any) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Añade el token aquí
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
