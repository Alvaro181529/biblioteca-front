"use client"
import { Button, Card, Label, Spinner, Table, TextInput, Tooltip } from "flowbite-react"
import { useEffect, useState } from "react"
import { PiEye, PiEyeClosed, PiListDashes } from "react-icons/pi";
import { Respuest, User } from "@/interface/Interface";
import { updatePass, updateSession } from "@/lib/updateSession";
import { ComponentModalCreate } from "@/components/Modal";
import { FormDelete } from "./delete";
import { toast } from "sonner";
import { list } from "postcss";
import { ComponentTable } from "@/components/Table";

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
        <Card className="mb-2 grid w-full grid-cols-2 max-sm:grid-cols-1 ">
            <div className="flex w-full justify-between">
                <h5 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                    Actualizar constraseña
                </h5>
                <Tooltip content="Ver">
                    <Button
                        onClick={togglePasswordVisibility}
                        className=" text-gray-600 dark:text-gray-300"
                        aria-label="Mostrar/Ocultar Contraseña"
                        type="button"
                    >
                        {passwordVisible ? <PiEyeClosed className="size-5" /> : <PiEye className="size-5" />}
                    </Button>
                </Tooltip>
            </div>
            <form onSubmit={onSave}>
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
    const [openModal, setOpenModal] = useState(false);
    const [result, setResult] = useState<BackupList | null>(null);
    const Modal = () => {
        setOpenModal(true)
    }
    const closeModal = () => {
        setOpenModal(false);
    };
    const generarBackup = async () => {
        const data = await fetchBackupCreate();
        toast.success(data?.message)
    }
    const listBackup = async () => {
        const res: any = await fetchBackup();
        setResult(res);
        Modal();
    }

    return (
        <Card className="mb-2 w-full grid-cols-1 max-sm:grid-cols-2">
            <div className="flex w-full justify-between sm:w-1/2">
                <h2 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                    Copia de seguridad
                </h2>
                <Tooltip content="Lista de backups">
                    <Button
                        onClick={listBackup}
                        className=" text-gray-600 dark:text-gray-300"
                        aria-label="Mostrar/Ocultar Contraseña"
                        type="button"
                    >
                        <PiListDashes className="size-5" />
                    </Button>
                </Tooltip>
            </div>
            <p className="mt-2 text-base text-gray-800 dark:text-gray-400">
                Puedes generar una copia de seguridad de tus datos para mantenerlos protegidos.
                <br />
                Te recomendamos hacerlo regularmente para evitar pérdidas de información.
            </p>

            <section className="mt-4 flex">
                <Button
                    aria-label="Generar copia de seguridad"
                    className="bg-verde-600 "
                    onClick={generarBackup}
                >
                    Generar copia de seguridad
                </Button>
            </section>
            <ComponentModalCreate title={"Lista de backups"} openModal={openModal} setOpenModal={closeModal} status={false}>
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell>Nombre</Table.HeadCell>
                        <Table.HeadCell>Fecha</Table.HeadCell>
                        <Table.HeadCell>Descargar</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {result && Array.isArray(result) && result.map((item: BackupList) => (
                            <Table.Row key={item.fileName}>  {/* Usa item.filename o un ID único */}
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    <span className="block sm:hidden">
                                        {item.fileName.slice(0, 1)}{item.fileName.length > 8 && '...'}
                                    </span>

                                    <span className="hidden sm:block">
                                        {item.fileName}
                                    </span>
                                </Table.Cell>

                                {new Date(item.date).toLocaleDateString('es-ES', {
                                    weekday: 'long', // Muestra el día de la semana (opcional)
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                                <Table.Cell>
                                    <a href={`/api/backups/download?file=${encodeURIComponent(item.fileName)}`}
                                        className="font-medium text-verde-600 hover:underline dark:text-verde-500">
                                        Descargar
                                    </a>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

            </ComponentModalCreate>
        </Card >
    );
};


interface Backup {
    message: string;
    path: string;
}
interface BackupList {
    fileName: string;
    date: string;
}
const fetchBackupCreate = async (): Promise<Backup | null> => {
    try {
        const url = `/api/backups/create`;
        const res = await fetch(url);
        const result = await res.json();
        return result;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}
const fetchBackup = async (): Promise<BackupList[] | null> => {
    try {
        const url = `/api/backups`;
        const res = await fetch(url);
        const result: BackupList[] = await res.json();
        return result;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

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