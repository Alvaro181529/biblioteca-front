"use client";

import { Card } from "flowbite-react";

interface ComponentProps {
    id: number;
    titulo: string;
    autor: string;
    categoria: string;
    disponible: boolean;
}

export function ComponentBook({ id, titulo, autor, disponible, categoria }: ComponentProps) {
    return (
        <Card className="w-full p-1 max-sm:h-52" imgSrc={`/libros/0${id}.jpg` || "/svg/placeholder.svg"} horizontal>
            <div className="grid grid-cols-2 items-center">
                {disponible ? (
                    <div className="grid grid-cols-[auto,1fr] items-center">
                        <p className="text-green-500">Disponible</p>
                        <span className="m-auto size-3 rounded-xl bg-green-500"></span>
                    </div>
                ) : (
                    <div>
                        <p className="text-red-500">No disponible</p>
                        <span className="m-auto size-3 rounded-xl bg-red-500"></span>
                    </div>
                )}
            </div>
            <a href={`/usuarios/libros/${id}`}>
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {titulo}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    <span className="font-semibold">Autor: </span>
                    {autor}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    <span className="font-semibold">Categoria: </span>
                    {categoria}
                </p>
            </a>
        </Card>
    );
}
