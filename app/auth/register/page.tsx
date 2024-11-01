'use client'
import Image from "next/image";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/app/dashboard/users/lib/createUser";

interface Signin {
    name: string;
    email: string;
    password: string;
    confirmPass: string;
}

export default function Login() {
    const [formData, setFormData] = useState<Signin>({
        name: "",
        email: "",
        password: "",
        confirmPass: ""
    });
    const [errors, setErrors] = useState<Partial<Signin>>({});
    const router = useRouter();

    const validate = (): boolean => {
        const tempErrors: Partial<Signin> = {};
        if (!formData.name) tempErrors.name = "El nombre de usuario es requerido";
        if (!formData.email) tempErrors.email = "El email es requerido";
        if (!formData.password) tempErrors.password = "La contraseña es requerida";
        if (formData.password !== formData.confirmPass) tempErrors.confirmPass = "Las contraseñas no coinciden";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const onSubmit = async (e: FormEvent) => {
        if (!validate()) return;
        setTimeout(() => {
            router.push("/auth/login");
        }, 500);
    };

    return (
        <div className="h-screen w-screen bg-verde-700">
            <div className="flex h-full flex-1 flex-col items-center justify-center px-2 sm:px-0">
                <div className="flex w-full rounded-lg bg-white shadow-2xl shadow-black sm:mx-0 sm:w-3/4 lg:w-1/2" style={{ height: "500px" }}>
                    <div className="flex w-full flex-col p-4 md:w-1/2">
                        <a href="/user" className="mx-4 my-2 flex size-7 items-center">
                            <Image
                                src={"/svg/arrow-left-circle.svg"}
                                width={30}
                                height={30}
                                alt={"boton atras"}
                                className="m-0 p-0 opacity-50"
                            />
                        </a>
                        <div className="mb-8 flex flex-1 flex-col justify-center">
                            <h1 className="text-center text-4xl font-extralight">Registro</h1>
                            <div className="mt-4 w-full">
                                <form onSubmit={onSubmit} action={createUser} className="mx-auto w-3/4">
                                    <div className="mt-4 flex">
                                        <input
                                            type="text"
                                            name="name"
                                            className="h-8 grow rounded-lg border border-gray-400 p-6 px-2 placeholder:text-gray-600 focus:border-verde-100 focus:outline-none"
                                            placeholder="Nombre"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && (
                                            <span className="text-red-500">{errors.name}</span>
                                        )}
                                    </div>
                                    <div className="mt-4 flex">
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            className="h-8 grow rounded-lg border border-gray-400 p-6 px-2 placeholder:text-gray-600 focus:border-verde-100 focus:outline-none"
                                            placeholder="Correo"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                        {errors.email && (
                                            <span className="text-red-500">{errors.email}</span>
                                        )}
                                    </div>
                                    <div className="mt-4 flex">
                                        <input
                                            type="password"
                                            name="password"
                                            className="h-8 grow rounded-lg border border-gray-400 p-6 px-2 placeholder:text-gray-600 focus:border-verde-100 focus:outline-none"
                                            placeholder="Contraseña"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        {errors.password && (
                                            <span className="text-red-500">{errors.password}</span>
                                        )}
                                    </div>
                                    <div className="mt-4 flex">
                                        <input
                                            type="password"
                                            name="confirmPass"
                                            className="h-8 grow rounded-lg border border-gray-400 p-6 px-2 placeholder:text-gray-600 focus:border-verde-100 focus:outline-none"
                                            placeholder="Confirmar Contraseña"
                                            value={formData.confirmPass}
                                            onChange={handleChange}
                                        />
                                        {errors.confirmPass && (
                                            <span className="text-red-500">{errors.confirmPass}</span>
                                        )}
                                    </div>
                                    <div className="mt-8 flex flex-col">
                                        <button type="submit" className="rounded bg-verde-700 px-4 py-2 text-sm font-semibold text-white hover:bg-verde-400">
                                            Ingresar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <Image
                        src={"/imagenes/concer.png"}
                        className={"hidden rounded-r-lg bg-cover bg-center bg-no-repeat md:block md:w-1/2"}
                        width={1000}
                        height={1000}
                        alt={"consevatorio"}
                    />
                </div>
            </div>
        </div>
    );
}
