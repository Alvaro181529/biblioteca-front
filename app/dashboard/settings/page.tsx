"use client"
import { Button, Card, Label, Spinner, TextInput, Tooltip } from "flowbite-react"
import { useEffect, useState } from "react"
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { Respuest, User } from "@/interface/Interface";
import { updatePass, updateSession } from "@/lib/updateSession";
import { ComponentModalCreate } from "@/components/Modal";
import { FormDelete } from "./delete";
import { toast } from "sonner";

export default function SettingPage() {
    const { data } = FetchUser()
    return (
        <section>
            <SectionSession data={data} />
            <SectionPass />
            <SectionBackups />
            <SectionAccountDelete data={data || null} />
        </section>
    )
}

const SectionSession = ({ data }: { data?: User | null }) => {
    if (!data) {
        return (
            <Card >
                <h5 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                    Informacion del Usuario
                </h5>
                <div className="text-center">
                    <Spinner color="success" aria-label="Success spinner" size="xl" />
                </div>
            </Card>
        )
    }
    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const result: Respuest = await updateSession(formData)
        if (!result.success) {
            toast.error(result.message, {
                description: result.description
            });
            return
        }
        toast.success(result.message, {
            description: result.description
        });
    }
    return (
        <Card className="mb-2 grid w-full grid-cols-2  max-sm:grid-cols-1">
            <form onSubmit={onSave}>
                <input type="text" id="id" name="id" defaultValue={data?.id} hidden />
                <h5 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                    Informacion del Usuario
                </h5>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="name" value="Nombre" />
                    </div>
                    <TextInput id="name" name="name" type="text" placeholder="ca esta tu nombre" defaultValue={data?.name} required />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email" value="Correo" />
                    </div>
                    <TextInput id="email" name="email" type="email" placeholder="name@flowbite.com" defaultValue={data?.email} required />
                </div>
                <section className="mt-2 flex">
                    <Button aria-label="Guardar" type="submit" className="bg-verde-600 ">Guardar</Button>
                </section>
            </form>
        </Card>
    )
}
const SectionPass = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
    };
    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const result: Respuest = await updatePass(formData)
        if (!result.success) {
            toast.error(result.message, {
                description: result.description
            });
            return
        }
        toast.success(result.message, {
            description: result.description
        });
    }
    return (
        <Card className="mb-2 grid w-full grid-cols-2  max-sm:grid-cols-1">
            <form onSubmit={onSave}>
                <h5 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                    Actualizar constraseña
                </h5>
                <div className="relative">
                    <Button
                        onSubmit={togglePasswordVisibility}
                        className="absolute right-4 -translate-y-4 text-gray-600 dark:text-gray-300"
                        aria-label="Mostrar/Ocultar Contraseña"
                        type="button"
                    >
                        <Tooltip content="Ver">
                            {passwordVisible ? <PiEyeClosed className="size-5" /> : <PiEye className="size-5" />}
                        </Tooltip>
                    </Button>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password-current" value="Contraseña actual" />
                    </div>
                    <TextInput id="password-current" name="password-current" type={passwordVisible ? "text" : "password"} autoComplete="new-password" placeholder="Contraseña actual" required />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password-new" value="Nueva contraseña" />
                    </div>
                    <TextInput id="password-new" name="password-new" type={passwordVisible ? "text" : "password"} placeholder="Contraseña nueva" required />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password-confirmed" value="Confirmar nueva contraseña" />
                    </div>
                    <TextInput id="password-confirmed" name="password-confirmed" type={passwordVisible ? "text" : "password"} placeholder="Confirmar contraseña" required />
                </div>
                <section className="mt-2 flex">
                    <Button aria-label="Guardar" type="submit" className="bg-verde-600 ">Guardar</Button>
                </section>
            </form>
        </Card>
    )
}

const SectionAccountDelete = ({ data }: { data: User | null }) => {
    const [openModal, setOpenModal] = useState(false);
    const Modal = () => {
        setOpenModal(true)
    }
    const closeModal = () => {
        setOpenModal(false);
    };
    return (
        <Card className="mb-2 w-full  max-sm:grid-cols-1">
            <h5 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                Eliminar cuenta
            </h5>
            <p className="mt-2 text-base text-gray-800 dark:text-gray-400 ">
                Esta acción es <strong>irreversible</strong> y eliminará permanentemente tu cuenta y todos los datos asociados.
                <br />
                Asegúrate de haber respaldado toda la información importante antes de continuar.
            </p>
            <ComponentModalCreate title={"Eliminacion de cuenta"} openModal={openModal} setOpenModal={closeModal} status={false}>
                <FormDelete setOpenModal={closeModal} id={Number(data?.id)} />
            </ComponentModalCreate>
            <section className="mt-2 flex">
                <Button aria-label="Eliminar" onSubmit={Modal} className="bg-red-600 dark:bg-red-700">Eliminar</Button>
            </section>

        </Card>
    )
}

const SectionBackups = () => {

    return (
        <Card className="mb-2 w-full max-sm:grid-cols-1">
            <h2 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                Copia de seguridad
            </h2>

            <p className="mt-2 text-base text-gray-800 dark:text-gray-400">
                Puedes generar una copia de seguridad de tus datos para mantenerlos protegidos.
                <br />
                Te recomendamos hacerlo regularmente para evitar pérdidas de información.
            </p>

            <section className="mt-4 flex">
                <Button
                    aria-label="Generar copia de seguridad"
                    className="bg-verde-600 "
                >
                    Generar copia de seguridad
                </Button>
            </section>
        </Card>
    );
};





const FetchUser = () => {
    const [data, setData] = useState<User | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `/api/users/me`;
                const res = await fetch(url);
                const result = await res.json();
                setData(result)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [])
    return { data }
}