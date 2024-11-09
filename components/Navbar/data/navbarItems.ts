// data/navbarItems.ts
import { NavbarItem } from '../types/navbarItems'; // Ajusta la ruta según tu estructura

export const adminItems: NavbarItem[] = [
    { href: "/dashboard/analytics", label: "Analiticas" },
    { href: "/dashboard/contents", label: "Contenido" },
    { href: "/dashboard/orders", label: "Prestamos" },
    { href: "/contact", label: "Contact" }
];

export const personalItems: NavbarItem[] = [
    { href: "/profile/content", label: "Contenido" },
    { href: "/profile/history", label: "Historial" },
    { href: "/profile/settings", label: "Ajustes" },
    { href: "/profile/products", label: "Products" }
];
