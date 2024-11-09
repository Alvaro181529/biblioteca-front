"use client"
import { ComponentCard } from "@/components/Card/Card";
import { ComponentPagination } from "@/components/Pagination/Pagination";
import { ComponentSearch } from "@/components/Search/Search";
import { Accordion, Button, Badge, List, Card } from "flowbite-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {

    return (
        <section>
            <CardInfo></CardInfo>
        </section>
    )
}

const CardInfo = () => {
    return (
        <Card>
            <h5>Este es el card</h5>
        </Card>
    )
}