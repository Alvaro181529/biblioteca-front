"use client"
import { MdCalendarToday } from "react-icons/md";
import { useEffect, useState } from "react";
import { Publication } from "../Interface/Interface";
import Image from "next/image";
import { Badge } from "flowbite-react";

export default function PublicationPage({ params }: { params: { id: number } }) {
    const { data } = usePublicationData(params.id)
    const importanceColorMap: { [key: string]: string } = {
        'ALTO': 'failure',
        'MEDIO': 'warning',
        'BAJO': 'indigo',
    };
    const badgeColor = importanceColorMap[String(data?.publication_importance)] || 'default'; // Fallback a 'default'
    const publicationDate = data?.publication_update_at ? new Date(data.publication_update_at) : null;

    return (
        <article className="mx-5 overflow-hidden rounded-lg shadow-lg">
            {
                data?.publication_imagen != "null" && (
                    <Image
                        src={String(data?.publication_imagen || "/svg/placeholder.svg")}
                        alt={String(data?.publication_title)}
                        width={800}
                        height={400}
                        className="h-auto w-full object-cover"
                    />
                )
            }
            <div className="p-6">
                <h1 className="mb-4 text-3xl font-bold">{data?.publication_title}</h1>
                <div className="mb-4 flex items-center text-gray-500">
                    <MdCalendarToday className="mr-2 size-4" />
                    <span className="mr-4">{formatDate(publicationDate)}</span>
                </div>
                <div className="prose max-w-none">
                    <p>{data?.publication_content}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                    <Badge color={badgeColor} className="rounded-2xl">
                        {data?.publication_importance}
                    </Badge>
                    {!data?.publication_active && (
                        <span className="text-sm text-gray-500">Inactivo</span>
                    )}
                </div>
            </div>
        </article>
    )
}
const formatDate = (date: Date | null) => {
    if (!date) return 'Fecha no disponible';
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const usePublicationData = (id: number) => {
    const [data, setData] = useState<Publication | null>(null);
    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const url = `/api/publications/${id}`;
                    const res = await fetch(url);
                    const result = await res.json();
                    setData(result)
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchData();
        }
    }, [id])
    return { data }
}