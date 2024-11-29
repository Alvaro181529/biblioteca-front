"use client"
import { useState, useEffect, act } from 'react';
import { ComponentTable } from "@/components/Table/table"
import { ComponentModalCreate } from '@/components/Modal/Modal';
import { ComponentPagination } from '@/components/Pagination/Pagination';
import { ComponentSearch } from '@/components/Search/Search';
import { BookFormData } from './Interface/Interface';
import { FormCreate } from './crud/create';
import { FormDelete } from './crud/delete';
import { useRouter } from 'next/navigation';
import { Button, Select } from 'flowbite-react';
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
    const [openModal, setOpenModal] = useState(false);
    const { data, columns, pages, infoData } = useBooksData(size, currentPage, searchQuery, type, openModal);
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
            <ComponentPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={pages} />
            <ComponentModalCreate title={title} openModal={openModal} setOpenModal={closeModal} status={modalState}>
                {modalType === 'create' && <FormCreate setOpenModal={closeModal} />}
                {modalType === 'edit' && <FormCreate setOpenModal={closeModal} id={actualData} />}
                {modalType === 'delete' && <FormDelete libro={actual} data={actualData} setOpenModal={closeModal} />}
            </ComponentModalCreate>

        </div>
    )
}

const useBooksData = (size: number, currentPage: number, query: string, type: string, openModal: boolean) => {
    const [data, setData] = useState<(string | number)[][]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [infoData, setInfoData] = useState<(string | number)[][]>([]);
    const [pages, setPages] = useState<number>(0);
    const info = (books: BookFormData[]) => {
        return books.map((book) => [
            book.id
        ]);
    };
    const transformData = (books: BookFormData[]) => {
        return books.map((book) => [
            book.book_inventory,
            book.book_condition,
            book.book_location,
            book.book_title_original,
            book.book_language,
            book.book_quantity,
            book.book_observation,
        ]);
    };
    const configureColumns = () => {
        setColumns([
            "INVENTARIO",
            "CONDICION",
            "LOCACION",
            "TITULO ORIGINAL",
            "LENGUAJE",
            "CANTIDAD",
            "OBSERVACION"
        ]);
    };

    useEffect(() => {
        if (!openModal) {
            const fetchData = async () => {
                try {
                    const url = `/api/books?type=${type}&page=${currentPage}&size=${size}&query=${query}`;
                    const res = await fetch(url);
                    const result = await res.json();

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
    }, [currentPage, size, query, openModal, type]);

    return { data, columns, pages, infoData };
};