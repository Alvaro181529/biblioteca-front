"use client"
import { ComponentSearch } from "@/components/Search/Search";
import { Button, List, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { Orders } from "./Interface/Interface";
import { IoReloadSharp } from "react-icons/io5";
import { orderBorrowed } from "./lib/updateOrder";
import { ComponentPagination } from "@/components/Pagination/Pagination";
import { InvoicesTableSkeleton } from "@/components/Skeleton/skeletons";
interface SerchParams {
    searchParams: {
        query?: string;
        page?: string;
    };
}
export default function OrderPage({ searchParams }: SerchParams) {
    const searchQuery = searchParams?.query || "";
    const [size, setSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const { data, total } = FetchData(size, currentPage, searchQuery)
    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSize = Number(event.target.value)
        setSize(selectedSize);
        setCurrentPage(1);
    };
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    return (
        <div>
            <ComponentSearch onChange={handleSizeChange} size={size} />
            <TableOrders data={data} page={currentPage} size={size} />
            <ComponentPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={total} />
        </div>
    )
}

const TableOrders = ({ data, page, size }: { data: Orders[], page: number, size: number }) => {

    if (!Array.isArray(data) || data.length === 0) {
        return <InvoicesTableSkeleton />;
    }
    const handleDevolver = async (id: number) => {
        await orderBorrowed(id, "DEVUELTO")
    }
    return (
        <div className="overflow-x-auto">
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell className="bg-verde-700 text-white">N</Table.HeadCell>
                    <Table.HeadCell className="bg-verde-700 text-white">Usuario</Table.HeadCell>
                    <Table.HeadCell className="bg-verde-700 text-white">Libro</Table.HeadCell>
                    <Table.HeadCell className="bg-verde-700 text-white">Estado</Table.HeadCell>
                    <Table.HeadCell className="bg-verde-700 text-white">Fecha de préstamo</Table.HeadCell>
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
                            <Table.Cell>
                                <Button color="gray" size="sm" onClick={() => { handleDevolver(order.id) }} >
                                    <IoReloadSharp className="my-auto mr-2" />
                                    Devolver
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
}


const FetchData = (size: number, currentPage: number, query: string) => {
    const [data, setData] = useState<Orders[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `/api/orders/admin?state=PRESTADO&size=${size}&page=${currentPage}&query=${query || ""}`;
                const res = await fetch(url);
                const result = await res.json();
                console.log(result); // Verificar la estructura
                setData(Array.isArray(result.data) ? result.data : []);
                setTotal(result.totalPages || 0);
            } catch (error) {
                console.error(error);
                setData([]);
            }
        };
        fetchData();
    }, [size, currentPage, query]);

    return { data, total };
};
