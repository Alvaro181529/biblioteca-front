"use client"
import { useState, useEffect } from 'react';
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
import { BusquedaAvanzada } from '@/utils/busquedaAvanzada';
import { ReportComponent } from '@/components/Report/Report';
import { LuSettings2 } from "react-icons/lu";
interface SerchParams {
    searchParams: {
        query?: string;
        author?: string;
        instrument?: string;
        category?: string;
        page?: string;
    };
}

export default function Books({ searchParams }: SerchParams) {
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
    const { data, columns, pages, infoData } = useBooksData(size, currentPage, searchQuery, type, openModal, refresh, searchAuthor, searchCategory, searchInstrument);
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
    const handleSearch = () => {
        setModalState(false)
        setTitle("Busqueda Avanzada")
        setModalType('search');
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
            <div className="col-span-3 grid gap-x-2 md:grid-cols-11 md:gap-2">
                <div className="col-span-3 md:col-span-5 xl:col-span-6">
                    <ComponentSearch onChange={handleSizeChange} size={size} />
                </div>

                <Select onChange={handleTypeChange} className=" py-2 md:col-span-2 xl:col-span-2">
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
                    <option value="AUDIO LIBRO" > AUDIO LIBRO</option>
                    <option value="PROYECTOS" > PROYECTOS</option>
                    <option value="OTRO" > OTRO</option>
                </Select>
                <div className='w-full py-2 md:col-span-1'>
                    <Button aria-label='Reporte' className='w-full rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-400' onClick={handleSearch}><LuSettings2 className='text-xl text-gray-600' /></Button>
                </div>
                <div className='w-full py-2 md:col-span-2'>
                    <ComponentModalCreate title={'Reporte de Libros'} openModal={openModalReport} setOpenModal={closeModalReport} status={false}>
                        <ReportComponent report='books'></ReportComponent>
                    </ComponentModalCreate>
                    <Button aria-label='Reporte' className='w-full bg-red-600' onClick={() => { setOpenModalReport(true) }}>Reporte</Button>
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
                {modalType === 'search' && <BusquedaAvanzada></BusquedaAvanzada>}
            </ComponentModalCreate>
        </div>
    )
}

const useBooksData = (size: number, currentPage: number, search: string, type: string, openModal: boolean, refresh: boolean, author?: string, category?: string, instrument?: string) => {
    const parts = search.split(',');

    const [data, setData] = useState<(string | number)[][]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [infoData, setInfoData] = useState<(string | number)[][]>([]);
    const [pages, setPages] = useState<number>(0);
    const query = parts[0] || "";       // El primer valor (query)

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
            "TITULO",
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
                            book.book_title_parallel ? book.book_title_parallel : book.book_title_original,
                            book.book_quantity,
                            truncateContent(book.book_observation, 4),
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
    }, [currentPage, size, query, openModal, type, refresh, author, category, instrument]);

    return { data, columns, pages, infoData };
};