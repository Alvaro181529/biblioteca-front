"use client"
import { Publication } from "@/interface/Interface";
import { ComponentPagination } from "@/components/Pagination";
import { Card } from "flowbite-react";
import { useEffect, useState } from "react";
import { isValidUrl } from "@/lib/validateURL";

export default function PublicacionsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [size, setSize] = useState(10);
    const [isExpanded, setIsExpanded] = useState(null)
    const { data, pages } = FetchData(currentPage, size)
    const maxLength = 20
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const toggleExpand = (index: any) => {
        setIsExpanded(isExpanded === index ? null : index);  // Si la publicación está expandida, la colapsamos, si no, la expandimos
    }


    return (
        <div>
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.map((publication, index) => {
                    const isCurrentlyExpanded = isExpanded === index;  // Verificamos si esta publicación está expandida
                    const displayContent = isCurrentlyExpanded
                        ? publication.publication_content
                        : publication.publication_content.slice(0, maxLength) + '...'
                    const imageUrl = String(publication?.publication_imagen);
                    const imageSrc = isValidUrl(imageUrl)
                        ? imageUrl // Si es una URL válida, usamos la URL
                        : imageUrl && imageUrl.toLowerCase() !== "null"  // Si no es "null", pero no es una URL válida, entonces usamos la ruta de la API
                            ? `/api/publications/image/${imageUrl}`
                            : "/svg/placeholder.svg";  // Si no hay imagen, usamos el placeholder
                    return (
                        <Card key={index} className="dark:text-white" imgSrc={imageSrc} imgAlt={publication?.publication_title}
                        >
                            <h2 className="mb-2 text-xl font-bold">{publication?.publication_title}</h2>
                            <div className="prose max-w-none">
                                <p>{displayContent}</p>
                                {publication.publication_content.length > maxLength && (
                                    <a
                                        onClick={toggleExpand}
                                        className="inline cursor-pointer font-medium text-verde-600 no-underline decoration-solid underline-offset-2 hover:underline dark:text-verde-500"
                                    >
                                        {isExpanded ? 'Ver menos' : 'Ver más'}
                                    </a>
                                )}
                            </div>
                        </Card>
                    )
                })}
            </section>
            <ComponentPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={pages} />
        </div>

    )
}
const FetchData = (currentPage: number, size: number) => {
    const [data, setData] = useState<Publication[]>([])
    const [pages, setPages] = useState(0)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `/api/publications?page=${currentPage}&size=${size}`;
                const res = await fetch(url);
                const result = await res.json();
                setData(result.data || []);
                setPages(result.totalPages || 0)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();

    }, [currentPage, size])
    return { data, pages }
}