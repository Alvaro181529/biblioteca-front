'use client'
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import AuthComponent from "@/components/Auth";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { signup } from "@/lib/signup";

interface Signin {
    name: string;
    email: string;
    password: string;
    confirmPass: string;
}

export default function Login() {
    const [signin, setSignin] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordConfirmedVisible, setPasswordConfirmedVisible] = useState(false);
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
    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
    };
    const togglePasswordConfirmedVisibility = () => {
        setPasswordConfirmedVisible((prevState) => !prevState);
    };
    const onSubmit = async (e: FormEvent) => {
        if (!validate()) return;
        setSignin(true)
        setTimeout(() => {
            router.push("/auth/login");
        }, 500);
    };

    return (
        <AuthComponent href="/auth/login">
            <h1 className="text-center text-4xl font-extralight dark:text-white">Registro</h1>
            <div className="mt-4 w-full">
                <form onSubmit={onSubmit} action={signup} className="mx-auto w-3/4">
                    <div className="mt-4 flex">
                        <input
                            type="text"
                            name="name"
                            className="h-8 w-full grow rounded-lg border border-gray-400 p-6 px-2 placeholder:text-gray-500 focus:border-verde-100 focus:outline-none  dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-200"
                            placeholder="Nombre"
                            value={formData.name}
                            onChange={handleChange}
                            required
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
                            className="h-8 w-full grow rounded-lg border border-gray-400 p-6 px-2 placeholder:text-gray-500 focus:border-verde-100 focus:outline-none  dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-200"
                            placeholder="Correo"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <button
                            aria-label="login"
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                        >
                            {passwordVisible ? <PiEyeClosed className="size-5 dark:text-gray-400" /> : <PiEye className="size-5 dark:text-gray-400" />}
                        </button>
                        {errors.email && (
                            <span className="text-red-500">{errors.email}</span>
                        )}
                    </div>
                    <div className="relative mt-4 flex w-full">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            className="h-8 w-full grow rounded-lg border border-gray-400 p-6 px-2 placeholder:text-gray-500 focus:border-verde-100 focus:outline-none  dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-200"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            aria-label="contraseña"
                            required
                        />
                        <button
                            aria-label="ver contraseña"
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                        >
                            {passwordVisible ? <PiEyeClosed className="size-5 dark:text-gray-400" /> : <PiEye className="size-5 dark:text-gray-400" />}
                        </button>
                        {errors.password && (
                            <span className="text-red-500">{errors.password}</span>
                        )}
                    </div>
                    <div className="relative mt-4 flex w-full">
                        <input
                            type={passwordConfirmedVisible ? "text" : "password"}
                            aria-label="ver confirmacion contraseña"
                            name="confirmPass"
                            className="h-8 w-full grow rounded-lg border border-gray-400 p-6 px-2 placeholder:text-gray-500 focus:border-verde-100 focus:outline-none  dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-200"
                            placeholder="Confirmar Contraseña"
                            value={formData.confirmPass}
                            onChange={handleChange}
                            required
                        />
                        <button
                            aria-label="Confirmar Contraseña"
                            type="button"
                            onClick={togglePasswordConfirmedVisibility}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                        >
                            {passwordConfirmedVisible ? <PiEyeClosed className="size-5 dark:text-gray-400" /> : <PiEye className="size-5 dark:text-gray-400" />}
                        </button>
                        {errors.confirmPass && (
                            <span className="text-red-500">{errors.confirmPass}</span>
                        )}
                    </div>
                    <div className="mt-8 flex flex-col">
                        <Button
                            isProcessing={signin}
                            type="submit"
                            aria-label="Ingresar"
                            processingSpinner={<AiOutlineLoading className="size-6 animate-spin" />}
                            className="w-full rounded bg-verde-600 px-4 text-sm font-semibold text-white ring-1 ring-verde-100 hover:bg-verde-700  focus:border-verde-100 focus:outline-verde-200">
                            Registrar
                        </Button>
                    </div>
                </form>
            </div>
        </AuthComponent>
    );
}
