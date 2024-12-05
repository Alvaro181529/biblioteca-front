export interface Author {
    id: number;
    author_name: string;
    author_biografia: string;
}

export interface Categories {
    id: number;
    category_name: string;
    category_description: string;
}

export interface Instrument {
    id: number;
    instrument_name: string;
    instrument_family: string;
}

export interface Orders {
    id: number;
    order_at: Date;
    order_regresado_at: Date;
    order_status: string;
    user: User;
    books: BookFormData[];
}

export interface Category {
    id: number;
    category_name: string;
    category_description: string;
}

export interface Content {
    id: number;
    content_sectionTitleParallel: string;
    content_sectionTitle: string;
    content_pageNumber: number;
}
export interface Respuest {
    success: boolean
    message: string
    description?: string
}
export interface BookFormData {
    id: number;
    book_imagen: string;
    book_document: string;
    book_inventory: string;
    book_editorial: string;
    book_isbn: string;
    book_title_original: string;
    book_title_parallel: string;
    book_observation: string;
    book_location: string;
    book_acquisition_date: Date; // O Date si prefieres manejarlo como un objeto Date
    book_price_type: string;
    book_original_price: number;
    book_price_in_bolivianos: number;
    book_language: string;
    book_type: string;
    book_description: string;
    book_condition: 'BUENO' | 'REGULAR' | 'MALO'; // Ajusta según tu enumeración
    book_quantity: number;
    book_includes: string[];
    book_headers: string[];
    book_contents: Content[];
    book_category: Category[];
    book_authors: Author[];
    book_instruments: Instrument[];
    book_create_at: Date;
    statusCode?: number;
}
export interface Publication {
    id: number;
    publication_imagen: string;
    publication_title: string;
    publication_content: string;
    publication_importance: string;
    publication_active: boolean;
    publication_update_at: Date;
}
export interface User {
    id: number;
    name: string,
    email: string,
    password: string,
    active: boolean,
    rols: string,
    created_At: string,
    update_At: string,
    register: Register,
}

interface Register {
    id: string,
    register_ci: string,
    register_contact: string,
    register_ubication: string,
    register_professor: string,
    register_category: [],
    register_intrument: [],
    register_liked: [],
}
