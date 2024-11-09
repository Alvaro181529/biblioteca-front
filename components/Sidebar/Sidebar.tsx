"use client";

import { Sidebar } from "flowbite-react";
import { SidebarItemGroup } from "./types/sidebarItems";
import { adminItems, personalItems } from "./data/sidebarItems";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarContentProps {
    items: SidebarItemGroup;
}
export function ComponentSidebar({ rol }: { rol: boolean }) {
    const isRoot = rol;
    return (
        <Sidebar aria-label="Sidebar" className="z-40 h-screen -translate-x-full transition-transform max-md:hidden md:translate-x-0 ">
            <SidebarContent items={isRoot ? adminItems : personalItems} />
        </Sidebar>
    )
}

function SidebarContent({ items }: SidebarContentProps) {
    const pathname = usePathname();
    return (
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                {items.map((item, idx) => (
                    <Sidebar.Item as={Link} key={idx} href={item.href} icon={item.icon} className={`${pathname === item.href ? "bg-verde-100 hover:bg-verde-100 dark:bg-gray-600" : ""}`} >
                        {item.label}
                    </Sidebar.Item>
                ))}
            </Sidebar.ItemGroup>
        </Sidebar.Items >
    );
}
