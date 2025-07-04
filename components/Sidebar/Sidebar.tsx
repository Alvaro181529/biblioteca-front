"use client";

import { Sidebar, Spinner } from "flowbite-react";
import { SidebarItem, SidebarItemGroup } from "./types/sidebarItems";
import { adminItems, personalItems, professorItems } from "./data/sidebarItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarContentProps {
    items: SidebarItemGroup;
}
export function ComponentSidebar({ rol }: { rol: string }) {
    const [rols, setRols] = useState<SidebarItem[]>([]);
    useEffect(() => {
        if (rol === 'ROOT' || rol === 'ADMIN') {
            setRols(adminItems);
        } else if (rol === 'DOCENTE') {
            setRols(professorItems);
        } else {
            setRols(personalItems);
        }
    }, [rol]);
    return (
        <Sidebar aria-label="Sidebar" className="z-40 h-screen -translate-x-full transition-transform max-md:hidden md:translate-x-0 ">
            <SidebarContent items={rols} />
        </Sidebar>
    )
}

function SidebarContent({ items }: SidebarContentProps) {
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
                    <Sidebar.Item as={Link} key={idx} href={item.href} icon={item.icon} className={`${pathname === item.href ? "bg-verde-100 hover:bg-verde-100 dark:bg-gray-600" : ""}`} onClick={() => handleClick(item.href)}>
                        <div className="flex w-full items-center justify-between">
                            <span className="mr-2">{item.label}</span>
                            {loading === item.href && <Spinner color="success" aria-label="Success spinner example" size="sm" />}
                        </div>
                    </Sidebar.Item>
                ))}
            </Sidebar.ItemGroup>
        </Sidebar.Items >
    );
}
