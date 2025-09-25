"use client";
import { BookFormData, Respuest } from "@/interface/Interface";
import { z } from "zod";
const bookSchema = z.object({
    files: z.array(z.instanceof(File)).optional().nullable(),
    id: z.optional(z.string()),
    book_imagen: z.optional(z.string()).nullable(),
    book_document: z.optional(z.string()).nullable(),
    book_inventory: z.optional(z.string()),
    book_isbn: z.optional(z.string()),
    book_title_original: z.string(),
    book_title_parallel: z.optional(z.string()),
    book_observation: z.optional(z.string()),
    book_location: z.optional(z.string()),
    book_acquisition_date: z.optional(z.date()),
    book_price_type: z.optional(z.string()),
    book_original_price: z.optional(z.number()),
    book_language: z.optional(z.string()),
    book_type: z.optional(z.string()),
    book_description: z.optional(z.string()),
    book_condition: z.optional(z.enum(['BUENO', 'REGULAR', 'MALO'])),
    book_quantity: z.optional(z.number()),
    book_includes: z.optional(z.array(z.string())),
    book_headers: z.optional(z.array(z.string())),
    book_category: z.optional(z.array(z.string())),
    book_authors: z.optional(z.array(z.string())),
    book_instruments: z.optional(z.array(z.string())),
    book_editorial: z.optional(z.string()),
});

let token

// Function for creating or updating a book
export async function createBook(formData: FormData, token?: string): Promise<Respuest> {
    const bookHeaders = String(formData.get('book_headers'));
    const bookIncludes = String(formData.get('book_includes'));
    const bookCategory = String(formData.get('book_category_ids'));
    const bookAuthors = String(formData.get('book_authors_ids'));
    const bookInstruments = String(formData.get('book_instruments_ids'));

    const data = {
        files: formData.getAll('files') || null,
        id: formData.get('id') || "null",
        book_imagen: String(formData.get('book_imagen')) || "null",
        book_document: String(formData.get('book_document')) || "null",
        book_inventory: String(formData.get('book_inventory')) || undefined,
        book_editorial: String(formData.get('book_editorial')) || undefined,
        book_isbn: String(formData.get('book_isbn')) || undefined,
        book_title_original: String(formData.get('book_title_original')) || undefined,
        book_title_parallel: String(formData.get('book_title_parallel')) || undefined,
        book_observation: String(formData.get('book_observation')) || undefined,
        book_location: String(formData.get('book_location')) || undefined,
        book_acquisition_date: new Date(formData.get('book_acquisition_date') as string) || undefined,
        book_price_type: String(formData.get('book_price_type')) || undefined,
        book_original_price: parseFloat(formData.get('book_original_price') as string) || undefined,
        book_language: String(formData.get('book_language')) || undefined,
        book_type: String(formData.get('book_type')) || undefined,
        book_description: String(formData.get('book_description')) || undefined,
        book_condition: formData.get('book_condition') || undefined,
        book_quantity: parseInt(formData.get('book_quantity') as string, 10) || undefined,
        book_includes: bookIncludes ? bookIncludes.split(',').map(item => item.trim()) : [],
        book_headers: bookHeaders ? bookHeaders.split(',').map(item => item.trim()) : [],
        book_category: bookCategory ? bookCategory.split(',').map(item => item.trim()) : [],
        book_authors: bookAuthors ? bookAuthors.split(',').map(item => item.trim()) : [],
        book_instruments: bookInstruments ? bookInstruments.split(',').map(item => item.trim()) : [],
    };
    const validatedData = bookSchema.parse(data);

    try {
        return await save(String(data.id), validatedData, token || "");
    } catch (error) {
        return { success: false, message: 'Error al procesar el inventario' };
    }
}

// Function for creating a new book
const create = async (validatedData: any, token?: string): Promise<Respuest> => {
    const formData = new FormData();

    if (Array.isArray(validatedData.files)) {
        validatedData.files.forEach((file: any) => {
            formData.append('files', file);
        });
    }

    for (const key in validatedData) {
        if (key !== 'files' && validatedData[key] !== undefined && validatedData[key] !== null) {
            if (Array.isArray(validatedData[key])) {
                validatedData[key].forEach((item: any) => {
                    formData.append(`${key}[]`, item);
                });
            } else if (key === 'book_acquisition_date' && validatedData[key] instanceof Date) {
                formData.append(key, validatedData[key].toISOString());
            } else {
                formData.append(key, validatedData[key]);
            }
        }
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}books`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Error al crear el libro: ' + res.statusText);
        }

        const result: BookFormData = await res.json();
        return { success: true, message: 'Articulo del inventario añadido correctamente', description: result.book_title_original };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al añadir el articulo del inventario' };
    }
};

// Function for updating an existing book
const update = async (id: string, validatedData: any, token?: string): Promise<Respuest> => {

    const formData = new FormData();
    for (const key in validatedData) {
        if (key !== 'files' && validatedData[key] !== undefined && validatedData[key] !== null) {
            if (Array.isArray(validatedData[key])) {
                validatedData[key].forEach((item: any) => {
                    formData.append(`${key}[]`, item);
                });
            } else if (key === 'book_acquisition_date' && validatedData[key] instanceof Date) {
                formData.append(key, validatedData[key].toISOString());
            } else {
                formData.append(key, validatedData[key]);
            }
        }
    }
    if (Array.isArray(validatedData.files)) {
        validatedData.files.forEach((file: any) => {
            formData.append('files', file);
        });
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}books/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Error al actualizar el libro: ' + res.statusText);
        }

        const result = await res.json();
        return { success: true, message: 'Articulo del inventario actualizado correctamente', description: result.book_title_original };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al actualizar el articulo del inventario' };
    }
};

// Main function for saving the book (either create or update)
const save = async (id: string, validatedData: any, token: string): Promise<Respuest> => {
    if (id === "null") {
        return await create(validatedData, token);
    } else {
        return await update(id, validatedData, token);
    }
};
