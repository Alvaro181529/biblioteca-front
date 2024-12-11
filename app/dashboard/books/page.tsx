"use client"
import { useState, useEffect, act } from 'react';
import { ComponentTable } from "@/components/Table"
import { ComponentModalCreate } from '@/components/Modal';
import { ComponentPagination } from '@/components/Pagination';
import { ComponentSearch } from '@/components/Search';
import { BookFormData } from '@/interface/Interface';
import { FormCreate } from './crud/create';
import { FormDelete } from './crud/delete';
import { useRouter } from 'next/navigation';
import { Button, Select, Tooltip } from 'flowbite-react';
import { FiRefreshCcw } from "react-icons/fi"
interface SerchParams {
    searchParams: {
        query?: string;
        page?: string;
    };
}

export default function Books({ searchParams }: SerchParams) {
    const searchQuery = searchParams?.query || ""
    const [dataUpdate, setDataUpdate] = useState<(string | number)[]>([]);
    const [modalState, setModalState] = useState(true)
    const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'view'>('create');
    const [title, setTitle] = useState("Crear Libro");
    const [actual, setActual] = useState("");
    const [actualData, setActualData] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [type, setType] = useState("");
    const [size, setSize] = useState(10);
    const [refresh, setRefresh] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const { data, columns, pages, infoData } = useBooksData(size, currentPage, searchQuery, type, openModal, refresh);
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
    const handleView = (rowIndex: number) => {
        const actualNumber = String(infoData[rowIndex]);
        router.push(`books/${actualNumber}`)
    };
    const handleEdit = (rowIndex: number) => {
        const actualNumber = Number(infoData[rowIndex])
        setModalState(true)
        setDataUpdate(data[rowIndex]);
        setActualData(actualNumber)
        setTitle("Editar Libro ")
        setModalType('edit');
        setOpenModal(true);
    };
    const handleDelate = (rowIndex: number) => {
        const actualTitle = String(data[rowIndex][3])
        const actualNumber = Number(infoData[rowIndex])
        setModalState(false)
        setActual(actualTitle)
        setActualData(actualNumber)
        setTitle("Eliminar Libro")
        setModalType('delete');
        setOpenModal(true);
    };
    const closeModal = () => {
        setModalState(true)
        setOpenModal(false);
        setTitle("Crear Libro")
        setModalType('create');
    };
    const Refresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false);
        }, 2800);
    }
    const reportBook = async () => {
        const api = `/api/reports?page=books`;
        const res = await fetch(api);
        if (!res.ok) {
            console.error('Error al descargar el reporte');
            return;
        }
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        window.URL.revokeObjectURL(url);
    };
    return (
        <div>
            <div className="grid grid-cols-7 gap-2">
                <div className="col-span-5">
                    <ComponentSearch onChange={handleSizeChange} size={size} />
                </div>
                <Select onChange={handleTypeChange} className=" py-2">
                    <option value="">Todo</option>
                    <option value="LIBRO" > LIBRO</option>
                    <option value="PARTITURA" > PARTITURA</option>
                    <option value="DVD" > DVD</option>
                    <option value="CD" > CD</option>
                    <option value="CASSETTE" > CASSETTE</option>
                    <option value="TESIS" > TESIS</option>
                    <option value="REVISTA" > REVISTA</option>
                    <option value="EBOOK" > EBOOK</option>
                    <option value="AUDIO LIBRO" > AUDIO LIBRO</option>
                    <option value="PROYECTOS" > PROYECTOS</option>
                    <option value="OTRO" > OTRO</option>
                </Select>
                <div className='w-full py-2'>
                    <Button aria-label='Reporte' className='w-full bg-red-600' onClick={reportBook}>Reporte</Button>
                </div>
            </div>
            <ComponentTable columns={columns} data={data} onView={handleView} onEdit={(handleEdit)} onDelete={(handleDelate)} currentPage={currentPage} itemsPerPage={size} setOpenModal={setOpenModal} />
            <div className="flex w-full items-center justify-between">
                <Tooltip className="z-50" content="Refrescar">
                    <Button
                        className={`${refresh ? "animate-spin" : ""} m-0 border-none p-0 text-gray-600 ring-0 focus:ring-0 dark:text-gray-300`}
                        aria-label="Mostrar/Ocultar Contraseña"
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
            </ComponentModalCreate>

        </div>
    )
}

const useBooksData = (size: number, currentPage: number, search: string, type: string, openModal: boolean, refresh: boolean) => {
    const parts = search.split(',');

    const [data, setData] = useState<(string | number)[][]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [infoData, setInfoData] = useState<(string | number)[][]>([]);
    const [pages, setPages] = useState<number>(0);
    const query = parts[0] || "";       // El primer valor (query)
    const author = parts[1] || "";      // El segundo valor (author)
    const instrument = parts[2] || "";  // El tercer valor (instrument)
    const category = parts[3] || "";    // El cuarto valor (category)
    console.log({ query, author, instrument, category });
    const info = (books: BookFormData[]) => {
        return books.map((book) => [
            book.id
        ]);
    };

    const truncateContent = (content: string, wordLimit: number): string => {
        if (!content) {
            return "No hay observación";
        }
        const words = content.split(" ");
        return words.length > wordLimit
            ? `${words.slice(0, wordLimit).join(" ")}...`
            : content;
    };

    const configureColumns = () => {
        setColumns([
            "INVENTARIO",
            "CONDICION",
            "SIGNATURA TOPOGRAFICA",
            "TITULO ORIGINAL",
            "LENGUAJE",
            "CANTIDAD",
            "OBSERVACION"
        ]);
    };

    useEffect(() => {
        if (!openModal || refresh) {
            const fetchData = async () => {
                try {
                    const url = `/api/books?type=${type}&page=${currentPage}&size=${size}&query=${query}&author=${author}&instrument=${instrument}&category=${category}`;
                    const res = await fetch(url);
                    const result = await res.json();
                    const transformData = (books: BookFormData[]) => {
                        return books.map((book) => [
                            book.book_inventory,
                            book.book_condition,
                            book.book_location,
                            book.book_title_original,
                            book.book_language,
                            book.book_quantity,
                            truncateContent(book.book_observation, 8),
                        ]);
                    };
                    configureColumns();
                    setInfoData(info(result.data))
                    setData(transformData(result.data));
                    setPages(result.totalPages)
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
    }, [currentPage, size, query, openModal, type, refresh, author, category,instrument]);

    return { data, columns, pages, infoData };
};