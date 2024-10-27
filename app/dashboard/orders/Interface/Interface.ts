import { BookFormData } from "../../books/Interface/Interface"

interface user {
    name: string,
    email: string
}
interface Books {
    book_title_original: string,
    book_title_parallel: string
}
export interface Orders {
    id: number,
    order_at: Date,
    order_regresado_at: Date,
    order_status: string,
    user: user,
    books: BookFormData[]
}