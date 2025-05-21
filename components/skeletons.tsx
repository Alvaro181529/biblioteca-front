import { Card, Table } from "flowbite-react";
export function InvoicesTableSkeleton() {
    return (
        <div className="overflow-x-auto">
            <Table>
                <Table.Head>
                    <Table.HeadCell>
                        <div className="h-6 w-32 animate-pulse rounded bg-gray-100 dark:bg-gray-500"></div>
                    </Table.HeadCell>
                    <Table.HeadCell>
                        <div className="h-6 w-32 animate-pulse rounded bg-gray-100 dark:bg-gray-500"></div>
                    </Table.HeadCell>
                    <Table.HeadCell>
                        <div className="h-6 w-32 animate-pulse rounded bg-gray-100 dark:bg-gray-500"></div>
                    </Table.HeadCell>
                    <Table.HeadCell>
                        <div className="h-6 w-32 animate-pulse rounded bg-gray-100 dark:bg-gray-500"></div>
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
                <div className="h-6 w-32  animate-pulse rounded bg-gray-100 dark:bg-gray-500"></div>
            </Table.Cell>
            <Table.Cell>
                <div className="h-6 w-32  animate-pulse rounded bg-gray-100 dark:bg-gray-500"></div>
            </Table.Cell>
            <Table.Cell>
                <div className="h-6 w-32  animate-pulse rounded bg-gray-100 dark:bg-gray-500"></div>
            </Table.Cell>
            <Table.Cell>
                <div className="h-6 w-32  animate-pulse rounded bg-gray-100 dark:bg-gray-500"></div>
            </Table.Cell>
            <Table.Cell>
                <div className="flex gap-3">
                    <div className="size-[38px] animate-pulse rounded bg-gray-100 dark:bg-gray-500"></div>
                    <div className="size-[38px] animate-pulse rounded bg-gray-100 dark:bg-gray-500"></div>
                    <div className="size-[38px] animate-pulse rounded bg-gray-100 dark:bg-gray-500"></div>
                </div>
            </Table.Cell>
        </Table.Row>
    )
}

export function InvoicesCardSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <CardInvoice />
            <CardInvoice />
            <CardInvoice />
            <CardInvoice />
        </div>
    )
}

const CardInvoice = () => {
    return (
        <Card className="w-full ">
            <div className=" h-80 w-full animate-pulse rounded-t-lg bg-gray-100 dark:bg-gray-500 max-sm:h-96 "></div>
            <div className=" flex items-center gap-2 ">
                <div className="w-full ">
                    <div className="flex w-full items-center justify-between">
                        <div className="mb-2 h-4 w-1/2 animate-pulse rounded-full bg-gray-100 dark:bg-gray-500 max-sm:h-8"></div>
                        <div className="mb-2 h-4 w-1/5 animate-pulse rounded-full bg-gray-100 dark:bg-gray-500 max-sm:h-8"></div>
                    </div>
                    <div className="my-2 h-4 animate-pulse rounded-full bg-gray-100 dark:bg-gray-500 max-sm:h-6"></div>
                    <div className="my-2 h-4 animate-pulse rounded-full bg-gray-100 dark:bg-gray-500 max-sm:h-6"></div>
                    <div className="my-2 h-4 animate-pulse rounded-full bg-gray-100 dark:bg-gray-500 max-sm:h-6"></div>
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
            <div className="absolute left-0 top-0 h-full w-2 animate-pulse bg-gray-200 dark:bg-gray-500" />

            <div className="flex items-center justify-between">
                <h2 className="h-6 w-24 animate-pulse bg-gray-300 text-lg font-semibold dark:bg-gray-500"></h2>
                <div className="mb-2 h-4 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-500"></div>
            </div>

            <div className="flex items-center text-sm text-gray-600">
                <div className="mb-2 h-4 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-500"></div>
            </div>

            <Card>
                <div className="flex w-full items-center">
                    <div className="size-[38px] animate-pulse bg-gray-200 dark:bg-gray-500"></div>
                    <div className="ml-4 flex-1">
                        <div className="mb-2 h-4 w-full animate-pulse rounded-full bg-gray-200 dark:bg-gray-500"></div>
                        <div className="m-auto justify-end gap-2">
                            <div className="mb-2 h-4 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-500"></div>
                        </div>
                    </div>
                </div>
            </Card>
        </Card>
    );
}

export function InvoicesCardPageSkeleton() {
    return (
        <div className="col-span-full grid gap-4 text-start max-lg:grid-cols-4 max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <CardPage />
            <CardPage />
            <CardPage />
        </div>
    )
}
const CardPage = () => {
    return (
        <div className="animate-pulse overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="flex">
                <div className="h-44 w-60 rounded-s-md bg-gray-300 dark:bg-gray-500" />
                <div className="ml-4 w-full py-2 pe-3">
                    <div className="mb-2 h-6 w-3/4 bg-gray-300 dark:bg-gray-500" />
                    <div className="mb-4 h-4 w-1/2 bg-gray-300 dark:bg-gray-500" />
                    <div className="mt-2">
                        <div className="mb-1 h-4 w-1/2 bg-gray-300 dark:bg-gray-500" />
                        <div className="mb-1 h-4 w-2/3 bg-gray-300 dark:bg-gray-500" />
                    </div>
                </div>
            </div>
        </div>
    )
}