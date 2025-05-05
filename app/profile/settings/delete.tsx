"use client"
import { Button } from "flowbite-react";
import { signOut } from "next-auth/react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from "sonner";
interface deleteProps { setOpenModal: (open: boolean) => void, id: number }
export function FormDelete({ setOpenModal, id }: deleteProps) {
    const handleCerrar = () => {
        setOpenModal(false); // Cerrar el modal al cancelar
    };
    return (
        <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 size-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                ¿Esta seguro de eliminar su cuenta de usuario?
            </h3>
            <div className="flex justify-center gap-4">
                <Button onClick={() => DeleteAccount(id)} color="failure" aria-label="Si">
                    {"Sí, estoy seguro"}
                </Button>
                <Button color="gray" onClick={handleCerrar} aria-label="No">

                    No, cancelar
                </Button>
            </div>
        </div>
    )
}
const DeleteAccount = async (id: number) => {
    try {
        const response = await fetch(`/api/users/desactivate/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (!response.ok) {
            toast.error('No se pudo eliminar el usuario', {
                description: data?.message
            })
            return;
        }
        toast.success('Usuario eliminada correctamente', {
            description: data?.user?.name || ""
        })
        signOut()
        return data
    } catch (error) {
        toast.error('Error al elimnar la cuenta')
    }
}