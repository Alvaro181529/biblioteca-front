"use client"
import { Instrument } from "@/interface/Interface";
import { Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from "sonner";
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
                ¿Esta seguro de eliminar el intrumento {instrumento}?
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
    const response = await fetch(`/api/instruments/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data: { message: string, instrument: Instrument } = await response.json();
    if (!response.ok) {
        toast.error('No se pudo eliminar el instrumento', {
            description: data.message
        })
        return;
    }
    toast.success('Instrumento eliminado correctamente', {
        description: data.instrument.instrument_name
    })
    return data
}