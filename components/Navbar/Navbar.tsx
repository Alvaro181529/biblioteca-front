
"use client";

import { Avatar, Dropdown, Navbar } from "flowbite-react";
import Image from "next/image";
import { NavbarItem } from "./types/navbarItems";
import { adminItems, personalItems } from "./data/navbarItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
interface NavbarLinksProps {
    items: NavbarItem[];
}
export function ComponentNavbar({ rol }: { rol: boolean }) {
    const isRoot = rol; // Cambia a tu lógica real para determinar el estado
    return (
        <Navbar fluid className="bg-verde-700 text-white dark:bg-gray-900">
            <Navbar.Toggle className="text-white hover:bg-verde-600" />
            <Navbar.Brand href="https://www.coplumu.edu.bo/">
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
    return (
        <Dropdown
            arrowIcon={false}
            inline
            label={
                <Avatar alt="User settings" img="" rounded />
            }
        >
            <Dropdown.Header>
                <span className="block text-sm">Bonnie Green</span>
                <span className="block truncate text-sm font-medium">name@flowbite.com</span>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
    )
}

