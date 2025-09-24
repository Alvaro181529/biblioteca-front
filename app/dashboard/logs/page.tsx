"use client";
import { ComponentTable } from "@/components/Table";
import { useEffect, useState } from "react";

// Interfaces
interface Log {
    id: number;
    action: string;
    entity: string;
    entityId: string | null;
    user: string;
    changes: Record<string, any>;
    timestamp: string;
}

interface LogsResponse {
    data: Log[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Página principal
export default function LogsPage() {
    const [update, setUpdate] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [size, setSize] = useState(1000);

    const columns = [
        "id",
        "acción",
        "ruta",
        "usuario",
        "registros",
        "fecha de modificación",
    ];

    const { data, pages } = useFetchLogs(currentPage, size, update);

    // Dummy handlers (reemplaza por lógica real)
    const handleView = (item: any) => { };
    const handleEdit = (item: any) => { };
    const handleDelete = (item: any) => { };
    const setOpenModal = (value: boolean) => { };

    return (
        <div>
            <ComponentTable
                columns={columns}
                data={data}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentPage={currentPage}
                itemsPerPage={size}
                setOpenModal={setOpenModal}
                openButtons={true}
            />
        </div>
    );
}

// Hook para obtener logs
const useFetchLogs = (
    currentPage: number,
    size: number,
    refresh: boolean
) => {
    const [data, setData] = useState<(string | number)[][]>([]);
    const [pages, setPages] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/logs?page=${currentPage}&size=${size}`);
                const result: LogsResponse = await res.json();

                const formatChanges = (changes: Record<string, any>): string => {
                    const filtered = { ...changes };
                    delete filtered.password;
                    delete filtered.token;

                    return Object.entries(filtered)
                        .map(([key, value]) => {
                            if (typeof value === 'object') {
                                return `${key}: ${JSON.stringify(value)}`;
                            }
                            return `${key}: ${value}`;
                        })
                        .join('\n');
                };

                const transformed = result.data.map((log) => {
                    return [
                        log.id,
                        log.action,
                        log.entity,
                        log.user,
                        formatChanges(log.changes), // ← más legible
                        new Date(log.timestamp).toLocaleString(),
                    ];
                });
                setData(transformed);
                setPages(result.totalPages || 0);
            } catch (error) {
                console.error("Error fetching logs:", error);
            }
        };

        fetchData();
    }, [currentPage, size, refresh]);

    return { data, pages };
};
