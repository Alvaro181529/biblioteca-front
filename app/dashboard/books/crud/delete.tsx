import { Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from "sonner";

interface deleteProps { libro: string; data: any; setOpenModal: (open: boolean) => void }
export function FormDelete({ libro, data, setOpenModal }: deleteProps) {

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
                ¿Está seguro de eliminar el libro {libro}?
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
    );
}
const fetchData = async (id: number) => {
    const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data: { book_title_original: string, message: string } = await response.json();
    if (!response.ok) {
        toast.error('No se pudo elimnar el articulo del inventario')
        return;
    }
    toast.success('Articulo del inventario eliminada correctamente', { description: data.book_title_original })

    return data;
}