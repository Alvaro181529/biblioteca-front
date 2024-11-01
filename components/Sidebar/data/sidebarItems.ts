// data/sidebarItems.ts
import { HiChartPie, HiArrowSmRight, HiTable } from 'react-icons/hi';
import { BiSolidPiano, BiSolidCategory, BiSolidBookBookmark } from 'react-icons/bi';
import { MdPublic, MdPerson, MdPerson4, MdHome } from "react-icons/md";
import { FaBookOpenReader } from "react-icons/fa6";
import { ImBooks } from "react-icons/im";
import { SidebarItemGroup } from '../types/sidebarItems'; // Ajusta la ruta según tu estructura

export const adminItems: SidebarItemGroup = [

    { href: "/dashboard", icon: HiChartPie, label: "Dashboard" },
    { href: "/dashboard/books", icon: ImBooks, label: "Inventario" },
    { href: "/dashboard/instruments", icon: BiSolidPiano, label: "Instrumentos" },
    { href: "/dashboard/categories", icon: BiSolidCategory, label: "Categorias" },
    { href: "/dashboard/publications", icon: MdPublic, label: "Publicaciones" },
    { href: "/dashboard/authors", icon: MdPerson4, label: "Autores" },
    { href: "/dashboard/users", icon: MdPerson, label: "Usuarios" },
    { href: "#", icon: HiArrowSmRight, label: "Sign In" },
    { href: "#", icon: HiTable, label: "Sign Up" },
];

export const personalItems: SidebarItemGroup = [
    { href: "/profile", icon: MdHome, label: "Inicio" },
    { href: "/profile/orders", icon: FaBookOpenReader, label: "Mis prestamos" },
    { href: "/profile/history", icon: BiSolidBookBookmark, label: "Historial" },
];
