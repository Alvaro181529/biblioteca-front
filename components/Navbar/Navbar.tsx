
"use client";

import { Avatar, Dropdown, Navbar } from "flowbite-react";
import Image from "next/image";
import { NavbarItem } from "./types/navbarItems";
import { adminItems, personalItems } from "./data/navbarItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
interface NavbarLinksProps {
    items: NavbarItem[];
}

export function ComponentNavbar({ rol }: { rol: boolean }) {
    const isRoot = rol; // Cambia a tu lógica real para determinar el estado
    return (
        <Navbar fluid className="bg-verde-700 text-white dark:bg-gray-900">
            <Navbar.Toggle className="text-white hover:bg-verde-600" />
            <Navbar.Brand href={"http://localhost:3000/dashboard"}>
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
                    className={`rounded-lg border-none text-white hover:text-amarillo-200 focus:text-amarillo-100 max-md:hover:bg-verde-600 ${pathname == item.href ? "text-amarillo-200 hover:text-amarillo-200" : ""}`}
                >
                    {item.label}
                </Navbar.Link>
            ))}
        </Navbar.Collapse>
    );
}
function NavbarDropdown() {
    type Role = 'ADMIN' | 'ROOT' | 'USUARIO' | 'ESTUDIANTE';
    const { data: session, status } = useSession()
    const user = session?.user?.name
    const email = session?.user?.email
    const rol = session?.user?.rols as Role | undefined; // Asegúrate de que rol es de tipo Role o undefined

    const roleToHref = {
        ADMIN: "/dashboard",
        ROOT: "/dashboard",
        USUARIO: "/profile",
        ESTUDIANTE: "/profile",
    };
    const settingToHref = {
        ADMIN: "/dashboard/settings",
        ROOT: "/dashboard/settings",
        USUARIO: "/profile/settings",
        ESTUDIANTE: "/profile/settings",
    };
    const Dashboard = typeof rol === 'string' && rol in roleToHref ? roleToHref[rol] : "/";
    const Setting = typeof rol === 'string' && rol in settingToHref ? settingToHref[rol] : "/";

    return (
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
    )
}