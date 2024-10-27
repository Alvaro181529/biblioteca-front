import { Table } from "flowbite-react";


export function InvoicesTableSkeleton() {
    return (
        <div className="overflow-x-auto">
            <Table>
                <Table.Head>
                    <Table.HeadCell>
                        <div className="h-6 w-32 rounded bg-gray-100"></div>
                    </Table.HeadCell>
                    <Table.HeadCell>
                        <div className="h-6 w-32 rounded bg-gray-100"></div>
                    </Table.HeadCell>
                    <Table.HeadCell>
                        <div className="h-6 w-32 rounded bg-gray-100"></div>
                    </Table.HeadCell>
                    <Table.HeadCell>
                        <div className="h-6 w-32 rounded bg-gray-100"></div>
                    </Table.HeadCell>
                    <Table.HeadCell>
                        <span className="sr-only">Edit</span>
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    <Filas></Filas>
                    <Filas></Filas>
                    <Filas></Filas>
                    <Filas></Filas>
                    <Filas></Filas>
                    <Filas></Filas>
                </Table.Body>
            </Table>
        </div>
    );
}

const Filas = () => {
    return (
        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell>
                <div className="h-6 w-32 rounded bg-gray-100"></div>
            </Table.Cell>
            <Table.Cell>
                <div className="h-6 w-32 rounded bg-gray-100"></div>
            </Table.Cell>
            <Table.Cell>
                <div className="h-6 w-32 rounded bg-gray-100"></div>
            </Table.Cell>
            <Table.Cell>
                <div className="h-6 w-32 rounded bg-gray-100"></div>
            </Table.Cell>
            <Table.Cell>
                <div className="flex gap-3">

                    <div className="size-[38px] rounded bg-gray-100"></div>
                    <div className="size-[38px] rounded bg-gray-100"></div>
                    <div className="size-[38px] rounded bg-gray-100"></div>
                </div>
            </Table.Cell>
        </Table.Row>
    )
}