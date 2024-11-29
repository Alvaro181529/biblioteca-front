"use client"
import { ComponentModalCreate } from "@/components/Modal/Modal";
import { Button } from "flowbite-react";
import { redirect, useRouter } from "next/navigation";
import { HiOutlineExclamationCircle } from "react-icons/hi";
export function FormDelete({ contnet, data, setOpenModal }: { contnet: string, data: any, setOpenModal: (open: boolean) => void }) {

    const handleClick = async () => {
        await fetchData(data)
        setOpenModal(false);
    }
    const handleCerrar = async () => {
        setOpenModal(false);
    }

    return (
        <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 size-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                ¿Esta seguro de eliminar contenido {contnet}
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
    const response = await fetch(`/api/contents/${id}`, {
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