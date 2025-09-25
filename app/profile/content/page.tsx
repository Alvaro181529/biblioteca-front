"use client"
import { BookFormData } from "@/interface/Interface";
import { ComponentSearch } from "@/components/Search";
import { Button, Card, Select } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { InvoicesCardSkeleton } from "@/components/skeletons";
import { ComponentPagination } from "@/components/Pagination";
import { isValidUrl } from "@/lib/validateURL";
import { LuSettings2 } from "react-icons/lu";
import { BusquedaAvanzada } from "@/utils/busquedaAvanzada";
import { ComponentModalCreate } from '@/components/Modal';

interface SerchParams {
    searchParams: {
        query?: string;
        author?: string;
        instrument?: string;
        category?: string;
        page?: string;
    };
}

export default function ContentPage({ searchParams }: SerchParams) {
    const searchQuery = searchParams?.query || ""
    const searchAuthor = searchParams?.author || ""
    const searchInstrument = searchParams?.instrument || ""
    const searchCategory = searchParams?.category || ""
    const [modalState, setModalState] = useState(true)
    const [title, setTitle] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'view' | 'search'>('create');
    const [currentPage, setCurrentPage] = useState(1);
    const [type, setType] = useState("");
    const [size, setSize] = useState(10);
    const { data, pages } = FetchBooks(size, currentPage, searchQuery, type, searchAuthor, searchCategory, searchInstrument)

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const handleSearch = () => {
        setModalState(false)
        setTitle("Busqueda Avanzada")
        setModalType('search');
        setOpenModal(true);
    };
    const closeModal = () => {
        setModalState(true)
        setOpenModal(false);
        setTitle("Crear Libro")
        setModalType('create');
    };
    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSize = Number(event.target.value)
        setSize(selectedSize);
        setCurrentPage(1);
    };
    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value);
        setCurrentPage(1);
    };
    return (
        <section>
            <div className="grid grid-cols-9 gap-2 md:grid-cols-7">
                <div className="col-span-5 sm:col-span-4">
                    <ComponentSearch onChange={handleSizeChange} size={size} />
                </div>
                <div className='w-full py-2'>
                    <Button aria-label='Ajuste' className='w-full rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-400' onClick={handleSearch}><LuSettings2 className='text-xl text-gray-600' /></Button>
                </div>
                <Select onChange={handleTypeChange} className="col-span-3 py-2 md:col-span-2">
                    <option value="">Todo</option>
                    <option value="LIBRO" > LIBRO</option>
                    <option value="PARTITURA" > PARTITURA</option>
                    <option value="DVD" > DVD</option>
                    <option value="CD" > CD</option>
                    <option value="VHS" > VHS</option>
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
            <ComponentModalCreate title={title} openModal={openModal} setOpenModal={closeModal} status={modalState}>
                {modalType === 'search' && <BusquedaAvanzada></BusquedaAvanzada>}
            </ComponentModalCreate>
        </section>
    )
}
const checkImage = async (book: BookFormData): Promise<string> => {
    const imageUrl = book.book_imagen;
    const fallbackUrl = "/svg/placeholder.svg";

    if (isValidUrl(imageUrl)) {

        return imageUrl;
    }

    const apiUrl = `/api/books/image/${imageUrl || book.book_inventory}`;

    try {
        const res = await fetch(apiUrl);
        // Si no está ok, intentamos parsear JSON solo si el header lo indica
        const contentType = res.headers.get("Content-Type") || "";
        if (contentType.includes("application/json")) {
            const resJson = await res.json();
            if (resJson?.statusCode === 404) {
                return fallbackUrl

            } else {

                return apiUrl
            }
        }
        return apiUrl
    } catch (error) {
        console.error("Error al verificar la imagen:", error);
        return fallbackUrl
    }
};
const CardBook = ({ data }: { data: BookFormData[] }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [hasNoResults, setHasNoResults] = useState(false);
    const [validatedImages, setValidatedImages] = useState<string[]>([]);

    useEffect(() => {
        const validateAllImages = async () => {
            if (!data || data.length === 0) return;

            const results = await Promise.all(data.map((book) => checkImage(book)));
            setValidatedImages(results);
        };

        validateAllImages();
    }, [data]);
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
                <p className="text-gray-600 dark:text-gray-400">No hay resultados disponibles.</p>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
            {data?.map((book, index) => {
                const imageSrc = validatedImages[index] || "/svg/placeholder.svg";
                return (
                    <Card
                        key={index}
                        className="w-full cursor-pointer"
                        imgSrc={imageSrc}
                        onClick={() => router.push(`content/${book.id} `)}
                    >
                        <div className="flex w-full items-center justify-between">
                            <h5 className="truncate text-lg font-bold tracking-tight text-gray-900 dark:text-white max-sm:text-sm">
                                {book.book_title_original || "Titulo del libro"}
                            </h5>
                            <div>
                                {book.book_quantity > 0 ? (
                                    <div className="flex items-center">
                                        <p className="text-green-500 max-sm:hidden">Disponible</p>
                                        <span className="ml-2 size-3 rounded-full bg-green-500"></span>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <p className="text-red-500 max-sm:hidden">No disponible</p>
                                        <span className="ml-2 size-3 rounded-full bg-red-500"></span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="capitalize text-gray-700 dark:text-gray-400 max-sm:text-sm">
                            <span className="font-semibold">Tipo: </span> {book.book_type}
                        </p>

                        <p className="font-normal text-gray-700 dark:text-gray-400 max-sm:text-sm">
                            <span className="font-semibold">Autor: </span>
                            {book.book_authors?.map((author, index) => (
                                <p key={index}>{author.author_name}</p>
                            ))}
                        </p>

                        <p className="font-normal text-gray-700 dark:text-gray-400 max-sm:text-sm">
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
const FetchBooks = (size: number, currentPage: number, search: string, type: string, author: string, category: string, instrument: string) => {
    const parts = search.split(',');
    const [data, setData] = useState<BookFormData[]>([])
    const [pages, setPages] = useState(0)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `/api/books?type=${type}&page=${currentPage}&size=${size}&query=${search}&author=${author}&instrument=${instrument}&category=${category}`;
                const res = await fetch(url);
                const result = await res.json();

                setData(result.data);
                setPages(result.totalPages)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [type, currentPage, size, search, author, category, instrument])
    return { data, pages }
}