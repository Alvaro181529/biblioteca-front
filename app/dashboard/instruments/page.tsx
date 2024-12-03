"use client"
import { useState, useEffect, act } from 'react';
import { ComponentTable } from "@/components/Table"
import { ComponentPagination } from '@/components/Pagination';
import { ComponentSearch } from '@/components/Search';
import { Instrument } from '@/interface/Interface';
import { ComponentModalCreate } from '@/components/Modal';
import { FormCreate } from './crud/create';
import { FormDelete } from './crud/delate';
import { Button, Tooltip } from 'flowbite-react';
import { FiRefreshCcw } from "react-icons/fi"

interface SerchParams {
    searchParams: {
        query?: string;
        page?: string;
    };
}

export default function Instruments({ searchParams }: SerchParams) {
    const searchQuery = searchParams?.query || ""
    const [modalState, setModalState] = useState(true)
    const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'view'>('create');
    const [currentPage, setCurrentPage] = useState(1);
    const [title, setTitle] = useState("Crear Instrumento");
    const [actual, setActual] = useState("");
    const [dataUpdate, setDataUpdate] = useState<(string | number)[]>([]);
    const [actualData, setActualData] = useState(0);
    const [size, setSize] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [view, setView] = useState(false)
    const [refresh, setRefresh] = useState(false);
    const { data, columns, pages, infoData } = useInstrumentData(size, currentPage, searchQuery, openModal, refresh);
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
        setTitle("Ver Instrumento ")
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
        const actualTitle = String(data[rowIndex][0])
        const actualNumber = Number(infoData[rowIndex])
        setModalState(false)
        setActual(actualTitle)
        setActualData(actualNumber)
        setTitle("Eliminar Instrumento")
        setModalType('delete');
        setOpenModal(true);
    };
    const closeModal = () => {
        setView(false)
        setModalState(true)
        setOpenModal(false);
        setTitle("Crear Instrumento")
        setModalType('create');
    };
    const Refresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false);
        }, 2800);
    }
    return (
        <div>
            <ComponentSearch onChange={handleSizeChange} size={size} />
            <ComponentTable columns={columns} data={data} onView={handleView} onEdit={(handleEdit)} onDelete={(handleDelate)} currentPage={currentPage} itemsPerPage={size} setOpenModal={setOpenModal} />
            <div className="flex w-full items-center justify-between">
                <Tooltip className='z-50' content="Refrescar">
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
                <div>
                    <ComponentPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={pages} />
                </div>
            </div>
            <ComponentModalCreate title={title} openModal={openModal} setOpenModal={closeModal} status={modalState}>
                {modalType === 'create' && <FormCreate setOpenModal={closeModal} />}
                {modalType === 'edit' && <FormCreate setOpenModal={closeModal} id={Number(actualData)} data={dataUpdate} />}
                {modalType === 'view' && <FormCreate setOpenModal={closeModal} id={Number(actualData)} data={dataUpdate} view={view} />}
                {modalType === 'delete' && <FormDelete instrumento={actual} data={actualData} setOpenModal={closeModal} />}
            </ComponentModalCreate>
        </div>
    )
}

const useInstrumentData = (size: number, currentPage: number, query: string, openModal: boolean, refresh: boolean) => {
    const [data, setData] = useState<(string | number)[][]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [infoData, setInfoData] = useState<(string | number)[][]>([]);
    const [pages, setPages] = useState<number>(0);
    const info = (instruments: Instrument[]) => {
        return instruments.map((instrument) => [
            instrument.id,
        ]);
    };
    const transformData = (instruments: Instrument[]) => {
        return instruments.map((instrument) => [
            instrument.instrument_name,
            instrument.instrument_family
        ]);
    };
    const configureColumns = () => {
        setColumns([
            "INTRUMENTO",
            "FAMILIA",
        ]);
    };

    useEffect(() => {
        if (!openModal || refresh) {

            const fetchData = async () => {
                try {
                    const url = `/api/instruments?page=${currentPage}&size=${size}&query=${query}`;
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
    }, [currentPage, size, query, openModal, refresh]);
    return { data, columns, pages, infoData };
};