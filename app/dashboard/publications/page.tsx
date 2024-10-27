"use client"
import { useState, useEffect } from 'react';
import { ComponentTable } from "@/components/Table/table"
import { ComponentPagination } from '@/components/Pagination/Pagination';
import { ComponentSearch } from '@/components/Search/Search';
import { Publication } from './Interface/Interface';
import { ComponentModalCreate } from '@/components/Modal/Modal';
import { FormCreate } from './crud/create';
import { FormDelete } from './crud/delate';
import { useRouter } from 'next/navigation';

interface SerchParams {
    searchParams: {
        query?: string;
        page?: string;
    };
}

export default function Publications({ searchParams }: SerchParams) {
    const searchQuery = searchParams?.query || "";
    const [dataUpdate, setDataUpdate] = useState<(string | number)[]>([]);
    const [modalState, setModalState] = useState(true)
    const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'view'>('create');
    const [currentPage, setCurrentPage] = useState(1);
    const [title, setTitle] = useState("Crear Publicacion");
    const [actual, setActual] = useState("");
    const [actualData, setActualData] = useState(0);
    const [size, setSize] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const { data, columns, pages, infoData } = usePublicationsData(size, currentPage, searchQuery, openModal);
    const router = useRouter();

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSize = Number(event.target.value)
        setSize(selectedSize);
        setCurrentPage(1);
    };
    const handleView = (rowIndex: number) => {
        setModalState(true)
        const actualNumber = String(infoData[rowIndex]);
        router.push(`publications/${actualNumber}`)
    };
    const handleEdit = (rowIndex: number) => {
        const actualNumber = Number(infoData[rowIndex])
        setModalState(true)
        setDataUpdate(data[rowIndex]);
        setActualData(actualNumber)
        setTitle("Editar Publication ")
        setModalType('edit');
        setOpenModal(true);
    };
    const handleDelate = (rowIndex: number) => {
        const actualTitle = String(data[rowIndex][0])
        const actualNumber = Number(infoData[rowIndex])
        setModalState(false)
        setActual(actualTitle)
        setActualData(actualNumber)
        setTitle("Eliminar Publicacion")
        setModalType('delete');
        setOpenModal(true);
    };
    const closeModal = () => {
        setModalState(true)
        setOpenModal(false);
        setTitle("Crear Publicacion")
        setModalType('create');
    };
    return (
        <div>
            <ComponentSearch onChange={handleSizeChange} size={size} />
            <ComponentTable columns={columns} data={data} onView={handleView} onEdit={(handleEdit)} onDelete={(handleDelate)} currentPage={currentPage} itemsPerPage={size} setOpenModal={setOpenModal} />
            <ComponentPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={pages} />
            <ComponentModalCreate title={title} openModal={openModal} setOpenModal={closeModal} status={modalState}>
                {modalType === 'create' && <FormCreate setOpenModal={closeModal} />}
                {modalType === 'edit' && <FormCreate setOpenModal={closeModal} id={Number(actualData)} data={dataUpdate} />}
                {modalType === 'delete' && <FormDelete publication={actual} data={actualData} setOpenModal={closeModal} />}
            </ComponentModalCreate>
        </div>
    )
}

const usePublicationsData = (size: number, currentPage: number, query: string, openModal: boolean) => {
    const [data, setData] = useState<(string | number)[][]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [infoData, setInfoData] = useState<(string | number)[][]>([]);
    const [pages, setPages] = useState<number>(0);
    const info = (publication: Publication[]) => {
        return publication.map((publications) => [
            publications.id,
        ]);
    };
    const transformData = (publication: Publication[]) => {
        return publication.map((publications) => [
            publications.publication_title,
            publications.publication_content,
            publications.publication_importance,
            publications.publication_active ? 'Publicacion esta visible' : 'Publicacion no esta visible'
        ]);
    };
    const configureColumns = () => {
        setColumns([
            "TITULO",
            "CONTENIDO",
            "IMPORTANCIA",
            "ESTADO",
        ]);
    };

    useEffect(() => {
        if (!openModal) {
            const fetchData = async () => {
                try {
                    const url = `/api/publications?page=${currentPage}&size=${size}&query=${query}`;
                    const res = await fetch(url);
                    const result = await res.json();
                    configureColumns();
                    setInfoData(info(result.data || []))
                    setData(transformData(result.data || []));
                    setPages(result.totalPages || 0)
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchData();
        }
    }, [currentPage, size, query, openModal]);
    return { data, columns, pages, infoData };
};