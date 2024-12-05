"use client"
import { Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from "sonner";
interface deleteProps { author: string, data: any, setOpenModal: (open: boolean) => void }
export function FormDelete({ author, data, setOpenModal }: deleteProps) {
    const handleClick = async () => {
        await fetchData(data);
        setOpenModal(false);
    };

    const handleCerrar = () => {
        setOpenModal(false);
    };
    return (
        <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 size-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                ¿Esta seguro de eliminar el autor {author}?
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
    const response = await fetch(`/api/authors/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data: { author_name: string, message: string } = await response.json();
    if (!response.ok) {
        toast.error("Error al eliminar", {
            description: data.message
        })
        return;
    }
    toast.success("Eliminado correctamente", {
        description: data.author_name
    })
    return data;
}