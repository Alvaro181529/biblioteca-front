"use client";

import { Sidebar, Spinner, Tooltip } from "flowbite-react";
import { SidebarItem, SidebarItemGroup } from "./types/sidebarItems";
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import { adminItems, personalItems, professorItems, rootItems } from "./data/sidebarItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarContentProps {
    items: SidebarItemGroup;
    collapsed: boolean;
}

export function ComponentSidebar({ rol }: { rol: string }) {
    const [rols, setRols] = useState<SidebarItem[]>([]);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        if (rol === 'ROOT') {
            setRols(rootItems);
        } else if (rol === 'ADMIN') {
            setRols(adminItems);
        } else if (rol === 'DOCENTE') {
            setRols(professorItems);
        } else {
            setRols(personalItems);
        }
    }, [rol]);

    return (
        <Sidebar
            aria-label="Sidebar"
            className={`z-40 h-screen shadow-lg shadow-black transition-transform max-md:hidden md:translate-x-0 ${collapsed ? 'w-20' : 'w-64'}`}
        >
            <button
                onClick={() => setCollapsed(!collapsed)}
                className={`fixed top-4 z-50 rounded-full border-none bg-gray-200 p-2 text-gray-500 shadow-xl transition-all duration-300 hover:bg-gray-300 dark:bg-gray-500 dark:text-gray-300 ${collapsed ? "left-14" : "left-56"
                    }`}
            >
                {collapsed ? <FaRegArrowAltCircleRight className="text-xl" /> : <FaRegArrowAltCircleLeft className="text-xl" />}
            </button>
            <SidebarContent items={rols} collapsed={collapsed} />
        </Sidebar>
    );
}

function SidebarContent({ items, collapsed }: SidebarContentProps) {
    const pathname = usePathname();
    const [loading, setLoading] = useState<string | null>(null);

    const handleClick = (href: string) => {
        setLoading(href);
        setTimeout(() => {
            setLoading(null);
        }, 2000);
    };

    return (
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                {items.map((item, idx) => (
                    collapsed ? (
                        <Tooltip key={idx} content={item.label} className="" placement="right">
                            <Sidebar.Item
                                as={Link}
                                key={idx}
                                href={item.href}
                                icon={item.icon}
                                className={`${pathname === item.href ? "bg-verde-100 hover:bg-verde-100 dark:bg-gray-600" : ""}`}
                                onClick={() => handleClick(item.href)}
                            >
                                <div className="flex w-full items-center justify-between">
                                    <span className="mr-1 hidden transition-all duration-200">
                                        {item.label}
                                    </span>
                                    {loading === item.href && <Spinner color="success" aria-label="Success spinner example" size="sm" />}
                                </div>
                            </Sidebar.Item>
                        </Tooltip>
                    ) : (
                        <Sidebar.Item
                            as={Link}
                            key={idx}
                            href={item.href}
                            icon={item.icon}
                            className={`${pathname === item.href ? "bg-verde-100 hover:bg-verde-100 dark:bg-gray-600" : ""}`}
                            onClick={() => handleClick(item.href)}
                        >
                            <div className="flex w-full items-center justify-between">
                                <span className="mr-1 inline transition-all duration-200">
                                    {item.label}
                                </span>
                                {loading === item.href && <Spinner color="success" aria-label="Success spinner example" size="sm" />}
                            </div>
                        </Sidebar.Item>

                    )))}
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    );
}
