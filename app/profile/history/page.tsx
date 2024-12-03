"use client"
import { Orders } from "@/interface/Interface";
import { ComponentPagination } from "@/components/Pagination";
import { ComponentSearch } from "@/components/Search";
import { InvoicesCardUserSkeleton } from "@/components/skeletons";
import { Card, Select } from "flowbite-react";
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import OrderCard from "@/components/Order/Order";
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
            }, 1500);
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
            {data.map((order, index) => (
                <OrderCard
                    key={index}
                    order={order}
                    index={index}
                    page={page}
                    size={size}
                    handleView={handleView}
                />))}
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
