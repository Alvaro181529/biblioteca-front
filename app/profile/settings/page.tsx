"use client"
import { Button, Card, Label, Select, TextInput } from "flowbite-react"
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
            <SectionSession data={data} />
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
    const [expedition, setExpedition] = useState("LP");
    const [number, setNumber] = useState("");
    const registerCi = data?.register.register_ci;
    useEffect(() => {
        const match = registerCi?.match(/^(\d{7,8})\s*-\s*([A-Za-z]{2})$/);
        if (match) {
            const number = match[1];
            const exp = match[2];
            setNumber(number)
            setExpedition(exp);
        } else {
            setExpedition("SC");
        }
    }, [registerCi]);
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setExpedition(event.target.value);
    };
    return (
        <Card className="mb-2 grid w-full grid-cols-2 max-sm:grid-cols-1">
            <form action={updateRegister}>
                <h5 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                    Informacion de perfil
                </h5>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="register_ci" value="Carnet de identidad" />
                        </div>
                        <TextInput id="register_ci" name="register_ci" type="text" placeholder="123456789" defaultValue={number} required autoFocus />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="register_exp" value="Expedito" />
                        </div>
                        <Select name="register_exp" className="mb-2" id="register_exp" value={expedition} onChange={handleChange}>
                            <option value="LP">La Paz</option>
                            <option value="OR">Oruro</option>
                            <option value="CBBA">Cochabamba</option>
                            <option value="SC">Santa Cruz de la Sierra</option>
                            <option value="BN">Beni</option>
                            <option value="PT">Potosí</option>
                            <option value="TR">Tarija</option>
                            <option value="CH">Chuquisaca</option>
                            <option value="PD">Pando</option>
                        </Select>
                    </div>
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
                        <Label htmlFor="email1" value="Contraseña actual" />
                    </div>
                    <TextInput id="email1" type="password" autoComplete="new-password" placeholder="name@flowbite.com" required />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email1" value="Nueva contraseña" />
                    </div>
                    <TextInput id="email1" type="password" placeholder="name@flowbite.com" required />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email1" value="Confirmar nueva contraseña" />
                    </div>
                    <TextInput id="email1" type="password" placeholder="name@flowbite.com" required />
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