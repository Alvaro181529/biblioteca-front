// data/sidebarItems.ts
import { HiChartPie, HiViewBoards, HiInbox, HiUser, HiShoppingBag, HiArrowSmRight, HiTable } from 'react-icons/hi';
import { BiBuoy, BiSolidPiano, BiSolidCategory } from 'react-icons/bi';
import { MdPublic, MdPerson, MdPerson4 } from "react-icons/md";
import { ImBooks } from "react-icons/im";
import { SidebarItemGroup } from '../types/sidebarItems'; // Ajusta la ruta según tu estructura

export const adminItems: SidebarItemGroup = [

    { href: "/dashboard", icon: HiChartPie, label: "Dashboard" },
    { href: "/dashboard/books", icon: ImBooks, label: "Libros" },
    { href: "/dashboard/instruments", icon: BiSolidPiano, label: "Instrumentos" },
    { href: "/dashboard/categories", icon: BiSolidCategory, label: "Categorias" },
    { href: "/dashboard/publications", icon: MdPublic, label: "Publicaciones" },
    { href: "/dashboard/authors", icon: MdPerson4, label: "Autores" },
    { href: "/dashboard/users", icon: MdPerson, label: "Usuarios" },
    { href: "#", icon: HiArrowSmRight, label: "Sign In" },
    { href: "#", icon: HiTable, label: "Sign Up" },
];

export const personalItems: SidebarItemGroup = [
    { href: "#", icon: HiChartPie, label: "Personal" },
    { href: "#", icon: HiViewBoards, label: "Kanban" },
    { href: "#", icon: HiInbox, label: "Inbox" },
    { href: "#", icon: HiUser, label: "Users" },
    { href: "#", icon: HiShoppingBag, label: "Products" },
    { href: "#", icon: HiArrowSmRight, label: "Sign In" },
    { href: "#", icon: HiTable, label: "Sign Up" },
    { href: "#", icon: HiChartPie, label: "Upgrade to Pro" },
    { href: "#", icon: HiViewBoards, label: "Documentation" },
    { href: "#", icon: BiBuoy, label: "Help" }
];
