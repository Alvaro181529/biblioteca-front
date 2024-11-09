"use client"
import { Button } from "flowbite-react";
import { redirect, useRouter } from "next/navigation";
import { HiOutlineExclamationCircle } from "react-icons/hi";
interface deleteProps { instrumento: string, data: number, setOpenModal: (open: boolean) => void }
export function FormDelete({ instrumento, data, setOpenModal }: deleteProps) {
    const handleClick = async () => {
        await fetchData(data);
        setOpenModal(false); // Cerrar el modal después de eliminar
    };

    const handleCerrar = () => {
        setOpenModal(false); // Cerrar el modal al cancelar
    };
    return (
        <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 size-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                ¿Esta seguro de eliminar el intrumento {instrumento}
            </h3>
            <div className="flex justify-center gap-4">
                <Button onClick={handleClick} color="failure">
                    {"Sí, estoy seguro"}
                </Button>
                <Button color="gray" onClick={handleCerrar}>
                    No, cancelar
                </Button>
            </div>
        </div>
    )
}
const fetchData = async (id: number) => {
    const response = await fetch(`/api/instruments/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return data;
}