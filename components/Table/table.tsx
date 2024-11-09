"use client";

import { Table, Button, Tooltip, Card } from "flowbite-react";
import { MdModeEditOutline, MdDelete, MdRemoveRedEye } from "react-icons/md";
import { InvoicesTableSkeleton } from "../Skeleton/skeletons";
import { useEffect, useState } from "react";
interface TableProps {
    columns: string[];
    currentPage: number;
    itemsPerPage: number;
    data: (string | number)[][];
    onEdit: (rowIndex: any) => void;
    onDelete: (rowIndex: any) => void;
    onView: (rowIndex: any) => void;
    setOpenModal: (open: boolean) => void;
}
export function ComponentTable({ columns, data, onEdit, onDelete, onView, setOpenModal, currentPage, itemsPerPage }: TableProps) {
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
                <p className="text-gray-600">No hay resultados disponibles.</p>
                <span className="[&_p]:inline">
                    <a
                        onClick={() => setOpenModal(true)}
                        className="inline cursor-pointer font-medium text-verde-600 no-underline decoration-solid underline-offset-2 hover:underline dark:text-verde-500"
                    >
                        Añadir
                    </a>
                </span>
            </Card>
        );
    }


    return (
        <div className="overflow-x-auto">
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell className="bg-verde-700 text-white">N</Table.HeadCell>
                    {columns.map((col, index) => (
                        <Table.HeadCell className="bg-verde-700 text-white" key={index}>{col}</Table.HeadCell>
                    ))}
                    <Table.HeadCell className="grid justify-center bg-verde-700 p-2">
                        <Button className="flex justify-end bg-verde-500 ring-verde-300 hover:bg-verde-600 dark:bg-gray-600 dark:hover:bg-gray-500" onClick={() => setOpenModal(true)}>Añadir</Button>
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {data.map((row, rowIndex) => (
                        <Table.Row key={rowIndex} className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                            <Table.Cell key={rowIndex} className="whitespace-break-spaces font-medium text-gray-900 dark:text-white">
                                {(currentPage - 1) * itemsPerPage + rowIndex + 1}
                            </Table.Cell>
                            {row.map((cell, cellIndex) => (
                                <Table.Cell key={cellIndex} className="whitespace-break-spaces font-medium text-gray-900 dark:text-white">
                                    {cell}
                                </Table.Cell>
                            ))}
                            <Table.Cell className="m-auto flex justify-center gap-2 ">
                                <Tooltip content="Editar">
                                    <button
                                        onClick={() => onEdit(rowIndex)}
                                        className="m-auto  text-verde-600 hover:underline dark:text-verde-300"
                                    >
                                        <MdModeEditOutline className="text-xl" />
                                    </button>
                                </Tooltip>
                                <Tooltip content="Eliminar">
                                    <button
                                        onClick={() => onDelete(rowIndex)}
                                        className="m-auto text-red-600 hover:underline dark:text-verde-300"
                                    >
                                        <MdDelete className="text-xl" />
                                    </button>
                                </Tooltip>

                                <Tooltip content="Ver">
                                    <button
                                        onClick={() => onView(rowIndex)}
                                        className="m-auto text-gray-600 hover:underline dark:text-verde-300"
                                    >
                                        <MdRemoveRedEye className="text-xl" />
                                    </button>
                                </Tooltip>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
}