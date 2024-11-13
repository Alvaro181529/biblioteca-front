"use client";

import { Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";
interface ToastComponentProps {
    titulo: string;
}
export function ToastSuccess({ titulo }: ToastComponentProps) {
    return (
        <div className="fixed bottom-0 right-0 z-50 mb-4 mr-2">
            <Toast className="shadow-lg shadow-black ">
                <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                    <HiCheck className="size-5" />
                </div>
                <div className="ml-3 text-sm font-normal">{titulo}</div>
                <Toast.Toggle />
            </Toast>
        </div>
    );
}
export function ToastDanger({ titulo }: ToastComponentProps) {
    return (
        <div className="fixed bottom-0 right-0 z-50 mb-4 mr-2">
            <Toast className="shadow-lg shadow-black ">
                <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                    <HiX className="size-5" />
                </div>
                <div className="ml-3 text-sm font-normal">{titulo}</div>
                <Toast.Toggle />
            </Toast>
        </div>
    );
}
export function ToastWarning({ titulo }: ToastComponentProps) {
    return (
        <div className="fixed bottom-0 right-0 z-50 mb-4 mr-2">
            <Toast className="shadow-lg shadow-black ">
                <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                    <HiExclamation className="size-5" />
                </div>
                <div className="ml-3 text-sm font-normal">{titulo}</div>
                <Toast.Toggle />
            </Toast>
        </div>
    );
}