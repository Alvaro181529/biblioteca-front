"use client"
import { useState, useEffect } from 'react';
import { ComponentTable } from "@/components/Table"
import { ComponentPagination } from '@/components/Pagination';
import { ComponentSearch } from '@/components/Search';
import { User } from '@/interface/Interface';
import { ComponentModalCreate } from '@/components/Modal';
import { FormCreate } from './crud/create';
import { FormDelete } from './crud/delate';
import { Button, Select, Tooltip } from 'flowbite-react';
import { FiRefreshCcw } from "react-icons/fi"
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
    const [type, setType] = useState("true");
    const [actualData, setActualData] = useState(0);
    const [size, setSize] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [view, setView] = useState(false)
    const { data, columns, pages, infoData } = usePublicationsData(size, currentPage, searchQuery, openModal, type, refresh);
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
        setTitle("Ver Usuario ")
        setModalType('view');
        setOpenModal(true);
    };
    const handleEdit = (rowIndex: number) => {
        const actualNumber = Number(infoData[rowIndex])
        setModalState(true)
        setDataUpdate(data[rowIndex]);
        setActualData(actualNumber)
        setTitle("Editar Usuario ")
        setModalType('edit');
        setOpenModal(true);
    };
    const handleDelate = (rowIndex: number) => {
        const actualTitle = String(data[rowIndex][1])
        const actualNumber = Number(infoData[rowIndex])
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
        setModalState(true)
    };
    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value);
        setCurrentPage(1);
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
    const Refresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false);
        }, 2800);
    }
    return (
        <div>
            <div className="col-span-3 grid gap-x-2 md:grid-cols-11 md:gap-2">
                <div className="col-span-3 md:col-span-8">
                    <ComponentSearch onChange={handleSizeChange} size={size} />
                </div>
                <Select onChange={handleTypeChange} className="col-span-2 py-2">
                    <option value="true">Usuarios activos</option>
                    <option value="false">Usuarios no activos</option>
                    <option value="">Todo</option>
                </Select>
                <div className='col-span-1 w-full py-2'>
                    <Button className='w-full bg-red-600' onClick={reportUsers}>Reporte</Button>
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
                {modalType === 'edit' && <FormCreate setOpenModal={closeModal} id={Number(actualData)} data={dataUpdate} />}
                {modalType === 'view' && <FormCreate setOpenModal={closeModal} id={Number(actualData)} data={dataUpdate} view={view} />}
                {modalType === 'delete' && < FormDelete data={actualData} setOpenModal={closeModal} />}
            </ComponentModalCreate>
        </div>
    )
}

const usePublicationsData = (size: number, currentPage: number, query: string, openModal: boolean, type: string, refresh: boolean) => {
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
            users.active ? "ACTIVO" : "INACTIVO",
            users.rols,
        ]);
    };
    const configureColumns = () => {
        setColumns([
            "EMAIL",
            "NOMBRE",
            "ESTADO",
            "ROL"
        ]);
    };

    useEffect(() => {
        if (!openModal || refresh) {
            const fetchData = async () => {
                try {
                    const url = `/api/users?page=${currentPage}&size=${size}&query=${query}&type=${type}`;
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
    }, [currentPage, size, query, openModal, refresh, type]);
    return { data, columns, pages, infoData };
};
