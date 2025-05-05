import { User } from "@/interface/Interface";
import { Button, Spinner, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from "sonner";
interface deleteProps { data: any, setOpenModal: (open: boolean) => void }
export function FormDelete({ data, setOpenModal }: deleteProps) {
    const [usuario, setUsuario] = useState<User | null>(null);
    useEffect(() => {
        const fetchUserData = async () => {
            const usuarioData = await fetchUser(data);
            setUsuario(usuarioData);
        };
        fetchUserData();
    }, [data]);
    const handleElminar = async () => {
        await fetchData(data);
        setOpenModal(false);
    };

    const handleActivate = async () => {
        await fetchDataActivate(data);
        setOpenModal(false);
    };

    const handleDesactivar = async () => {
        await fetchDataDesactivate(data);
        setOpenModal(false);
    };
    if (!usuario) {
        return <div className="text-center"> <Spinner color="success" size="xl" /> </div>
    }
    return (
        <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 size-14 text-gray-400 dark:text-gray-200" />
            <h3 className=" text-lg font-normal text-gray-500 dark:text-gray-300">
                ¿Está seguro de eliminar al usuario {usuario?.name}?
            </h3>
            {!usuario.active ? (
                <h2 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-300">
                    Se eliminará también el registro de préstamos.
                </h2>
            ) : (
                <h2 className="m-2 text-lg font-normal text-gray-500 dark:text-gray-300">
                    El usuario quedara inactivo.
                </h2>
            )}
            <div className="flex justify-center gap-4">
                {usuario?.active ? (
                    <Button onClick={handleDesactivar} color="failure" aria-label="Desactivar">
                        {"Eliminar "}
                    </Button>
                ) : (
                    <div className="flex justify-between gap-5">
                        <Button onClick={handleActivate} color="success" aria-label="Activar" autoFocus>
                            {"Renovar"}
                        </Button>
                        <Tooltip content="Eliminar permanentemente">
                            <Button onClick={handleElminar} color="failure" aria-label="Eliminar">
                                {"Eliminar"}
                            </Button>
                        </Tooltip>
                    </div>
                )}
            </div>
        </div>
    )
}
const fetchDataDesactivate = async (id: number) => {
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
    return data
}

const fetchDataActivate = async (id: number) => {
    const response = await fetch(`/api/users/activate/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data: { message: string, user: User } = await response.json();
    if (!response.ok) {
        toast.error('No se pudo renovar el usuario', {
            description: data?.message
        })
        return;
    }
    toast.success('Usuario renovado correctamente', {
        description: data?.user?.name || ""
    })
    return data
}
const fetchData = async (id: number) => {
    const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data: { message: string, user: User } = await response.json();
    if (!response.ok) {
        toast.error('No se pudo eliminar el usuario', {
            description: data?.message
        })
        return;
    }
    toast.success('Usuario eliminada correctamente', {
        description: data?.user?.name || ""
    })
    return data
}
const fetchUser = async (id: number): Promise<User | null> => {
    const response = await fetch(`/api/users/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    if (!response.ok) {
        toast.error('No se pudo obtener el usuario', {
            description: data?.message || 'Error desconocido'
        });
        return null;
    }
    return data;
}