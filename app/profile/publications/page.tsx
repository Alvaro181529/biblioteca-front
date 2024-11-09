"use client"
import { Publication } from "@/app/dashboard/publications/Interface/Interface";
import { ComponentPagination } from "@/components/Pagination/Pagination";
import { Card } from "flowbite-react";
import { useEffect, useState } from "react";

export default function PublicacionsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [size, setSize] = useState(10);
    const [isExpanded, setIsExpanded] = useState(false)
    const { data, pages } = FetchData(currentPage, size)
    const maxLength = 100
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div>
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.map((publication, index) => {
                    const displayContent = isExpanded
                        ? publication.publication_content
                        : publication.publication_content.slice(0, maxLength) + '...'

                    return (
                        <Card key={index} imgSrc={String(publication.publication_imagen || "/svg/placeholder.svg")} imgAlt={publication?.publication_title}
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