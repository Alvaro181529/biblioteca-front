
"use client";

import { Avatar, Dropdown, Navbar, useThemeMode } from "flowbite-react";
import Image from "next/image";
import { NavbarItem } from "./types/navbarItems";
import { HiSun, HiMoon } from "react-icons/hi";
import { adminItems, personalItems } from "./data/navbarItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Orders } from "@/interface/Interface";
interface NavbarLinksProps {
    items: NavbarItem[];
}

export function ComponentNavbar({ rol }: { rol: boolean }) {
    const isRoot = rol; // Cambia a tu lógica real para determinar el estado
    return (
        <Navbar fluid className="bg-verde-700 text-white dark:bg-gray-900">
            <Navbar.Toggle className="text-white hover:bg-verde-600" />
            <Navbar.Brand href={"/"}>
                <Image alt="concer_logo" src="/imagenes/logo_cpm.png" className="mr-1" width={40} height={40} />
                <span className="self-center whitespace-nowrap text-xl font-semibold">Biblioteca</span>
            </Navbar.Brand>
            <div className="flex md:order-2">
                <NavbarDropdown />
            </div>
            <NavbarLinks items={isRoot ? adminItems : personalItems} />
        </Navbar>
    );
}
export function NavbarLinks({ items }: NavbarLinksProps) {
    const pathname = usePathname();
    return (
        <Navbar.Collapse>
            {items.map((item, idx) => (
                <Navbar.Link
                    as={Link}
                    key={idx}
                    href={item.href}
                    className={`rounded-lg border-none text-white hover:text-amarillo-200 focus:text-amarillo-100 max-md:hover:bg-verde-600 md:hidden ${pathname == item.href ? "text-amarillo-200 hover:text-amarillo-200" : ""}`}
                >
                    {item.label}
                </Navbar.Link>
            ))}
        </Navbar.Collapse>
    );
}
function NavbarDropdown() {
    type Role = 'ADMIN' | 'ROOT' | 'USUARIO EXTERNO' | 'ESTUDIANTE' | 'ESTUDIANTIL' | 'COLEGIAL' | 'DOCENTE';
    const { data: session, status } = useSession()
    const { mode, toggleMode, setMode } = useThemeMode();
    const [textMode, setTextMode] = useState(mode === "dark" ? "Modo Claro" : "Modo Oscuro");
    const user = session?.user?.name
    const email = session?.user?.email
    const rol = session?.user?.rols as Role | undefined; // Asegúrate de que rol es de tipo Role o undefined

    const [data, setData] = useState<Orders[]>([]);
    const [notifications, setNotifications] = useState(0); // Número de notificaciones como ejemplo

    useEffect(() => {
        const fetchData = async () => {
            const url = `/api/orders/admin?state=ESPERA`;
            const res = await fetch(url);
            const result = await res.json();
            setData(result.data ? result.data : []);
        }
        if (data.length === 0) {
            fetchData();
        }
        setNotifications(data.length);
    }, [data]);
    const ModeToggle = () => {
        toggleMode();
        setTextMode(mode === "dark" ? "Modo Oscuro" : "Modo Claro");
    }
    const roleToHref = {
        ADMIN: "/dashboard",
        ROOT: "/dashboard",
        'USUARIO EXTERNO': "/profile",
        ESTUDIANTE: "/profile",
        ESTUDIANTIL: "/profile",
        COLEGIAL: "/profile",
        DOCENTE: "/profile",
    };
    const settingToHref = {
        ADMIN: "/dashboard/settings",
        ROOT: "/dashboard/settings",
        'USUARIO EXTERNO': "/profile/settings",
        ESTUDIANTE: "/profile/settings",
        ESTUDIANTIL: "/profile/settings",
        COLEGIAL: "/profile/settings",
        DOCENTE: "/profile/settings",
    };
    const Dashboard = rol && rol in roleToHref ? roleToHref[rol] : "/";
    const Setting = rol && rol in settingToHref ? settingToHref[rol] : "/";

    return (
        <Notification rol={rol} notifications={notifications}>
            <Dropdown
                arrowIcon={false}
                inline
                label={
                    <Avatar alt="User settings" img="" rounded />
                }
            >
                <Dropdown.Header>
                    <span className="block text-sm">{user}</span>
                    <span className="block truncate text-sm font-medium">{email}</span>
                </Dropdown.Header>
                <Dropdown.Item as={Link} href="#" onClick={ModeToggle} className="flex items-center justify-between">
                    {textMode}

                    {mode === "dark" ? (
                        <HiSun className="ml-2" />
                    ) : (
                        <HiMoon className="ml-2" />
                    )}
                </Dropdown.Item>
                <Dropdown.Item
                    as={Link}
                    href={Dashboard}
                >
                    Inicio
                </Dropdown.Item>
                < Dropdown.Item as={Link} href={Setting}>Ajustes</Dropdown.Item >
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => signOut()}>Cerrar sesión</Dropdown.Item>
            </Dropdown >
        </Notification>
    )
}

function Notification({ children, rol, notifications }: { children?: React.ReactNode, rol?: string, notifications: number }) {

    return (
        <div
            className="relative inline-flex items-center rounded-lg text-sm text-white hover:bg-verde-600 focus:outline-none focus:ring-2 focus:ring-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-label="Notificaciones"
        >
            {children}
            {(rol === 'ADMIN' || rol === 'ROOT') && notifications > 0 && (
                <span
                    className="absolute right-0 top-0 -mr-2 -mt-2 inline-flex size-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white"
                >
                    {notifications}
                </span>
            )}
        </div>
    );
}
