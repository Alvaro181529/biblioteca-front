"use client"
import { ComponentCard } from "@/components/Card/Card";
import { ComponentPagination } from "@/components/Pagination/Pagination";
import { ComponentSearch } from "@/components/Search/Search";
import { Accordion, Button, Badge, List } from "flowbite-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const hi = () => {

    }
    return (
        <section>
            <ComponentSearch onChange={hi} size={3} />
        </section>
    )
}
