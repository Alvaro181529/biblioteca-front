'use client'
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";

interface Signin {
    email: string;
    password: string;
}

export default function Home() {
    const [formData, setFormData] = useState<Signin>({ email: "", password: "" });
    const [errors, setErrors] = useState<Partial<Signin>>({});
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const validate = (): boolean => {
        const tempErrors: Partial<Signin> = {};
        if (!formData.email) tempErrors.email = "El email es requerido";
        if (!formData.password) tempErrors.password = "La contraseña es requerida";
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
        e.preventDefault();
        if (!validate()) return;

        const res = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            redirect: false
        });

        if (res?.error) {
            setError(res.error);
        } else {
            const user = await fetch('/api/auth/session').then(res => res.json());
            if (user) {
                if (user.user.rols.includes('ADMIN') || user.user.rols.includes('ROOT')) {
                    router.push("/dashboard");
                } else if (user.user.rols.includes("USUARIO") || user.user.rols.includes("ESTUDIANTE")) {
                    router.push("/profile");
                } else {
                    router.push("/");
                }
            }
        }
    };

    return (
        <main className="">
            <div className="h-screen w-screen bg-verde-700">
                <div className="flex h-full flex-1 flex-col items-center justify-center px-4 sm:px-0">
                    <div className="flex w-full rounded-lg bg-white shadow-2xl shadow-black sm:mx-0 sm:w-3/4 lg:w-1/2" style={{ height: "500px" }}>
                        <div className="flex w-full flex-col p-4 md:w-1/2">
                            <a href="/" className="mx-4 my-2 flex size-7 items-center">
                                <Image
                                    src={"/svg/arrow-left-circle.svg"}
                                    width={30}
                                    height={30}
                                    alt={"boton atras"}
                                    className="m-0 p-0 opacity-50"
                                />
                            </a>
                            {error && (
                                <span className="mx-auto mt-auto rounded-lg bg-red-500 p-3 font-semibold text-white">{error}</span>
                            )}
                            <div className="mb-8 flex flex-1 flex-col justify-center">
                                <h1 className="text-center text-4xl font-light">Bienvenido</h1>
                                <div className="mt-4 w-full">
                                    <form className="mx-auto w-3/4" onSubmit={onSubmit}>
                                        <div className="mt-4 flex">
                                            <input
                                                id="email"
                                                type="email"
                                                className="h-8 grow rounded-lg border border-gray-400 p-6 px-2 placeholder:text-gray-600 focus:border-verde-100 focus:outline-none"
                                                name="email"
                                                required
                                                placeholder="Correo"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                            {errors.email && (
                                                <span>{errors.email}</span>
                                            )}
                                        </div>
                                        <div className="mt-4 flex">
                                            <input
                                                id="password"
                                                type="password"
                                                className="h-8 grow rounded-lg border border-gray-400 p-6 px-2 placeholder:text-gray-600 focus:border-verde-100 focus:outline-none"
                                                name="password"
                                                required
                                                placeholder="Contraseña"
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                            {errors.password && (
                                                <span>{errors.password}</span>
                                            )}
                                        </div>
                                        <div className="mt-4 flex items-center">
                                            <input type="checkbox" name="remember" id="remember" className="mr-2" />
                                            <label htmlFor="remember" className="text-sm text-gray-700">Remember Me</label>
                                        </div>
                                        <div className="mt-8 flex flex-col">
                                            <button type="submit" className="rounded bg-verde-600 px-4 py-2 text-sm font-semibold text-white ring-1 ring-verde-100 hover:bg-verde-700  focus:border-verde-100 focus:outline-verde-200">
                                                Ingresar
                                            </button>
                                        </div>
                                    </form>
                                    <div className="mt-4 text-center">
                                        <a className="text-xs text-green-800 no-underline hover:underline" href="#">
                                            ¿Olvidaste tu Contraseña?
                                        </a>
                                        <Link className="mx-3 text-xs text-green-800 no-underline hover:underline" href="/auth/register">
                                            Registrar
                                        </Link>
                                    </div>
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
        </main>
    );
}
