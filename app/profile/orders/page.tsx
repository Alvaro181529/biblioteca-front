"use client"
import { Orders, Respuest } from "@/interface/Interface";
import { ComponentPagination } from "@/components/Pagination";
import { ComponentSearch } from "@/components/Search";
import { InvoicesCardUserSkeleton } from "@/components/skeletons";
import { Button, Card, Select, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react"
import OrderCard from "@/components/Order/Order";
import { orderBorrowed } from "@/lib/updateOrder";
import { toast } from "sonner";
import { FiRefreshCcw } from "react-icons/fi"

interface SerchParams {
    searchParams: {
        query?: string;
        page?: string;
    };
}

export default function OrderPage({ searchParams }: SerchParams) {
    const searchQuery = searchParams?.query || "";
    const [type, setType] = useState("ESPERA");
    const [size, setSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [refresh, setRefresh] = useState(false);
    const { data, total } = FetchData(refresh, size, currentPage, searchQuery, type)
    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value);
        setCurrentPage(1);
    };
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSize = Number(event.target.value)
        setSize(selectedSize);
        setCurrentPage(1);
    };
    const Refresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false);
        }, 2800);
    }
    return (
        <section>
            <div className="grid grid-cols-9 gap-2  md:grid-cols-7">
                <div className="col-span-6 md:col-span-5 lg:col-span-6">
                    <ComponentSearch onChange={handleSizeChange} size={size} />
                </div>
                <Select onChange={handleTypeChange} className="col-span-3 py-2 md:col-span-2 lg:col-span-1">
                    <option value="ESPERA">En espera</option>
                    <option value="PRESTADO">Prestados</option>
                </Select>
            </div>
            <CardBook data={data} page={currentPage} size={size} refresh={Refresh} />
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
        </section>
    );
}
const CardBook = ({ data, page, size, refresh }: { data: Orders[], page: number, size: number, refresh: () => void; }) => {
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
    }, [data]);
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
        refresh()
    }

    if (isLoading) {
        return <InvoicesCardUserSkeleton />;
    }

    if (hasNoResults) {
        return (
            <Card className="col-span-full">
                <p className="text-gray-600 dark:text-gray-300">No se encontraron resultados.</p>
            </Card>
        );
    }
    return (
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            {data.map((order, index) => (
                <OrderCard
                    index={index}
                    key={index} // Accedes al id de cada libro
                    order={order}
                    page={page}
                    size={size}
                    handleCancelar={handleCancelar}
                />
            ))}
        </div>)
};

const FetchData = (refresh: boolean, size?: number, currentPage?: number, query?: string, type?: string) => {
    const [data, setData] = useState<Orders[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (refresh || type) {

            const fetchData = async () => {
                try {
                    const url = `/api/orders?term=${type || "ESPERA"}&size=${size || 10}&page=${currentPage || 1}&query=${query || ""}`;
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
        }
    }, [size, currentPage, query, type, refresh]);

    return { data, total };
};
