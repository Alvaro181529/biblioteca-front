"use client"
import { BookFormData } from "@/interface/Interface";
import { ComponentSearch } from "@/components/Search";
import { Card, Select } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { InvoicesCardSkeleton } from "@/components/skeletons";
import { ComponentPagination } from "@/components/Pagination";
import { isValidUrl } from "@/lib/validateURL";
interface SerchParams {
    searchParams: {
        query?: string;
        page?: string;
    };
}
export default function ContentPage({ searchParams }: SerchParams) {
    const searchQuery = searchParams?.query || ""
    const [currentPage, setCurrentPage] = useState(1);
    const [type, setType] = useState("");
    const [size, setSize] = useState(10);
    const { data, pages } = FetchBooks(size, currentPage, searchQuery, type)

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSize = Number(event.target.value)
        setSize(selectedSize);
        setCurrentPage(1);
    };
    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value);
        setCurrentPage(1); // Reinicia a la primera página si cambias el tipo
    };
    return (
        <section>
            <div className="grid grid-cols-9 gap-2 md:grid-cols-7">
                <div className="col-span-6 md:col-span-5">
                    <ComponentSearch onChange={handleSizeChange} size={size} />
                </div>
                <Select onChange={handleTypeChange} className="col-span-3 py-2 md:col-span-2">
                    <option value="">Todo</option>
                    <option value="LIBRO" > LIBRO</option>
                    <option value="PARTITURA" > PARTITURA</option>
                    <option value="DVD" > DVD</option>
                    <option value="CD" > CD</option>
                    <option value="CASSETTE" > CASSETTE</option>
                    <option value="TESIS" > TESIS</option>
                    <option value="REVISTA" > REVISTA</option>
                    <option value="EBOOK" > EBOOK</option>
                    <option value="AUDIO" > AUDIO</option>
                    <option value="PROYECTOS" > PROYECTOS</option>
                    <option value="OTRO" > OTRO</option>
                </Select>
            </div>
            <CardBook data={data} />
            <ComponentPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={pages} />
        </section>
    )
}

const CardBook = ({ data }: { data: BookFormData[] }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [hasNoResults, setHasNoResults] = useState(false);

    useEffect(() => {
        if (!data || data.length === 0) {
            const timer = setTimeout(() => {
                setHasNoResults(true);
                setIsLoading(false);
            }, 1500);
            return () => clearTimeout(timer);
        } else {
            setIsLoading(false);
            setHasNoResults(false);
        }
    }, [data]);

    if (isLoading) {
        return <InvoicesCardSkeleton />;
    }

    if (hasNoResults) {
        return (
            <Card className="col-span-full">
                <p className="text-gray-600">No hay resultados disponibles.</p>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
            {data?.map((book, index) => {
                const imageUrl = String(book?.book_imagen);
                const imageSrc = isValidUrl(imageUrl)
                    ? imageUrl // Si es una URL válida, usamos la URL
                    : imageUrl && imageUrl.toLowerCase() !== "null"  // Si no es "null", pero no es una URL válida, entonces usamos la ruta de la API
                        ? `/api/books/image/${imageUrl}`
                        : "/svg/placeholder.svg";  // Si no hay imagen, usamos el placeholder

                return (
                    <Card
                        key={index}
                        className="w-full cursor-pointer"
                        imgSrc={imageSrc}
                        onClick={() => router.push(`content/${book.id} `)}

                    >
                        <div className="flex w-full items-center justify-between">
                            <h5 className="truncate text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {book.book_title_original || "Titulo del libro"}
                            </h5>
                            <div>
                                {book.book_quantity > 0 ? (
                                    <div className="flex items-center">
                                        <p className="text-green-500">Disponible</p>
                                        <span className="ml-2 size-3 rounded-full bg-green-500"></span>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <p className="text-red-500">No disponible</p>
                                        <span className="ml-2 size-3 rounded-full bg-red-500"></span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            <span className="font-semibold">Tipo: </span> {book.book_type}
                        </p>

                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            <span className="font-semibold">Autor: </span>
                            {book.book_authors?.map((author, index) => (
                                <p key={index}>{author.author_name}</p>
                            ))}
                        </p>

                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            <span className="font-semibold">Categoría: </span>
                            {book.book_category?.map((category, index) => (
                                <p key={index}>{category.category_name}</p>
                            ))}
                        </p>
                    </Card>
                )
            })}
        </div>
    );
}
const FetchBooks = (size: number, currentPage: number, query: string, type: string) => {
    const [data, setData] = useState<BookFormData[]>([])
    const [pages, setPages] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `/api/books?type=${type}&page=${currentPage}&size=${size}&query=${query}`;
                const res = await fetch(url);
                const result = await res.json();

                setData(result.data);
                setPages(result.totalPages)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [type, currentPage, size, query])
    return { data, pages }
}