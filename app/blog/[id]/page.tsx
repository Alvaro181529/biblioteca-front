"use client"
import { MdCalendarToday } from "react-icons/md";
import { useEffect, useState } from "react";
import { Publication } from "@/interface/Interface";
import Image from "next/image";
import { Badge } from "flowbite-react";
import { isValidUrl } from "@/lib/validateURL";
export default function PublicationPage({ params }: { params: { id: number } }) {
    const { data } = usePublicationData(params.id)
    const imageUrl = String(data?.publication_imagen);
    const imageSrc = isValidUrl(imageUrl)
        ? imageUrl // Si es una URL válida, usamos la URL
        : imageUrl && imageUrl.toLowerCase() !== "null"  // Si no es "null", pero no es una URL válida, entonces usamos la ruta de la API
            ? `/api/publications/image/${imageUrl}`
            : "";  // Si no hay imagen, usamos el placeholder
    const importanceColorMap: { [key: string]: string } = {
        'ALTO': 'failure',
        'MEDIO': 'warning',
        'BAJO': 'indigo',
    };
    const badgeColor = importanceColorMap[String(data?.publication_importance)] || 'default'; // Fallback a 'default'
    const publicationDate = data?.publication_update_at ? new Date(data.publication_update_at) : null;

    return (
        <article className="mx-2 overflow-hidden dark:text-white sm:mx-5 sm:rounded-lg sm:px-5 sm:shadow-lg">
            {
                imageSrc != '' && (
                    <Image
                        src={imageSrc}
                        alt={String(data?.publication_title)}
                        width={800}
                        height={400}
                        className="aspect-[3/2] h-auto w-full object-contain"
                    />
                )
            }
            <div className="p-6">
                <h1 className="mb-4 text-3xl font-bold">{data?.publication_title}</h1>
                <div className="mb-4 flex items-center text-gray-500 dark:text-gray-400">
                    <MdCalendarToday className="mr-2 size-4" />wha
                    <span className="mr-4">{formatDate(publicationDate)}</span>
                </div>
                <hr className="my-4 mb-5 border-t border-gray-400" />
                <div
                    className="prose mt-6 max-w-none"
                    dangerouslySetInnerHTML={{ __html: data?.publication_content || '' }}
                />

                <div className="mt-6 flex items-center justify-between">
                    <Badge color={badgeColor} className="rounded-2xl">
                        {data?.publication_importance}
                    </Badge>
                    {!data?.publication_active && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">Inactivo</span>
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