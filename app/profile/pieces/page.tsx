"use client"
import { useState, useEffect } from 'react';
import { ComponentTable } from "@/components/Table"
import { ComponentModalCreate } from '@/components/Modal';
import { ComponentPagination } from '@/components/Pagination';
import { ComponentSearch } from '@/components/Search';
import { BookFormData } from '@/interface/Interface';
import { FormCreate } from '@/app/dashboard/books/crud/create';
import { FormDelete } from '@/app/dashboard/books/crud/delete';
import { useRouter } from 'next/navigation';
import { Button, Card, Select, Tooltip } from 'flowbite-react';
import { FiRefreshCcw } from "react-icons/fi"
import { BusquedaAvanzada } from '@/utils/busquedaAvanzada';
import { ReportComponent } from '@/components/Report/Report';
import { LuSettings2 } from "react-icons/lu";
import { InvoicesCardSkeleton } from '@/components/skeletons';
import { isValidUrl } from '@/lib/validateURL';
interface SerchParams {
    searchParams: {
        query?: string;
        author?: string;
        instrument?: string;
        category?: string;
        page?: string;
    };
}

export default function Pieces({ searchParams }: SerchParams) {
    const searchQuery = searchParams?.query || ""
    const searchAuthor = searchParams?.author || ""
    const searchInstrument = searchParams?.instrument || ""
    const searchCategory = searchParams?.category || ""
    const [dataUpdate, setDataUpdate] = useState<(string | number)[]>([]);
    const [modalState, setModalState] = useState(true)
    const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'view' | 'search'>('create');
    const [title, setTitle] = useState("Reporte");
    const [actual, setActual] = useState("");
    const [actualData, setActualData] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [type, setType] = useState("");
    const [size, setSize] = useState(10);
    const [refresh, setRefresh] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModalReport, setOpenModalReport] = useState(false);
    const { data, pages } = FetchBooks(size, currentPage, searchQuery, type, searchAuthor, searchCategory, searchInstrument);
    const router = useRouter();
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
    // const handleView = (rowIndex: number) => {
    //     const actualNumber = String(infoData[rowIndex]);
    //     router.push(`books/${actualNumber}`)
    // };
    // const handleEdit = (rowIndex: number) => {
    //     const actualNumber = Number(infoData[rowIndex])
    //     setModalState(true)
    //     setDataUpdate(data[rowIndex]);
    //     setActualData(actualNumber)
    //     setTitle("Editar Libro ")
    //     setModalType('edit');
    //     setOpenModal(true);
    // };
    // const handleSearch = () => {
    //     setModalState(false)
    //     setTitle("Busqueda Avanzada")
    //     setModalType('search');
    //     setOpenModal(true);
    // };
    // const handleDelate = (rowIndex: number) => {
    //     const actualTitle = String(data[rowIndex][3])
    //     const actualNumber = Number(infoData[rowIndex])
    //     setModalState(false)
    //     setActual(actualTitle)
    //     setActualData(actualNumber)
    //     setTitle("Eliminar Libro")
    //     setModalType('delete');
    //     setOpenModal(true);
    // };
    const closeModal = () => {
        setModalState(true)
        setOpenModal(false);
        setTitle("Crear Libro")
        setModalType('create');
    };
    const closeModalReport = () => {
        setModalState(true)
        setOpenModalReport(false);
        setTitle("Reporte")
        //  setModalType('create');
    };
    const Refresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false);
        }, 2800);
    }

    return (
        <div>
            <div className="col-span-3 grid grid-cols-5 gap-x-2 md:grid-cols-8 md:gap-2">
                <div className="col-span-4 md:col-span-7">
                    <ComponentSearch onChange={handleSizeChange} size={size} />
                </div>
                <div className='col-span-1 w-full py-2'>
                    <ComponentModalCreate title={'Reporte de Libros'} openModal={openModalReport} setOpenModal={closeModalReport} status={false}>
                        <ReportComponent report='books'></ReportComponent>
                    </ComponentModalCreate>
                    <Button aria-label="Añadir" className="w-full bg-verde-500 ring-verde-300 hover:bg-verde-600 dark:bg-gray-600 dark:hover:bg-gray-500" onClick={() => setOpenModal(true)}>Añadir</Button>
                </div>
            </div>
            <CardBook data={data} />
            <div className="flex w-full items-center justify-between">
                <Tooltip className="z-50" content="Refrescar">
                    <Button
                        className={`${refresh ? "animate-spin" : ""} m-0 border-none p-0 text-gray-600 ring-0 focus:ring-0 dark:text-gray-300`}
                        aria-label="Actualizar"
                        type="button"
                        onClick={Refresh}
                        size="sm"
                    >
                        {<FiRefreshCcw className="size-5" />}
                    </Button>
                </Tooltip>
                <div className="mx-auto">
                    <ComponentPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={pages} />
                </div>
            </div>
            <ComponentModalCreate title={title} openModal={openModal} setOpenModal={closeModal} status={modalState}>
                {modalType === 'create' && <FormCreate setOpenModal={closeModal} />}
                {modalType === 'edit' && <FormCreate setOpenModal={closeModal} id={actualData} />}
                {modalType === 'delete' && <FormDelete libro={actual} data={actualData} setOpenModal={closeModal} />}
                {modalType === 'search' && <BusquedaAvanzada></BusquedaAvanzada>}
            </ComponentModalCreate>
        </div>
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
                <p className="text-gray-600 dark:text-gray-400">No hay resultados disponibles.</p>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
            {data?.map((book, index) => {
                const imageUrl = String(book?.book_imagen);
                const imageSrc = isValidUrl(imageUrl)
                    ? imageUrl
                    : imageUrl && imageUrl.toLowerCase() !== "null"
                        ? `/api/books/image/${imageUrl}`
                        : "/svg/placeholder.svg";

                return (
                    <Card
                        key={index}
                        className="w-full cursor-pointer"
                        imgSrc={imageSrc}
                        onClick={() => router.push(`content/${book.id} `)}
                    >
                        <div className="flex w-full items-center justify-between">
                            <h5 className="truncate font-bold tracking-tight text-gray-900 dark:text-white max-sm:text-sm md:text-base 2xl:text-lg">
                                {book.book_title_original || "Titulo del libro"}
                            </h5>
                            <div>
                                {book.book_quantity > 0 ? (
                                    <div className="flex items-center">
                                        <p className="text-green-500 max-sm:hidden md:text-xs">Disponible</p>
                                        <span className="ml-2 size-3 rounded-full bg-green-500"></span>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <p className="text-red-500 max-sm:hidden md:text-xs">No disponible</p>
                                        <span className="ml-2 size-3 rounded-full bg-red-500"></span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="capitalize text-gray-700 dark:text-gray-400 max-sm:text-sm md:text-sm">
                            <span className="font-semibold">Tipo: </span> {book.book_type}
                        </p>

                        <p className="font-normal text-gray-700 dark:text-gray-400 max-sm:text-sm md:text-sm">
                            <span className="font-semibold">Autor: </span>
                            {book.book_authors?.map((author, index) => (
                                <p key={index}>{author.author_name}</p>
                            ))}
                        </p>

                        <p className="font-normal text-gray-700 dark:text-gray-400 max-sm:text-sm md:text-sm">
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
                const url = `/api/books/mybooks?type=${type}&page=${currentPage}&size=${size}&query=${search}&author=${author}&instrument=${instrument}&category=${category}`;
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