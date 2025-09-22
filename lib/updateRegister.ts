"use server"
import { getTokenFromSession } from "@/app/api/utils/auth";
import { z } from "zod";

const bookSchema = z.object({
    register_ci: z.optional(z.string()),
    register_contact: z.optional(z.number()),
    register_ubication: z.optional(z.string()),
    register_category: z.optional(z.array(z.string())),
    register_intrument: z.optional(z.array(z.string())),
    register_professor: z.optional(z.string()),
});

export async function updateRegister(formData: FormData) {
    const exp = String(formData.get('register_exp'));
    const ci = String(formData.get('register_ci'));

    // Obtener todos los valores de register_category como un array
    const registerCategory = formData.getAll('register_category') as string[];  // Asegurarse de que sea un array
    const registerInstrument = formData.getAll('register_intrument') as string[];  // Asegurarse de que sea un array

    const data = {
        register_ci: `${ci} - ${exp}` || "null",
        register_contact: Number(formData.get('register_contact')) || 0,
        register_ubication: formData.get('register_ubication') || "null",
        // register_category: registerCategory.length > 0 ? registerCategory : [],  // Asegurarse de que siempre sea un array
        register_category: [],  // Asegurarse de que siempre sea un array
        register_intrument: registerInstrument.length > 0 ? registerInstrument : [],  // Asegurarse de que siempre sea un array
        register_professor: formData.get('register_professor') || "null",
    };
    const validatedData = bookSchema.parse(data);

    try {
        return await update(validatedData);
    } catch (error) {
        return { success: false, message: 'Error al registrar' };
    }
}

const update = async (validatedData: any) => {
    const token = await getTokenFromSession();
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}registers/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(validatedData),
        });

        const result = await res.json();
        if (!res.ok) {
            return { success: false, message: 'No se pudo registrar la información' };
        }
        return { success: true, message: 'Información registrada correctamente' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al registrar la información' };
    }
};
