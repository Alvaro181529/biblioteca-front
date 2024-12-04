"use client"
import { createOrder } from "@/lib/createOrder";
import { Respuest, User } from "@/interface/Interface";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from "sonner";

export function FormBorrowed({ user, id, setOpenModal }: { user: User | any, id?: number, setOpenModal: (open: boolean) => void }) {
    const router = useRouter()
    const handleClick = async () => {
        if (!user?.register.register_ci && !user?.register.register_professor) {
            toast('¡Faltan campos por completar!', {
                description: 'Para poder continuar, necesitamos que completes tu informacion',
                action: {
                    label: 'Completar perfil',
                    onClick: () => router.push("/profile/settings"),
                },
                duration: 5000,
            });
        }
    }
    const handleCerrar = async () => {
        setOpenModal(false);
    }
    const onSave = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement);
        const result: Respuest = await createOrder(formData)
        if (!result.success) {
            toast.error(result.message);
            return
        }
        toast.success(result.message);
        setOpenModal(false);
    }

    return (
        <div className="text-center">
            <form id="submit-borrowed" onSubmit={onSave}>
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