"use client"
import { Card, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { BookFormData } from "@/interface/Interface";
import { useRouter } from "next/navigation";
import { InvoicesCardSkeleton } from "@/components/skeletons";
import { isValidUrl } from "@/lib/validateURL";
interface SerchParams {
    searchParams: {
        query?: string;
        page?: string;
    };
}
export default function DashboardPage({ searchParams }: SerchParams) {

    return (
        <section>
            <h2 className="mb-4 text-lg font-semibold dark:text-white md:text-2xl">Recomendados para ti</h2>
            <CardInfo />

            <h2 className="mb-4 text-lg font-semibold dark:text-white md:text-2xl">Nuevas adquisiciones</h2>
            <CardNew />
        </section>
    )
}

const CardNew = () => {
    const router = useRouter();
    const { data } = FetchDataBookNew();
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
        return (
            <section className="overflow-x-auto pb-4">
                <InvoicesCardSkeleton />
            </section>
        );
    }
    if (hasNoResults) {
        return (
            <Card className="col-span-full">
                <p className="text-gray-600 dark:text-gray-400">No hay resultados disponibles.</p>
            </Card>
        )
    }
    return (
        <div>
            <section className="flex space-x-4 overflow-x-auto pb-4 hover:cursor-grab">
                {Array.isArray(data) && data?.map((book, index) => {
                    const imageUrl = String(book?.book_imagen);
                    const imageSrc = isValidUrl(imageUrl)
                        ? imageUrl
                        : imageUrl && imageUrl.toLowerCase() !== "null"
                            ? `/api/books/image/${imageUrl}`
                            : "/svg/placeholder.svg";
                    return (
                        <Card
                            key={index}
                            imgSrc={String(imageSrc)}
                            className="w-[240px] shrink-0 cursor-pointer"
                            onClick={() => router.push(`profile/content/${book.id}`)}>
                            <div className="flex w-full items-center justify-between">
                                <h5 className="truncate text-sm font-bold tracking-tight text-gray-900 dark:text-white sm:text-xl">
                                    {book.book_title_original || "Titulo del libro"}
                                </h5>
                                <div>
                                    {book.book_quantity > 0 ? (
                                        <Tooltip content="Disponible">
                                            <div className="flex items-center">
                                                <span className="ml-2 size-3 rounded-full bg-green-500"></span>
                                            </div>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip content="No disponible">
                                            <div className="flex items-center">
                                                <span className="ml-2 size-3 rounded-full bg-red-500"></span>
                                            </div>
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">{new Date(book.book_create_at).toLocaleDateString()}</p>

                            <p className="text-xs font-normal text-gray-700 dark:text-gray-400 md:text-lg">
                                <span className="font-semibold">Autor: </span>
                                {book.book_authors?.map((author, index) => (
                                    <p key={index}>{author.author_name}</p>
                                ))}
                            </p>

                            <p className="text-xs font-normal text-gray-700 dark:text-gray-400 md:text-lg">
                                <span className="font-semibold">Categoría: </span>
                                {book.book_category?.map((category, index) => (
                                    <p key={index}>{category.category_name}</p>
                                ))}
                            </p>
                        </Card>
                    )
                })}
            </section>
        </div>
    )
}
const CardInfo = () => {
    const router = useRouter();
    const { data } = FetchDataBook();
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
        return (
            <section className="overflow-x-auto pb-4">
                <InvoicesCardSkeleton />
            </section>
        );
    }
    if (hasNoResults) {
        return (
            <Card className="col-span-full">
                <p className="text-gray-600 dark:text-gray-400">No hay resultados disponibles.</p>
            </Card>
        )
    }
    return (
        <div>
            <section className="flex space-x-4 overflow-x-auto pb-4 hover:cursor-grab">
                {Array.isArray(data) && data?.map((book, index) => {
                    const imageUrl = String(book?.book_imagen);
                    const imageSrc = isValidUrl(imageUrl)
                        ? imageUrl
                        : imageUrl && imageUrl.toLowerCase() !== "null"
                            ? `/api/books/image/${imageUrl}`
                            : "/svg/placeholder.svg";
                    return (
                        <Card
                            key={index}
                            imgSrc={String(imageSrc)}
                            className="w-[240px] shrink-0 cursor-pointer"
                            onClick={() => router.push(`profile/content/${book.id}`)}>
                            <div className="flex w-full items-center justify-between">
                                <h5 className="truncate text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {book.book_title_original || "Titulo del libro"}
                                </h5>
                                <div>
                                    {book.book_quantity > 0 ? (
                                        <Tooltip content="Disponible">
                                            <div className="flex items-center">
                                                <span className="ml-2 size-3 rounded-full bg-green-500"></span>
                                            </div>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip content="No disponible">
                                            <div className="flex items-center">
                                                <span className="ml-2 size-3 rounded-full bg-red-500"></span>
                                            </div>
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
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
            </section>
        </div>
    )
}

const FetchDataBook = () => {
    const [data, setData] = useState<BookFormData[] | []>([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `/api/users/recomendation`;
                const res = await fetch(url);
                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    return { data }
}

const FetchDataBookNew = () => {
    const [data, setData] = useState<BookFormData[] | []>([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `/api/books/news`;
                const res = await fetch(url);
                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    return { data }
}