"use client"
import { Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
interface deleteProps { publication: string, data: any, setOpenModal: (open: boolean) => void }
export function FormDelete({ publication, data, setOpenModal }: deleteProps) {
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
                ¿Esta seguro de eliminar la publicacion {publication}
            </h3>
            <div className="flex justify-center gap-4">
                <Button onClick={handleClick} color="failure" aria-label="Si">
                    {"Sí, estoy seguro"}
                </Button>
                <Button color="gray" onClick={handleCerrar} aria-label="No">

                    No, cancelar
                </Button>
            </div>
        </div>
    )
}
const fetchData = async (id: number) => {
    const response = await fetch(`/api/publications/${id}`, {
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