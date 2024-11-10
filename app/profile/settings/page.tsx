"use client"
import { Button, Card, Label, TextInput } from "flowbite-react"
import { updateRegister } from "./lib/updateRegister"
import { useEffect, useState } from "react"
import { User } from "@/app/dashboard/users/Interface/Interface"
import { useRouter } from "next/navigation"
import { updateSession } from "./lib/updateSession"

export default function SettingPage() {
    const router = useRouter()
    const { data } = FetchUser()
    return (
        <section>
            <SectionSession />
            <SectionAccount data={data} />
            <SectionMe />
            <SectionAccountDelete />
        </section>
    )
}

const SectionSession = ({ data }: { data?: User | null }) => {
    return (
        <Card className="mb-2 grid w-full grid-cols-2  max-sm:grid-cols-1">
            <form action={updateSession}>
                <h5 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                    Informacion del Usuario
                </h5>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email1" value="Nombre" />
                    </div>
                    <TextInput id="email1" type="text" placeholder="ca esta tu nombre" defaultValue={data?.name} required />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email1" value="Correo" />
                    </div>
                    <TextInput id="email1" type="email" placeholder="name@flowbite.com" defaultValue={data?.email} required />
                </div>
                <section className="mt-2 flex">
                    <Button type="submit" className="bg-verde-600 ">Guardar</Button>
                </section>
            </form>
        </Card>
    )
}
const SectionAccount = ({ data }: { data?: User | null }) => {
    return (
        <Card className="mb-2 grid w-full grid-cols-2 max-sm:grid-cols-1">
            <form action={updateRegister}>
                <h5 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                    Informacion de perfil
                </h5>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="register_ci" value="Carnet de identidad" />
                    </div>
                    <TextInput id="register_ci" name="register_ci" type="text" placeholder="123456789 - LP" defaultValue={data?.register?.register_ci} required autoFocus />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="register_contact" value="Número de telefono" />
                    </div>
                    <TextInput id="register_contact" name="register_contact" type="number" min={0} placeholder="87654321" defaultValue={data?.register.register_contact} required />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="register_professor" value="Docente" />
                    </div>
                    <TextInput id="register_professor" name="register_professor" type="text" placeholder="Juan Perez" defaultValue={data?.register.register_professor} />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="register_ubication" value="Ubicacion" />
                    </div>
                    <TextInput id="register_ubication" name="register_ubication" type="text" placeholder="Z/ buenos aires N/ 1223" defaultValue={data?.register.register_ubication} />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="register_intrument" value="Instrumento de especialidad" />
                    </div>
                    <TextInput id="register_intrument" name="register_intrument" type="text" placeholder="Guitarra" defaultValue={data?.register.register_intrument} />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="register_category" value="Categorias" />
                    </div>
                    <TextInput id="register_category" name="register_category" type="text" placeholder="Coro" defaultValue={data?.register.register_category} />
                </div>
                <section className="mt-2 flex">
                    <Button type="submit" className="bg-verde-600 ">Guardar</Button>
                </section>
            </form>
        </Card>
    )
}
const SectionMe = () => {
    return (
        <Card className="mb-2 grid w-full grid-cols-2  max-sm:grid-cols-1">
            <form action={updateSession}>
                <h5 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                    Actualizar constraseña
                </h5>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email1" value="Contraseña " />
                    </div>
                    <TextInput id="email1" type="email" placeholder="name@flowbite.com" required />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email1" value="Nueva contraseña" />
                    </div>
                    <TextInput id="email1" type="email" placeholder="name@flowbite.com" required />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email1" value="Nueva contraseña" />
                    </div>
                    <TextInput id="email1" type="email" placeholder="name@flowbite.com" required />
                </div>
                <section className="mt-2 flex">
                    <Button type="submit" className="bg-verde-600 ">Guardar</Button>
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
                <Button className="bg-red-600 dark:bg-red-700">Eliminar</Button>
            </section>
        </Card>
    )
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