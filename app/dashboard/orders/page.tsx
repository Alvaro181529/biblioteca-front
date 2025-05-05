"use client"
import { ComponentSearch } from "@/components/Search";
import { Button, Card, List, Select, Table, Tooltip } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { Orders, Respuest } from "@/interface/Interface";
import { IoReloadSharp } from "react-icons/io5";
import { orderBorrowed } from "../../../lib/updateOrder";
import { ComponentPagination } from "@/components/Pagination";
import { InvoicesTableSkeleton } from "@/components/skeletons";
import { HiArrowSmRight } from "react-icons/hi";
import { FiRefreshCcw } from "react-icons/fi"
import { toast } from "sonner";
import { ReportComponent } from '@/components/Report/Report';
import { ComponentModalCreate } from "@/components/Modal";

interface SerchParams {
    searchParams: {
        query?: string;
        page?: string;
    };
}
export default function OrderPage({ searchParams }: SerchParams) {
    const searchQuery = searchParams?.query || "";
    const [type, setType] = useState("PRESTADO");
    const [size, setSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [refresh, setRefresh] = useState(false);
    const { data, total, fetchData } = FetchData(type, size, currentPage, searchQuery, refresh)
    const [openModalReport, setOpenModalReport] = useState(false);

    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSize = Number(event.target.value)
        setSize(selectedSize);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value);
        setCurrentPage(1);
    };
    const closeModalReport = () => {
        setOpenModalReport(false);
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
                <div className="col-span-3 md:col-span-8">
                    <ComponentSearch onChange={handleSizeChange} size={size} />
                </div>
                <Select onChange={handleTypeChange} className="col-span-2  py-2">
                    <option value="PRESTADO">Prestado</option>
                    <option value="DEVUELTO">Devuelto</option>
                    <option value="CANCELADO">Cancelado</option>
                    <option value="ESPERA">Espera</option>
                    <option value="">Todo</option>
                </Select>
                <div className='w-full py-2'>
                    <ComponentModalCreate title="Reporte de Prestamos" openModal={openModalReport} setOpenModal={closeModalReport} status={false}>
                        <ReportComponent report='orders'></ReportComponent>
                    </ComponentModalCreate>
                    <Button className='w-full bg-red-600' onClick={() => { setOpenModalReport(true) }} >Reporte</Button>
                </div>
            </div>
            <TableOrders data={data} page={currentPage} size={size} fetchData={fetchData} />
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
                <div>
                    <ComponentPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={total} />
                </div>
            </div>
        </div>
    )
}

const TableOrders = ({ data, page, size, fetchData }: { data: Orders[], page: number, size: number, fetchData: () => void }) => {
    const { data: dat } = FetchData('PRESTADO', 1000, 1)
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
    }, [data, dat]);

    if (isLoading) {
        return <InvoicesTableSkeleton />;
    }

    if (hasNoResults) {
        return (
            <Card className="col-span-full">
                <p className="text-gray-600 dark:text-gray-400">No hay prestamos o pedidos disponibles.</p>
            </Card>
        );
    }

    const handleDevolver = async (id: number) => {
        const result: Respuest = await orderBorrowed(id, "DEVUELTO")
        if (!result.success) {
            toast.error(result.message, {
                description: result.description
            });
            return
        }
        toast.success(result.message, {
            description: result.description
        });
        fetchData();
    }
    const handlePrestar = async (id: number) => {
        const result: Respuest = await orderBorrowed(id, "PRESTADO")
        if (!result.success) {
            toast.error(result.message, {
                description: result.description
            });
            return
        }
        toast.success(result.message, {
            description: result.description
        });
        fetchData();
    }
    const handleCancelar = async (id: number) => {
        const result: Respuest = await orderBorrowed(id, "CANCELADO")
        if (!result.success) {
            toast.error(result.message, {
                description: result.description
            });
            return
        }
        toast.success(result.message, {
            description: result.description
        });
        fetchData();
    }
    return (
        <div className="overflow-x-auto">
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell className="bg-verde-700 text-white">N</Table.HeadCell>
                    <Table.HeadCell className="bg-verde-700 text-white">Usuario</Table.HeadCell>
                    <Table.HeadCell className="bg-verde-700 text-white">Libro</Table.HeadCell>
                    <Table.HeadCell className="bg-verde-700 text-white">Estado</Table.HeadCell>
                    <Table.HeadCell className="bg-verde-700 text-white">Ultima fecha</Table.HeadCell>
                    <Table.HeadCell className="bg-verde-700 text-white">
                        <span className="sr-only">Acción</span>
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {data.map((order, index) => (
                        <Table.Row key={order.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell>
                                {(page - 1) * size + index + 1}
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {order?.user?.name || "Sin usuario"}
                                <br />
                                <span className="text-gray-600">
                                    {order?.user?.email || ""}
                                </span>
                            </Table.Cell>
                            <Table.Cell >
                                <List >
                                    {order.books.map(book => (
                                        <List.Item key={book.id} className="text-wrap">
                                            {book.book_title_original}
                                        </List.Item>
                                    ))}
                                </List>
                            </Table.Cell>
                            <Table.Cell>{order.order_status}</Table.Cell>
                            <Table.Cell>
                                {new Date(order.order_at).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Table.Cell>
                            <Table.Cell className="flex flex-col space-y-2">
                                {order.order_status === "PRESTADO" ? (
                                    <Button color="gray" className="md:ml-4 " size="sm" onClick={() => { handleDevolver(order.id) }}>
                                        <IoReloadSharp className="my-auto mr-2" />
                                        Devolver
                                    </Button>
                                ) : order.order_status === "ESPERA" ? (
                                    <div className="flex flex-col space-y-2">
                                        <Button className=" bg-verde-700 hover:bg-verde-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700 md:ml-4 md:mt-0" size="sm" onClick={() => { handlePrestar(order.id) }}>
                                            <HiArrowSmRight className="my-auto mr-2 size-5 font-light" />
                                            Prestar
                                        </Button>
                                        <Button className="mt-4 bg-red-600 hover:bg-red-500 dark:text-white dark:hover:bg-red-500 md:ml-4 md:mt-0" size="sm" onClick={() => { handleCancelar(order.id) }}>
                                            <HiArrowSmRight className="my-auto mr-2 size-5 font-light" />
                                            Cancelar
                                        </Button>
                                    </div>
                                ) : (
                                    <button hidden></button>
                                )}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div >
    );
}


const FetchData = (type: string, size: number, currentPage: number, query?: string, refresh?: boolean) => {
    const [data, setData] = useState<Orders[]>([]);
    const [total, setTotal] = useState(0);

    const fetchData = useCallback(async () => {
        try {
            const url = `/api/orders/admin?state=${type}&size=${size}&page=${currentPage}&query=${query || ""}`;
            const res = await fetch(url);
            const result = await res.json();
            setData(Array.isArray(result.data) ? result.data : []);
            setTotal(result.totalPages || 0);
        } catch (error) {
            console.error(error);
            setData([]);
        }
    }, [type, size, currentPage, query]); // Dependencias necesarias para fetchData

    useEffect(() => {
        fetchData();
    }, [fetchData, refresh]);

    return { data, total, fetchData };
};
