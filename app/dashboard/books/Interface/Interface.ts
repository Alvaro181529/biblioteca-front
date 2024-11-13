interface Category {
    id: number;
    category_name: string;
    category_description: string;
}

interface Author {
    id: number;
    author_name: string;
    author_biografia: string;
}

interface Instrument {
    id: number;
    instrument_name: string;
    instrument_family: string;
}
interface Content {
    id: number,
    content_sectionTitle: string,
    content_pageNumber: number
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
    book_contents: Content[],
    book_category: Category[];
    book_authors: Author[];
    book_instruments: Instrument[];
    statusCode?: number;
}
