export interface User {
    id: number;
    name: string,
    email: string,
    password: string,
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
