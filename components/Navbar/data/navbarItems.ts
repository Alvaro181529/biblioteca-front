// data/navbarItems.ts
import { NavbarItem } from '../types/navbarItems'; // Ajusta la ruta según tu estructura

export const adminItems: NavbarItem[] = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/books", label: "Inventario" },
    { href: "/dashboard/instruments", label: "Instrumentos" },
    { href: "/dashboard/categories", label: "Categorias" },
    { href: "/dashboard/publications", label: "Publicaciones" },
    { href: "/dashboard/authors", label: "Autores" },
    { href: "/dashboard/users", label: "Usuarios" },
    { href: "/dashboard/analytics", label: "Analiticas" },
    { href: "/dashboard/contents", label: "Contenido" },
    { href: "/dashboard/orders", label: "Prestamos" },
];

export const personalItems: NavbarItem[] = [
    { href: "/profile", label: "Inicio" },
    { href: "/profile/content", label: "Contenido" },
    { href: "/profile/history", label: "Historial" },
    { href: "/profile/products", label: "Products" },
    { href: "/profile/publications", label: "Publicaciones" },
];
