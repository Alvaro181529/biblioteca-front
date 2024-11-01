"use client"
import { Orders } from "@/app/dashboard/orders/Interface/Interface";
import { ComponentPagination } from "@/components/Pagination/Pagination";
import { ComponentSearch } from "@/components/Search/Search";
import { Badge, Card } from "flowbite-react";
import { useEffect, useState } from "react"
import { MdRemoveRedEye } from "react-icons/md";
import { RiBookFill, RiCalendarLine } from "react-icons/ri";
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSize = Number(event.target.value)
        setSize(selectedSize);
        setCurrentPage(1);
    };
    return (
        <section>
            <ComponentSearch onChange={handleSizeChange} size={size} />
            <CardBook data={data} page={currentPage} size={size} />
            <ComponentPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={total} />
        </section>
    );
}
const CardBook = ({ data, page, size }: { data: Orders[], page: number, size: number }) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {data.length > 0 ? (
                data.map((order, index) => (
                    <Card key={index} className="relative overflow-hidden">
                        <div className={`absolute left-0 top-0 h-full w-2 ${order.order_status === "PRESTADO" ? "bg-verde-500" : "bg-gray-400"
                            }`} />
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Orden #  {(page - 1) * size + index + 1}</h2>
                            <Badge color="success" className="rounded-lg" >
                                {order.order_status}
                            </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <RiCalendarLine className="mr-2 size-4" />
                            {new Date(order.order_at).toLocaleDateString()}
                        </div>
                        <hr />
                        {order.books.map((book, index) => (
                            <div key={index} className="flex w-full items-center">
                                <RiBookFill className="mr-2 size-5 text-gray-600" />
                                <div>
                                    <p className="font-medium">{book.book_title_original}</p>
                                    {book.book_title_parallel && (
                                        <p className="text-sm text-gray-600">{book.book_title_parallel}</p>
                                    )}
                                </div>
                                <div className="m-auto flex justify-end gap-2">
                                    <button className="m-auto  text-gray-600 hover:underline dark:text-verde-300">
                                        <MdRemoveRedEye className="size-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </Card >
                ))
            ) : (
                <Card className="col-span-full">
                    <p className="text-gray-600">No hay órdenes disponibles.</p>
                </Card>
            )
            }
        </div >
    )
}
const FetchData = (size: number, currentPage: number, query: string) => {
    const [data, setData] = useState<Orders[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `/api/orders?term=PRESTADO&size=${size}&page=${currentPage}&query=${query || ""}`;
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
