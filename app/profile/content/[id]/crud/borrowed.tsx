"use client"
import { createOrder } from "@/app/dashboard/books/[id]/lib/createOrder";
import { User } from "@/app/dashboard/users/Interface/Interface";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export function FormBorrowed({ user, id, setOpenModal }: { user: User | any, id?: number, setOpenModal: (open: boolean) => void }) {
    const router = useRouter()
    const handleClick = async () => {
        if (!user?.register.register_ci && !user?.register.register_professor) {
            alert("Necesita llenar los campos")
            router.push("/profile/settings")
        }
    }
    const handleCerrar = async () => {
        setOpenModal(false);
    }
    const onSave = async () => {
        setTimeout(() => {
            setOpenModal(false);
        }, 500);
    }

    return (
        <div className="text-center">
            <form id="submit-borrowed" action={createOrder} onSubmit={onSave}>
                <input name="id" id="id" hidden defaultValue={Number(user?.id)} />
                <input name="book" id="book" hidden defaultValue={id} />
            </form>
            <HiOutlineExclamationCircle className="mx-auto mb-4 size-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                ¿Estas deacuerdo con solicitar el prestamo?
            </h3>
            <div className="flex justify-center gap-4">
                <Button type="submit" onClick={handleClick} className="bg-verde-700" form="submit-borrowed">
                    {"Sí, estoy seguro"}
                </Button>
                <Button color="gray" onClick={handleCerrar} aria-label="No">

                    No, cancelar
                </Button>
            </div>
        </div>


    )
}
// const FetchUser = (id: number) => {
//     const [data, setData] = useState<User | null>(null);

//     useEffect(() => {
//         if (id) {
//             const fetchData = async () => {
//                 try {
//                     const url = `/api/users/me`;
//                     const res = await fetch(url);
//                     const result = await res.json();
//                     setData(result)
//                 } catch (error) {
//                     console.error("Error fetching data:", error);
//                 }
//             };
//             fetchData();
//         }
//     }, [id])
//     return { data }
// }