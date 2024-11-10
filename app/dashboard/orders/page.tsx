"use client"
import { ComponentSearch } from "@/components/Search/Search";
import { Button, Card, List, Select, Table } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { Orders } from "./Interface/Interface";
import { IoReloadSharp } from "react-icons/io5";
import { orderBorrowed } from "./lib/updateOrder";
import { ComponentPagination } from "@/components/Pagination/Pagination";
import { InvoicesTableSkeleton } from "@/components/Skeleton/skeletons";
import { HiArrowSmRight } from "react-icons/hi";
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
    const { data, total, fetchData } = FetchData(type, size, currentPage, searchQuery)
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
    const reportOrders = async () => {
        const api = `/api/reports?page=orders`;
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
                    <option value="PRESTADO">Prestado</option>
                    <option value="DEVUELTO">Devuelto</option>
                    <option value="CANCELADO">Cancelado</option>
                    <option value="ESPERA">Espera</option>
                    <option value="">Todo</option>
                </Select>
                <div className='w-full py-2'>
                    <Button className='w-full bg-red-600' onClick={reportOrders}>Reporte</Button>
                </div>
            </div>
            <TableOrders data={data} page={currentPage} size={size} fetchData={fetchData} />
            <ComponentPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={total} />
        </div>
    )
}

const TableOrders = ({ data, page, size, fetchData }: { data: Orders[], page: number, size: number, fetchData: () => void }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [hasNoResults, setHasNoResults] = useState(false);

    useEffect(() => {
        if (!data || data.length === 0) {
            const timer = setTimeout(() => {
                setHasNoResults(true);
                setIsLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setIsLoading(false);
            setHasNoResults(false);
        }
    }, [data]);

    if (isLoading) {
        return <InvoicesTableSkeleton />;
    }

    if (hasNoResults) {
        return (
            <Card className="col-span-full">
                <p className="text-gray-600">No hay prestamos o pedidos disponibles.</p>
            </Card>
        );
    }

    const handleDevolver = async (id: number) => {
        await orderBorrowed(id, "DEVUELTO")
        fetchData();
    }
    const handlePrestar = async (id: number) => {
        await orderBorrowed(id, "PRESTADO")
        fetchData();
    }
    const handleCancelar = async (id: number) => {
        await orderBorrowed(id, "CANCELADO")
        fetchData();
    }
    return (
        <div className="overflow-x-auto">
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell className="bg-verde-700 text-white">N</Table.HeadCell>
                    <Table.HeadCell className="bg-verde-700 text-white">Usuario</Table.HeadCell>
                    <Table.HeadCell className="bg-verde-700 text-white">Libro</Table.HeadCell>
                    <Table.HeadCell className="bg-verde-700 text-white">Fecha de préstamo</Table.HeadCell>
                    <Table.HeadCell className="bg-verde-700 text-white">Estado</Table.HeadCell>
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
                                        <List.Item key={book.id} className="text-nowrap">
                                            {book.book_title_original}
                                        </List.Item>
                                    ))}
                                </List>
                            </Table.Cell>
                            <Table.Cell>
                                {new Date(order.order_at).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Table.Cell>
                            <Table.Cell>{order.order_status}</Table.Cell>
                            <Table.Cell className="flex flex-col space-y-2">
                                {order.order_status === "PRESTADO" ? (
                                    <Button color="gray" size="sm" onClick={() => { handleDevolver(order.id) }}>
                                        <IoReloadSharp className="my-auto mr-2" />
                                        Devolver
                                    </Button>
                                ) : order.order_status === "ESPERA" ? (
                                    <div className="flex flex-col space-y-2">
                                        <Button color="gray" size="sm" onClick={() => { handlePrestar(order.id) }}>
                                            <HiArrowSmRight className="my-auto mr-2 size-5 font-light" />
                                            Prestar
                                        </Button>
                                        <Button color="warning" size="sm" onClick={() => { handleCancelar(order.id) }}>
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


const FetchData = (type: string, size: number, currentPage: number, query: string) => {
    const [data, setData] = useState<Orders[]>([]);
    const [total, setTotal] = useState(0);

    const fetchData = useCallback(async () => {
        try {
            const url = `/api/orders/admin?state=${type}&size=${size}&page=${currentPage}&query=${query || ""}`;
            const res = await fetch(url);
            const result = await res.json();
            console.log(result); // Verificar la estructura
            setData(Array.isArray(result.data) ? result.data : []);
            setTotal(result.totalPages || 0);
        } catch (error) {
            console.error(error);
            setData([]);
        }
    }, [type, size, currentPage, query]); // Dependencias necesarias para fetchData

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, total, fetchData };
};
