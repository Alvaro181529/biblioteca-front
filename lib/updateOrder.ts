"use server"

import { getTokenFromSession } from "@/app/api/utils/auth";
import { Respuest } from "@/interface/Interface";
import { z } from "zod"
type State = 'CANCELADO' | 'PRESTADO' | 'DEVUELTO';

const orderSchema = z.object({
    order_status: z.enum(['CANCELADO', 'PRESTADO', 'DEVUELTO']),
});

export async function orderBorrowed(id: number, state: string): Promise<Respuest> {
    const data = {
        order_status: state,
    }
    const validatedData = orderSchema.parse(data);
    try {
        return await save(id, validatedData.order_status, validatedData)
    } catch (error) {
        return { success: false, message: 'Error en el prestamo' };
    }
}

const save = async (id: number, state: State, validatedData: any): Promise<Respuest> => {
    const stateHandlers: Record<State, (id: number, validatedData: any) => Promise<Respuest>> = {
        CANCELADO: handleCancelado,
        PRESTADO: handlePrestado,
        DEVUELTO: handleDevuelto,
    };

    const handler = stateHandlers[state];

    if (handler) {
        return await handler(id, validatedData);
    } else {
        return { success: false, message: `Estado desconocido: ${state}` }
    }
};

const handleCancelado = async (id: number, validatedData: any): Promise<Respuest> => {
    const token = await getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}orders/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(validatedData),
        });
        const result = await res.json()

        if (!res.ok) {
            return { success: false, message: 'No se pudo cancelar ' };
        }
        return { success: true, message: 'La solicitud fue cancelada' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error en la solicitud de cancelado' };
    }
};

const handlePrestado = async (id: number, validatedData: any): Promise<Respuest> => {
    const token = await getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}orders/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Añade el token aquí
            },
            body: JSON.stringify(validatedData),
        });
        const result = await res.json()
        if (!res.ok) {
            return { success: false, message: 'No se pudo realizar la solicitud del prestamo ' };
        }
        return { success: true, message: 'Solicitud del prestamo realizada' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error en la solicitud de prestamo' };
    }
};
const handleDevuelto = async (id: number, validatedData: any): Promise<Respuest> => {
    const token = await getTokenFromSession()
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}orders/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Añade el token aquí
            },
            body: JSON.stringify(validatedData),
        });
        const result = await res.json()
        if (!res.ok) {
            return { success: false, message: 'No se pudo hacer la devolucion ' };
        }
        return { success: true, message: 'La devolucion fue correcta' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error en la devolucion' };
    }
};