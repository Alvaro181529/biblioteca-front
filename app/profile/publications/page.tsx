"use client"
import { Publication } from "@/interface/Interface";
import { ComponentPagination } from "@/components/Pagination";
import { Card } from "flowbite-react";
import { useEffect, useState } from "react";
import { isValidUrl } from "@/lib/validateURL";

export default function PublicacionsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [size, setSize] = useState(10);
    const [expandedIndex, setExpandedIndex] = useState(null);  // Estado para saber qué publicación está expandida
    const { data, pages } = FetchData(currentPage, size)
    const maxLength = 20
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const truncateContent = (content: string, wordLimit: number) => {
        if (!content) {
            return "No hay Contenido";
        }

        const words = content.split(" ");
        const contentWord = words.length > wordLimit
            ? `${words.slice(0, wordLimit).join(" ")} ...`
            : content;
        return <div dangerouslySetInnerHTML={{ __html: contentWord }} />;
    };


    return (
        <div>
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {data.map((publication, index) => {
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
                                {publication.publication_content.length > maxLength && (
                                    <a
                                        href={"/blog/" + String(publication?.id)}
                                        className="inline cursor-pointer font-medium text-verde-600 no-underline decoration-solid underline-offset-2 hover:underline dark:text-verde-500"
                                    >
                                        {truncateContent(publication.publication_content, 10)}
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