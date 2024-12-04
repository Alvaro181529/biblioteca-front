"use client"
import { Avatar, Button, DarkThemeToggle, Dropdown, Navbar, useThemeMode } from "flowbite-react";
import { HiSun, HiMoon } from "react-icons/hi";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ComponentNavbar() {
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const pathname = usePathname();
    console.log(pathname);
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollTop = window.scrollY;
            if (currentScrollTop > lastScrollTop) {
                setIsNavbarVisible(false);
            } else {
                setIsNavbarVisible(true);
            }
            setLastScrollTop(currentScrollTop);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollTop]);
    return (
        <Navbar className={`fixed top-0 z-50 m-1 w-[calc(100%-.5rem)] rounded-xl bg-verde-700 text-white transition-transform duration-300 ease-in-out sm:w-[calc(100%-.3rem)] ${isNavbarVisible ? 'translate-y-0' : '-translate-y-20'}`} rounded >
            <Navbar.Brand >
                <Navbar.Toggle className="text-white hover:bg-verde-600" />
                <Image alt="concer_logo" src="/imagenes/logo_cpm.png" className="mr-1" width={40} height={40} />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white md:text-xl">Biblioteca</span>
            </Navbar.Brand>
            <div className="flex md:order-2">
                <NavbarDropdown />
            </div>
            <Navbar.Collapse>
                <Navbar.Link href="/" as={Link} className={`text-amarillo-50 hover:text-amarillo-200 ${pathname == "/" ? "text-amarillo-300  dark:text-white" : ""}`} >
                    Inicio
                </Navbar.Link>
                <Navbar.Link href="/content" as={Link} className={`text-amarillo-50 hover:text-amarillo-200 ${pathname == "/content" ? "text-amarillo-300 dark:text-white" : ""}`} >Contentido</Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}

function NavbarDropdown() {
    type Role = 'ADMIN' | 'ROOT' | 'USUARIO' | 'ESTUDIANTE';

    const { data: session, status } = useSession()
    const { mode, toggleMode } = useThemeMode();
    const [textMode, setTextMode] = useState(mode === "dark" ? "Modo Claro" : "Modo Oscuro");
    const ModeToggle = () => {
        toggleMode();
        setTextMode(mode === "dark" ? "Modo Oscuro" : "Modo Claro");
    }
    if (status === "unauthenticated") {
        return (
            <div className="flex gap-2">
                <DarkThemeToggle className="text-white ring-verde-400 hover:bg-verde-600 hover:text-amber-100 "></DarkThemeToggle>
                <Button
                    aria-label="Iniciar sesion"
                    className="bg-verde-600 text-white ring-verde-400 transition-colors duration-200 hover:bg-verde-500 hover:text-amber-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:ring-gray-600"
                    onClick={() => signIn()}
                >
                    Iniciar sesión
                </Button>
            </div>
        )
    }

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
    )
}