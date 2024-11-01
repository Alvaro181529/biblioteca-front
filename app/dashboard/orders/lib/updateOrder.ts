"use server"

import { getTokenFromSession } from "@/app/api/utils/auth";
import { z } from "zod"
type State = 'CANCELADO' | 'PRESTADO' | 'DEVUELTO';

const orderSchema = z.object({
    order_status: z.enum(['CANCELADO', 'PRESTADO', 'DEVUELTO']),
});

export async function orderBorrowed(id: number, state: string) {
    const data = {
        order_status: state,
    }
    const validatedData = orderSchema.parse(data);
    try {
        await save(id, validatedData.order_status, validatedData)
    } catch (error) {

    }
}

const save = async (id: number, state: State, validatedData: any) => {
    const stateHandlers: Record<State, (id: number, validatedData: any) => Promise<void>> = {
        CANCELADO: handleCancelado,
        PRESTADO: handlePrestado,
        DEVUELTO: handleDevuelto,
    };

    const handler = stateHandlers[state];

    if (handler) {
        await handler(id, validatedData);
    } else {
        console.error(`Estado desconocido: ${state}`);
    }
};

const handleCancelado = async (id: number, validatedData: any) => {
    const token = getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}orders/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Añade el token aquí
            },
            body: JSON.stringify(validatedData),
        });

        if (!res.ok) {
            const errorBody = await res.text(); // O res.json() si esperas un JSON
            throw new Error(`Error al actualizar el estado: ${res.statusText} - ${errorBody}`);
        }
        console.log(res);
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const handlePrestado = async (id: number, validatedData: any) => {
    const token = getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}orders/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Añade el token aquí
            },
            body: JSON.stringify(validatedData),
        });

        if (!res.ok) {
            const errorBody = await res.text(); // O res.json() si esperas un JSON
            throw new Error(`Error al actualizar el estado: ${res.statusText} - ${errorBody}`);
        }
        console.log(res);
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const handleDevuelto = async (id: number, validatedData: any) => {
    const token = getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}orders/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Añade el token aquí
            },
            body: JSON.stringify(validatedData),
        });

        if (!res.ok) {
            const errorBody = await res.text(); // O res.json() si esperas un JSON
            throw new Error(`Error al actualizar el estado: ${res.statusText} - ${errorBody}`);
        }
        console.log(res);
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};