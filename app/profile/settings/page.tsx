"use client"
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { Button, Card, Label, Select, Spinner, TextInput } from "flowbite-react"
import { updateRegister } from "@/lib/updateRegister";
import { useEffect, useState } from "react"
import { Instrument, Respuest, User } from "@/interface/Interface";
import { updatePass, updateSession } from "@/lib/updateSession";
import { ComponentModalCreate } from "@/components/Modal";
import { FormDelete } from "./delete";
import { toast } from "sonner";

export default function SettingPage() {
    const { data } = FetchUser()
    return (
        <section className="w-full">
            <SectionSession data={data || null} />
            <SectionAccount data={data || null} />
            <SectionMe />
            <SectionAccountDelete data={data || null} />
        </section>
    )
}

const SectionSession = ({ data }: { data?: User | null }) => {
    if (!data) {
        return (
            <Card className="mb-2">
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
const SectionAccount = ({ data }: { data?: User | null }) => {
    const [query, setQuery] = useState("");
    const [number, setNumber] = useState("");
    const [expedition, setExpedition] = useState("LP");
    const { data: dataInstrument } = FetchInstrument(query || "")
    const registerCi = data?.register?.register_ci || "";
    useEffect(() => {
        const match = registerCi?.match(/^(\d{5,15})\s*-\s*([A-Za-z]{2})$/);
        if (match) {
            const number = match[1];
            const exp = match[2];
            setNumber(number)
            setExpedition(exp);
        } else {
            setExpedition("LP");
        }
    }, [registerCi]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setExpedition(event.target.value);
    };
    if (!data) {
        return (
            <Card className="mb-2">
                <h5 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                    Informacion del perfil
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
        const result: Respuest = await updateRegister(formData)
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
        <Card className="mb-2 grid w-full grid-cols-2 max-sm:grid-cols-1">
            <form onSubmit={onSave}>
                <h5 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                    Informacion del perfil
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
                    <TextInput id="register_contact" name="register_contact" type="number" min={0} placeholder="87654321" defaultValue={data?.register?.register_contact || ""} required />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="register_ubication" value="Direccion" />
                    </div>
                    <TextInput id="register_ubication" name="register_ubication" type="text" placeholder="Z/ buenos aires N/ 1223" defaultValue={data?.register?.register_ubication || ""} />
                </div>
                <div className="">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="register_professor" value="Docente" />
                        </div>
                        <TextInput id="register_professor" name="register_professor" type="text" placeholder="Juan Perez" defaultValue={data?.register?.register_professor || ""} />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="register_intrument" value="Instrumento de especialidad" />
                        </div>
                        <TextInput
                            id="register_instrument"
                            list="instrumentos"
                            name="register_instrument"
                            type="text"
                            placeholder="Coloca tu instrumento"
                            disabled={data?.register?.register_intrument ? false : true}
                            defaultValue={data?.register?.register_intrument || ""}
                        />
                        <datalist id="instrumentos">
                            {dataInstrument?.map((instrument) => (
                                <option key={instrument.id} value={instrument.instrument_name} />
                            ))}
                        </datalist>

                    </div>
                    <div className="hidden">
                        <div className="mb-2 block">
                            <Label htmlFor="register_category" value="Categorias (de interes)" />
                        </div>
                        <TextInput id="register_category" name="register_category" type="text" placeholder="Coro" defaultValue={data?.register?.register_category || ""} />
                    </div>
                </div>
                <section className="mt-2 flex">
                    <Button aria-label="Guardar" type="submit" className="bg-verde-600 ">Guardar</Button>
                </section>
            </form>
        </Card>
    )
}
const SectionMe = () => {
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
        <Card className="mb-2 grid w-full grid-cols-2  gap-2 max-sm:grid-cols-1">
            <form onSubmit={onSave}>
                <h5 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                    Actualizar constraseña
                </h5>
                <div className="relative">
                    <Button
                        onClick={togglePasswordVisibility}
                        className="absolute right-4 -translate-y-4 text-gray-600  dark:text-gray-300"
                        aria-label="Mostrar/Ocultar Contraseña"
                        type="button"
                    >
                        {passwordVisible ? <PiEyeClosed className="size-5" /> : <PiEye className="size-5" />}
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
                Se eliminará su cuenta.
                <br />
                Asegúrate de haber respaldado toda la información importante antes de continuar.
            </p>
            <ComponentModalCreate title={"Eliminacion de cuenta"} openModal={openModal} setOpenModal={closeModal} status={false}>
                <FormDelete setOpenModal={closeModal} id={Number(data?.id)} />
            </ComponentModalCreate>
            <section className="mt-2 flex">
                <Button aria-label="Eliminar" onClick={Modal} className="bg-red-600 dark:bg-red-700">Eliminar</Button>
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
const FetchInstrument = (query: string) => {
    const [data, setData] = useState<Instrument[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `/api/instruments?query=${query}`;
                const res = await fetch(url);
                const result = await res.json();
                setData(result.data || [])
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [query])
    return { data }
}