'use client'
import { AiOutlineLoading } from "react-icons/ai";
import { ToastDanger } from "@/components/Toast/Toast";
import { Button } from "flowbite-react";
import { signIn } from "next-auth/react";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import AuthComponent from "@/components/auth/Auth";

interface Signin {
    email: string;
    password: string;
}

export default function Home() {
    const [formData, setFormData] = useState<Signin>({ email: "", password: "" });
    const [errors, setErrors] = useState<Partial<Signin>>({});
    const [signin, setSignin] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
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
        console.log(name);
        console.log(value);
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
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
                setSignin(true)
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
        <AuthComponent>
            {error && (
                <ToastDanger titulo={error} />
            )}
            <h1 className="text-center text-4xl font-light">Bienvenido</h1>
            <div className="mt-4 w-full">
                <form className="mx-auto w-3/4" onSubmit={onSubmit}>
                    <div className="mt-4 flex">
                        <input
                            id="email"
                            type="email"
                            className="h-8 w-full grow rounded-lg border border-gray-400 p-6 px-2 placeholder:text-gray-600 focus:border-verde-100 focus:outline-none"
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
                        <div className="relative w-full">
                            <input
                                id="password"
                                type={passwordVisible ? "text" : "password"}
                                className="h-8 w-full grow rounded-lg border border-gray-400 p-6 px-2 placeholder:text-gray-600 focus:border-verde-100 focus:outline-none"
                                name="password"
                                required
                                placeholder="Contraseña"
                                defaultValue={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                            >
                                {passwordVisible ? <PiEyeClosed className="size-5" /> : <PiEye className="size-5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <span>{errors.password}</span>
                        )}
                    </div>
                    <div className="mt-4 flex items-center">
                        <input type="checkbox" name="remember" id="remember" className="mr-2" />
                        <label htmlFor="remember" className="text-sm text-gray-700">Remember Me</label>
                    </div>
                    <div className="mt-8 flex flex-col items-center">
                        <Button
                            type="submit"
                            isProcessing={signin}
                            processingSpinner={<AiOutlineLoading className="size-6 animate-spin" />}
                            className="w-full rounded bg-verde-600 px-4 text-sm font-semibold text-white ring-1 ring-verde-100 hover:bg-verde-700  focus:border-verde-100 focus:outline-verde-200">
                            Ingresar
                        </Button>
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
        </AuthComponent>

    );
}
