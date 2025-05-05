"use client"
import { ComponentCard } from "@/components/Card";
import { ComponentPagination } from "@/components/Pagination";
import { ComponentSearch } from "@/components/Search";
import { Accordion, Button, Badge, List, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { orderBorrowed } from "../../lib/updateOrder";
import { Orders, Respuest } from "@/interface/Interface";
import { FiRefreshCcw } from "react-icons/fi"
import { toast } from "sonner";
interface SerchParams {
    searchParams: {
        query?: string;
        page?: string;
    };
}



interface DataObject {
    data: Array<any>;
    total: number;
}

export default function DashboardPage({ searchParams }: SerchParams) {
    const [update, setUpdate] = useState(false)
    return (
        <section>
            <DashBoard update={update} />
            <div className="grid grid-cols-2 gap-2">
                <section className="col-span-2">
                    <CardB searchParams={searchParams || ""} update={update} setUpdate={setUpdate} />
                </section>
            </div>
        </section>
    )
}

const DashBoard = ({ update }: { update?: boolean }) => {
    const { data: contentData } = ContentData({ update });
    const { data: userData } = UsersData({ update });
    const { data: publicaionData } = PublicationsData({ update });
    const { data: borrowedData } = ContentBorrowed({ update });

    return (
        <div className="mb-3 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <ComponentCard count={contentData?.total || 0} title="Inventario" href="/dashboard/contents" />
            <ComponentCard count={borrowedData?.total || 0} title="Prestamos" href="/dashboard/orders" />
            <ComponentCard count={publicaionData?.total || 0} title="Publicaciones" href="/dashboard/publications" />
            <ComponentCard count={userData?.total || 0} title="Usuarios" href="/dashboard/users" />
        </div>
    )
}

const CardB = ({ searchParams, update, setUpdate }: SerchParams & { update: boolean; setUpdate: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [size, setSize] = useState(5);
    const [refresh, setRefresh] = useState(false);
    const { data, pages, count: countData } = useOrdersData(size, currentPage, searchParams.query, update, refresh);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const importanceColorMap: { [key: string]: string } = {
        'ESPERA': 'warning',
        'PRESTADO': 'indigo',
        'DEVUELTO': 'success',
        'CANCELADO': 'failure',
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
    const prestar = async (id: number) => {
        setUpdate(true)
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
    }

    const cancelar = async (id: number) => {
        setUpdate(true)
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
    }
    useEffect(() => {
        if (update) {
            const timer = setTimeout(() => setUpdate(false), 1000); // Restablece update después de un segundo
            return () => clearTimeout(timer);
        }
    }, [update, setUpdate]);

    if (!data || data.length === 0) {
        return (
            <div>
                <ComponentSearch onChange={handleSizeChange} size={size} />
                <Accordion collapseAll>
                    <Accordion.Panel>
                        <div className="p-4 text-gray-500 dark:text-gray-400">
                            No hay órdenes disponibles.
                        </div>
                    </Accordion.Panel>
                </Accordion>
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
            </div>
        );
    }

    return (
        <div>
            <ComponentSearch onChange={handleSizeChange} size={size} />
            <Accordion collapseAll>
                {data.map((orde, index) => {
                    const badgeColor = importanceColorMap[String(orde.order_status)] || 'default';
                    return (
                        <Accordion.Panel key={orde.id}>
                            <Accordion.Title className="flex p-3">
                                <p>
                                    <span className="font-bold">Order #</span>  {(currentPage - 1) * size + index + 1} -
                                    <span className="ml-2"> {orde.user.name}</span>
                                </p>
                                <Badge className="ml-2 inline-block font-normal" color={badgeColor}>
                                    {orde.order_status}
                                </Badge>
                            </Accordion.Title>
                            <Accordion.Content className="dark:bg-gray-700">
                                <article className="flex w-full items-start justify-between space-y-2">
                                    <section className="grid w-full grid-cols-1 gap-y-2 text-gray-500 dark:text-gray-300 md:grid-cols-2">
                                        <div>
                                            <span className="font-semibold">Usuario:</span> {orde.user.name}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Correo:</span> {orde.user.email}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Libros:</span>
                                            <List className="ml-4">
                                                {orde.books.map((book, index) => (
                                                    <List.Item key={index}>{book.book_title_original}</List.Item>
                                                ))}
                                            </List>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Fecha:</span> {new Date(orde.order_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </section>
                                    <aside className="flex flex-col space-y-2 text-white">
                                        <Button
                                            aria-label="Aceptar"
                                            className="mt-4 bg-verde-700 hover:bg-verde-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-500 md:ml-4 md:mt-0"
                                            onClick={() => prestar(orde.id)}
                                        >
                                            Aceptar
                                        </Button>
                                        <Button
                                            aria-label="Cancelar"
                                            className="mt-4 bg-red-600 hover:bg-red-500 dark:text-white dark:hover:bg-red-500 md:ml-4 md:mt-0"
                                            onClick={() => cancelar(orde.id)}
                                        >
                                            Cancelar
                                        </Button>
                                    </aside>
                                </article>
                            </Accordion.Content>
                        </Accordion.Panel>
                    );
                })}
            </Accordion>
            <div className="m-auto flex justify-between">
                <div className="my-auto flex justify-between text-center text-gray-600 dark:text-gray-400">
                    <span className="ml-3 font-bold">
                        En espera:
                    </span>  {countData}
                </div>
                <ComponentPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={pages} />
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
            </div>

            <div>

            </div>
        </div >
    );
}



const useOrdersData = (size?: number, setCurrentPage?: number, query?: any, update?: boolean, refresh?: boolean) => {
    const [data, setData] = useState<Orders[]>([]);
    const [count, setCount] = useState(0);
    const [pages, setPages] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `/api/orders/admin?state=ESPERA&size=${size}&page=${setCurrentPage}&query=${query || ""}`;
                const res = await fetch(url);
                const result = await res.json();
                setData(result.data);
                setPages(result.totalPages || 0);
                setCount(result.total || 0);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [size, setCurrentPage, query, update, refresh]); // Ejecuta el fetch cada vez que update cambia

    return { data, pages, count };
}


const ContentData = ({ update }: { update: any }) => {
    const [data, setData] = useState<DataObject | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `/api/books/`;
                const res = await fetch(url);
                const result = await res.json();
                setData(result)
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [update])
    return { data }
}
const PublicationsData = ({ update }: { update: any }) => {
    const [data, setData] = useState<DataObject | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `/api/publications/`;
                const res = await fetch(url);
                const result = await res.json();
                setData(result)
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [update])
    return { data }
}
const UsersData = ({ update }: { update: any }) => {
    const [data, setData] = useState<DataObject | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `/api/users/`;
                const res = await fetch(url);
                const result = await res.json();
                setData(result)
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [update])
    return { data }
}
const ContentBorrowed = ({ update }: { update: any }) => {
    const [data, setData] = useState<DataObject | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `/api/orders/admin?state=PRESTADO`;
                const res = await fetch(url);
                const result = await res.json();
                setData(result)
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [update])
    return { data }
}