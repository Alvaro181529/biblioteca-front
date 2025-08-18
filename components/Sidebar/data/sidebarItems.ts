// data/sidebarItems.ts
import { HiChartPie } from 'react-icons/hi';
import { BiSolidPiano, BiSolidCategory, BiSolidBookBookmark } from 'react-icons/bi';
import { MdPublic, MdPerson, MdPerson4, MdHome, MdNewspaper, MdAccountBalanceWallet } from "react-icons/md";
import { FaThLarge } from "react-icons/fa";
import { BsFileEarmarkMusicFill } from "react-icons/bs";
import { FaBookOpenReader } from "react-icons/fa6";
import { ImBooks } from "react-icons/im";
import { SidebarItemGroup } from '../types/sidebarItems'; // Ajusta la ruta según tu estructura

export const rootItems: SidebarItemGroup = [
    { href: "/dashboard", icon: MdHome, label: "Dashboard" },
    { href: "/dashboard/books", icon: ImBooks, label: "Inventario" },
    { href: "/dashboard/instruments", icon: BiSolidPiano, label: "Instrumentos" },
    { href: "/dashboard/categories", icon: BiSolidCategory, label: "Categorias" },
    { href: "/dashboard/publications", icon: MdPublic, label: "Publicaciones" },
    { href: "/dashboard/authors", icon: MdPerson4, label: "Autores" },
    { href: "/dashboard/users", icon: MdPerson, label: "Usuarios" },
    { href: "/dashboard/analytics", icon: HiChartPie, label: "Datos y Tendencias" },
    { href: "/dashboard/contents", icon: FaThLarge, label: "Contenido" },
    { href: "/dashboard/orders", icon: FaBookOpenReader, label: "Prestamos" },
    { href: "/dashboard/logs", icon: MdAccountBalanceWallet, label: "Registro del sistema" },
];

export const adminItems: SidebarItemGroup = [
    { href: "/dashboard", icon: MdHome, label: "Dashboard" },
    { href: "/dashboard/books", icon: ImBooks, label: "Inventario" },
    { href: "/dashboard/instruments", icon: BiSolidPiano, label: "Instrumentos" },
    { href: "/dashboard/categories", icon: BiSolidCategory, label: "Categorias" },
    { href: "/dashboard/publications", icon: MdPublic, label: "Publicaciones" },
    { href: "/dashboard/authors", icon: MdPerson4, label: "Autores" },
    { href: "/dashboard/users", icon: MdPerson, label: "Usuarios" },
    { href: "/dashboard/analytics", icon: HiChartPie, label: "Datos y Tendencias" },
    { href: "/dashboard/contents", icon: FaThLarge, label: "Contenido" },
    { href: "/dashboard/orders", icon: FaBookOpenReader, label: "Prestamos" },
];

export const personalItems: SidebarItemGroup = [
    { href: "/profile", icon: MdHome, label: "Inicio" },
    { href: "/profile/content", icon: ImBooks, label: "Contenido" },
    { href: "/profile/publications", icon: MdNewspaper, label: "Publicaciones" },
    { href: "/profile/orders", icon: FaBookOpenReader, label: "Mis prestamos" },
    { href: "/profile/history", icon: BiSolidBookBookmark, label: "Historial" },
];
export const professorItems: SidebarItemGroup = [
    { href: "/profile", icon: MdHome, label: "Inicio" },
    { href: "/profile/content", icon: ImBooks, label: "Contenido" },
    { href: "/profile/publications", icon: MdNewspaper, label: "Publicaciones" },
    { href: "/profile/orders", icon: FaBookOpenReader, label: "Mis prestamos" },
    { href: "/profile/history", icon: BiSolidBookBookmark, label: "Historial" },
    { href: "/profile/pieces", icon: BsFileEarmarkMusicFill, label: "Subir obra" },
];
