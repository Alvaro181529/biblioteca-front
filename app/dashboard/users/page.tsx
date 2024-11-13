"use client"
import { useState, useEffect } from 'react';
import { ComponentTable } from "@/components/Table/table"
import { ComponentPagination } from '@/components/Pagination/Pagination';
import { ComponentSearch } from '@/components/Search/Search';
import { User } from './Interface/Interface';
import { ComponentModalCreate } from '@/components/Modal/Modal';
import { FormCreate } from './crud/create';
import { FormDelete } from './crud/delate';
import { Button } from 'flowbite-react';

interface SerchParams {
    searchParams: {
        query?: string;
        page?: string;
    };
}

export default function Users({ searchParams }: SerchParams) {
    const searchQuery = searchParams?.query || "";
    const [dataUpdate, setDataUpdate] = useState<(string | number)[]>([]);
    const [modalState, setModalState] = useState(true)
    const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'view'>('create');
    const [currentPage, setCurrentPage] = useState(1);
    const [title, setTitle] = useState("Crear Usuario");
    const [actual, setActual] = useState("");
    const [actualData, setActualData] = useState(0);
    const [size, setSize] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [view, setView] = useState(false)
    const { data, columns, pages, infoData } = usePublicationsData(size, currentPage, searchQuery, openModal);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSize = Number(event.target.value)
        setSize(selectedSize);
        setCurrentPage(1);
    };
    const handleView = (rowIndex: number) => {
        const actualNumber = Number(infoData[rowIndex])
        setModalState(false)
        setView(true)
        setDataUpdate(data[rowIndex]);
        setActualData(actualNumber)
        setTitle("Ver Categoria ")
        setModalType('view');
        setOpenModal(true);
    };
    const handleEdit = (rowIndex: number) => {
        const actualNumber = Number(infoData[rowIndex])
        setModalState(true)
        setDataUpdate(data[rowIndex]);
        setActualData(actualNumber)
        setTitle("Editar Instrumento ")
        setModalType('edit');
        setOpenModal(true);
    };
    const handleDelate = (rowIndex: number) => {
        const actualTitle = String(data[rowIndex][1])
        const actualNumber = Number(infoData[rowIndex])
        setActual(actualTitle)
        setModalState(false)
        setActualData(actualNumber)
        setTitle("Eliminar Usuario")
        setModalType('delete');
        setOpenModal(true);
    };
    const closeModal = () => {
        setOpenModal(false);
        setTitle("Crear Usuario")
        setModalType('create');
    };
    const reportUsers = async () => {
        const api = `/api/reports?page=users`;
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
            <div className='grid grid-cols-7 gap-2'>
                <div className="col-span-6">
                    <ComponentSearch onChange={handleSizeChange} size={size} />
                </div>
                <div className='w-full py-2'>
                    <Button className='w-full bg-red-600' onClick={reportUsers}>Reporte</Button>
                </div>
            </div>
            <ComponentTable columns={columns} data={data} onView={handleView} onEdit={(handleEdit)} onDelete={(handleDelate)} currentPage={currentPage} itemsPerPage={size} setOpenModal={setOpenModal} />
            <ComponentPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={pages} />
            <ComponentModalCreate title={title} openModal={openModal} setOpenModal={closeModal} status={modalState}>
                {modalType === 'create' && <FormCreate setOpenModal={closeModal} />}
                {modalType === 'edit' && <FormCreate setOpenModal={closeModal} id={Number(actualData)} data={dataUpdate} />}
                {modalType === 'view' && <FormCreate setOpenModal={closeModal} id={Number(actualData)} data={dataUpdate} view={view} />}
                {modalType === 'delete' && < FormDelete user={actual} data={actualData} setOpenModal={closeModal} />}
            </ComponentModalCreate>
        </div>
    )
}

const usePublicationsData = (size: number, currentPage: number, query: string, openModal: boolean) => {
    const [data, setData] = useState<(string | number)[][]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [infoData, setInfoData] = useState<(string | number)[][]>([]);
    const [pages, setPages] = useState<number>(0);
    const info = (user: User[]) => {
        return user.map((users) => [
            users.id,
        ]);
    };
    const transformData = (user: User[]) => {
        return user.map((users) => [
            users.email,
            users.name,
            users.rols,
        ]);
    };
    const configureColumns = () => {
        setColumns([
            "EMAIL",
            "NOMBRE",
            "ROL"
        ]);
    };

    useEffect(() => {
        console.log(query);
        if (!openModal || query) {
            const fetchData = async () => {
                try {
                    const url = `/api/users?page=${currentPage}&size=${size}&query=${query}`;
                    const res = await fetch(url);
                    const result = await res.json();
                    configureColumns();
                    setInfoData(info(result.data || []))
                    setData(transformData(result.data || []));
                    setPages(result.totalPages || 0)
                    console.log(result.data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchData();
        }
    }, [currentPage, size, query, openModal]);
    return { data, columns, pages, infoData };
};