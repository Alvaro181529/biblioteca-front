"use client"
import { Button, Card, Label, TextInput, Tooltip } from "flowbite-react"
import { useEffect, useState } from "react"
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { User } from "@/app/dashboard/users/Interface/Interface"
import { updatePass, updateSession } from "./lib/updateSession"
import { signOut } from "next-auth/react";

export default function SettingPage() {
    const { data } = FetchUser()
    console.log(data);
    return (
        <section>
            <SectionSession data={data} />
            <SectionPass />
            <SectionAccountDelete />
        </section>
    )
}

const SectionSession = ({ data }: { data?: User | null }) => {
    return (
        <Card className="mb-2 grid w-full grid-cols-2  max-sm:grid-cols-1">
            <form action={updateSession}>
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
    return (
        <Card className="mb-2 grid w-full grid-cols-2  max-sm:grid-cols-1">
            <form action={updatePass}>
                <h5 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                    Actualizar constraseña
                </h5>
                <div className="relative">
                    <Button
                        onClick={togglePasswordVisibility}
                        className="absolute right-4 -translate-y-8 text-gray-600"
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

const SectionAccountDelete = () => {
    return (
        <Card className="mb-2 w-full  max-sm:grid-cols-1">
            <h5 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                Eliminar cuenta
            </h5>
            <section className="mt-2 flex">
                <Button aria-label="Eliminar" onClick={DeleteAccount} className="bg-red-600 dark:bg-red-700">Eliminar</Button>
            </section>
        </Card>
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
            console.log(result);
            signOut()
        } else {
            console.error("Error al eliminar la cuenta:", res.statusText);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
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