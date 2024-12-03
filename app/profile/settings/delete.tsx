"use client"
import { Button } from "flowbite-react";
import { signOut } from "next-auth/react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
interface deleteProps { setOpenModal: (open: boolean) => void }
export function FormDelete({ setOpenModal }: deleteProps) {
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
                <Button onClick={DeleteAccount} color="failure" aria-label="Si">
                    {"Sí, estoy seguro"}
                </Button>
                <Button color="gray" onClick={handleCerrar} aria-label="No">

                    No, cancelar
                </Button>
            </div>
        </div>
    )
}
const DeleteAccount = async () => {
    try {
        const url = '/api/users';  // Aquí llamas al API del backend que define el DELETE
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (res.ok) {
            const result = await res.json();
            signOut()
        } else {
            console.error("Error al eliminar la cuenta:", res.statusText);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}