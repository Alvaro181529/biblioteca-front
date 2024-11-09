import { Card, Table } from "flowbite-react";
export function InvoicesTableSkeleton() {
    return (
        <div className="overflow-x-auto">
            <Table>
                <Table.Head>
                    <Table.HeadCell>
                        <div className="h-6 w-32 animate-pulse rounded bg-gray-100"></div>
                    </Table.HeadCell>
                    <Table.HeadCell>
                        <div className="h-6 w-32 animate-pulse rounded bg-gray-100"></div>
                    </Table.HeadCell>
                    <Table.HeadCell>
                        <div className="h-6 w-32 animate-pulse rounded bg-gray-100"></div>
                    </Table.HeadCell>
                    <Table.HeadCell>
                        <div className="h-6 w-32 animate-pulse rounded bg-gray-100"></div>
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
                <div className="h-6 w-32  animate-pulse rounded bg-gray-100"></div>
            </Table.Cell>
            <Table.Cell>
                <div className="h-6 w-32  animate-pulse rounded bg-gray-100"></div>
            </Table.Cell>
            <Table.Cell>
                <div className="h-6 w-32  animate-pulse rounded bg-gray-100"></div>
            </Table.Cell>
            <Table.Cell>
                <div className="h-6 w-32  animate-pulse rounded bg-gray-100"></div>
            </Table.Cell>
            <Table.Cell>
                <div className="flex gap-3">
                    <div className="size-[38px] animate-pulse rounded bg-gray-100"></div>
                    <div className="size-[38px] animate-pulse rounded bg-gray-100"></div>
                    <div className="size-[38px] animate-pulse rounded bg-gray-100"></div>
                </div>
            </Table.Cell>
        </Table.Row>
    )
}

export function InvoicesCardSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 ">
            <CardInvoice />
            <CardInvoice />
            <CardInvoice />
            <CardInvoice />
        </div>
    )
}

const CardInvoice = () => {
    return (
        <Card className=" h-52 w-full ">
            <div className=" flex items-center gap-2 ">
                <div className=" h-48 w-1/2 animate-pulse rounded-t-lg bg-gray-100 "></div>
                <div className="w-full ">
                    <div className="mb-2 h-4  animate-pulse rounded-full bg-gray-100"></div>
                    <div className="mb-2 h-2  animate-pulse rounded-full bg-gray-100"></div>
                    <div className="mb-2 h-2  animate-pulse rounded-full bg-gray-100"></div>
                    <div className="mb-4 h-2  animate-pulse rounded-full bg-gray-100"></div>
                    <div className="flex items-center">
                        <div className="mr-2 h-4 w-1/4 animate-pulse rounded-full bg-gray-100"></div>
                        <div className="h-4 w-3/4 animate-pulse rounded-full bg-gray-100"></div>
                    </div>
                </div>
            </div>
        </Card>
    )
}


export function InvoicesCardUserSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 ">
            <CardUser />
            <CardUser />
            <CardUser />
            <CardUser />
        </div>
    )
}

const CardUser = () => {
    return (
        <Card className="relative overflow-hidden">
            {/* Barra de carga superior */}
            <div className="absolute left-0 top-0 h-full w-2 animate-pulse bg-gray-200" />

            {/* Título y sub-título */}
            <div className="flex items-center justify-between">
                <h2 className="h-6 w-24 animate-pulse bg-gray-300 text-lg font-semibold"></h2>
                <div className="mb-2 h-4 w-16 animate-pulse rounded-full bg-gray-200"></div>
            </div>

            {/* Información secundaria */}
            <div className="flex items-center text-sm text-gray-600">
                <div className="mb-2 h-4 w-20 animate-pulse rounded-full bg-gray-200"></div>
            </div>

            {/* Línea separadora */}
            <Card>
                {/* Sección inferior con avatar y texto */}
                <div className="flex w-full items-center">
                    <div className="size-[38px] animate-pulse bg-gray-200"></div>
                    <div className="ml-4 flex-1">
                        <div className="mb-2 h-4 w-full animate-pulse rounded-full bg-gray-200"></div>
                        <div className="m-auto justify-end gap-2">
                            <div className="mb-2 h-4 w-16 animate-pulse rounded-full bg-gray-200"></div>
                        </div>
                    </div>
                </div>
            </Card>
        </Card>
    );
}
