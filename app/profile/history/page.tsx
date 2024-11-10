"use client"
import { Orders } from "@/app/dashboard/orders/Interface/Interface";
import { ComponentPagination } from "@/components/Pagination/Pagination";
import { ComponentSearch } from "@/components/Search/Search";
import { InvoicesCardUserSkeleton } from "@/components/Skeleton/skeletons";
import { Badge, Card, Select } from "flowbite-react";
import { useEffect, useState } from "react"
import { RiBookFill, RiCalendarLine } from "react-icons/ri";
import { importanceColor, importanceColorMap } from "../orders/Interface/type";
import { useRouter } from "next/navigation";
interface SerchParams {
    searchParams: {
        query?: string;
        page?: string;
    };
}

export default function HistoryPage({ searchParams }: SerchParams) {
    const searchQuery = searchParams?.query || "";
    const [type, setType] = useState("DEVUELTO");
    const [size, setSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const { data, total } = FetchData(size, currentPage, searchQuery, type)

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value);
        setCurrentPage(1);
    };
    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSize = Number(event.target.value)
        setSize(selectedSize);
        setCurrentPage(1);
    };
    return (
        <section>
            <div className="grid grid-cols-7 gap-2">
                <div className="col-span-6">
                    <ComponentSearch onChange={handleSizeChange} size={size} />
                </div>
                <Select onChange={handleTypeChange} className=" py-2">
                    <option value="DEVUELTO">Devuelto</option>
                    <option value="CANCELADO">Cancelado</option>
                </Select>
            </div>
            <CardBook data={data} page={currentPage} size={size} />
            <ComponentPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={total} />
        </section>
    );
}
const CardBook = ({ data, page, size }: { data: Orders[], page: number, size: number }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasNoResults, setHasNoResults] = useState(false);
    const router = useRouter()
    const handleView = (id: number) => {
        router.push(`content/${id}`)
    };
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
        return <InvoicesCardUserSkeleton />;
    }

    if (hasNoResults) {
        return (
            <Card className="col-span-full">
                <p className="text-gray-600">No hay resultados disponibles.</p>
            </Card>
        );
    }
    return (
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            {data.map((order, index) => {
                const badgeColor = importanceColorMap[String(order.order_status)] || 'default';
                const lineColor = importanceColor[String(order.order_status)] || 'default';
                return (
                    <Card key={index} className="relative overflow-hidden">
                        <div className={`absolute left-0 top-0 h-full w-2 ${lineColor}`} />
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Orden #  {(page - 1) * size + index + 1}</h2>
                            <Badge color={badgeColor} className="rounded-lg" >
                                {order.order_status}
                            </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <RiCalendarLine className="mr-2 size-4" />
                            {new Date(order.order_at).toLocaleDateString()}
                        </div>
                        {order.books.map((book, index) => (
                            <Card key={index} className="cursor-pointer " onClick={() => { handleView(Number(order.id)) }}>
                                <div key={index} className="flex items-center">
                                    <RiBookFill className="mr-2 size-5 text-gray-600" />
                                    <div>
                                        <p className="font-medium">{book.book_title_original}</p>
                                        {book.book_title_parallel && (
                                            <p className="text-sm text-gray-600">{book.book_title_parallel}</p>
                                        )}
                                    </div>
                                </div>
                            </Card >
                        ))}
                    </Card >
                )
            })}
        </div >
    )
}
const FetchData = (size: number, currentPage: number, query: string, type: string) => {
    const [data, setData] = useState<Orders[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `/api/orders?term=${type}&size=${size}&page=${currentPage}&query=${query || ""}`;
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
    }, [size, currentPage, query, type]);

    return { data, total };
};
