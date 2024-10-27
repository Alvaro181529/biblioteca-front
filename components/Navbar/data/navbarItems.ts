// data/navbarItems.ts
import { NavbarItem } from '../types/navbarItems'; // Ajusta la ruta según tu estructura

export const adminItems: NavbarItem[] = [
    { href: "/dashboard/analytics", label: "Analiticas" },
    { href: "/dashboard/contents", label: "Contenido" },
    { href: "/dashboard/orders", label: "Prestamos" },
    { href: "/contact", label: "Contact" }
];

export const personalItems: NavbarItem[] = [
    { href: "/personal", label: "Personal" },
    { href: "/personal/kanban", label: "Kanban" },
    { href: "/personal/inbox", label: "Inbox" },
    { href: "/personal/users", label: "Users" },
    { href: "/personal/products", label: "Products" }
];
