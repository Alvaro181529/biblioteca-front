"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookFormData } from "@/app/dashboard/books/Interface/Interface";
import { Button, Card } from "flowbite-react";
import { ComponentModalCreate } from "@/components/Modal/Modal";
import { notFound } from "next/navigation";
import { FormBorrowed } from "./crud/borrowed";
import { languages } from "@/app/dashboard/books/Interface/Types";
import { User } from "next-auth";

export default function ContentId({ params }: { params: { id: number } }) {

    const [openModal, setOpenModal] = useState(false);
    const { data } = useBooksData(params.id)
    if (data?.statusCode == 404) return notFound()
    return (
        <div className="mx-auto max-w-6xl px-4 py-2 md:px-2">
            <div className="mb-2 flex items-center justify-between">
                <section className="w-full">
                    <h1 className="mb-2 text-2xl font-bold">{data?.book_title_original || "Título no disponible"}</h1>
                    <p className=" text-gray-500 dark:text-gray-400">{data?.book_title_parallel}</p>
                </section>
            </div>
            <div className="grid items-start gap-4 md:grid-cols-2">
                <div className="m-auto mt-0 grid gap-6">
                    <Image
                        width={600}
                        height={800}
                        className="aspect-[3/4] w-full rounded-lg object-cover"
                        alt={String(data?.book_title_original)}
                        src={data?.book_imagen?.toLowerCase() === "null" || !data?.book_imagen ? "/svg/placeholder.svg" : data.book_imagen}
                    />
                </div>
                <CardContent id={params.id} data={data || null} setOpenModal={setOpenModal} openModal={openModal} />
            </div>
            <CardDetall data={data}></CardDetall>
        </div >
    )
}

const CardContent = ({ id, data, setOpenModal, openModal }: {
    id: number, data: any, openModal: boolean,
    setOpenModal: (open: boolean) => void;
}) => {
    const [title, setTitle] = useState("Prestamo");
    const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'view' | 'borrowed'>('create');
    const { data: userData } = FetchUser(Number(id))
    const closeModal = () => {
        setOpenModal(false);
        setTitle("Añadir contenido")
        setModalType('create');
    };

    const onBorrowed = () => {
        setOpenModal(true);
        setTitle("Prestado")
        setModalType('borrowed');
    }
    return (
        <div className="grid gap-4">
            <Button className="w-full bg-verde-700 font-semibold" onClick={onBorrowed}>Prestar</Button>
            <Card>
                <div className="flex justify-between">
                    <h1 className=" my-auto text-xl font-bold">Contenido</h1>
                    <ComponentModalCreate title={title} openModal={openModal} setOpenModal={closeModal} status={false}>
                        {modalType === "borrowed" && <FormBorrowed user={userData} id={id} setOpenModal={closeModal} />}
                    </ComponentModalCreate>
                </div>
                <nav className="grid gap-3">
                    {data?.book_contents && data?.book_contents.map((content: any) => (
                        <div key={content.id} className="grid grid-cols-5 text-gray-500">
                            <Link href="#" className="col-span-3 text-wrap hover:underline" prefetch={false}>
                                {content.content_sectionTitle}
                                <br />
                                <span className="text-sm">{content.content_sectionTitle}</span>
                            </Link>
                            <div className="col-span-2 justify-self-end text-sm text-gray-500 dark:text-gray-400">
                                <span>Página</span>
                                <span className="ml-3 ">{content.content_pageNumber}</span>
                            </div>
                        </div>
                    ))}
                </nav>
            </Card>
        </div>
    )
}

const CardDetall = ({ data }: { data: BookFormData | null }) => {
    return (
        <div className="my-4 grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <Card>
                <h1 className=" mb-auto text-2xl font-bold">Detalles del libro</h1>
                <dl className="grid grid-cols-2 gap-5">
                    <div>
                        <dt className="font-semibold">ISBN:</dt>
                        <dd className="text-gray-700">{data?.book_isbn || "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Idioma:</dt>
                        <dd className="text-gray-700">{getLanguageName(String(data?.book_language))}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Editorial:</dt>
                        <dd className="text-gray-700">{String(data?.book_editorial || "S/E")}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Tipo:</dt>
                        <dd className="text-gray-700">{data?.book_type || "S/T"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Autores:</dt>
                        <ul className="flex flex-wrap gap-2 text-gray-600">
                            {data?.book_authors && data.book_authors.length > 0 ? (
                                data.book_authors.map((author) => (
                                    <li key={author.id} className="rounded-full bg-amarillo-50 px-3 py-1 text-sm">
                                        {author.author_name}
                                    </li>
                                ))
                            ) : (
                                <li>No hay autores disponibles.</li>
                            )}
                        </ul>
                    </div>
                    <div>
                        <dt className="font-semibold">Categorias:</dt>
                        <ul className="flex flex-wrap gap-2 text-gray-700">
                            {data?.book_category && data.book_category.length > 0 ? (
                                data.book_category.map((category) => (
                                    <li key={category.id} className="rounded-full bg-amarillo-50 px-3 py-1 text-sm">
                                        {category.category_name}
                                    </li>
                                ))
                            ) : (
                                <li>No hay categorías disponibles.</li>
                            )}
                        </ul>
                    </div>
                    <div>
                        <dt className="font-semibold">Instrumentos:</dt>
                        <ul className="flex flex-wrap gap-2 text-gray-600">
                            {data?.book_instruments && data.book_instruments.length > 0 ? (
                                data.book_instruments.map((instrument) => (
                                    <li key={instrument.id} className="rounded-full bg-amarillo-50 px-3 py-1 text-sm">
                                        {instrument.instrument_name}
                                    </li>
                                ))
                            ) : (
                                <li>No hay instrumentos disponibles.</li>
                            )}
                        </ul>
                    </div>
                    <div>
                        <dt className="font-semibold">Incluye:</dt>
                        <ul className="flex flex-wrap gap-2 text-gray-600">
                            {data?.book_includes && data.book_includes.length > 0 ? (
                                data.book_includes.map((include, index) => (
                                    <li key={index} className="rounded-full bg-amarillo-50 px-3 py-1 text-sm">
                                        {include}
                                    </li>
                                ))
                            ) : (
                                <li>No hay elementos disponibles.</li>
                            )}
                        </ul>
                    </div>
                </dl>
            </Card>
            <div className="mt-0 grid gap-2 pt-0">
                <Card>
                    <h1 className=" mb-auto text-xl font-bold">Obeservacion</h1>
                    <p className="text-gray-600">{data?.book_observation || "No hay observaciones."}</p>
                </Card>
                <Card className="">
                    <h1 className=" mb-auto  text-xl font-bold">Descripción</h1>
                    <p className="text-gray-600">{data?.book_description || "No hay descripción disponible."}</p>
                </Card>
            </div>
        </div>

    )
}
const getLanguageName = (code: string) => {
    const language = languages.find(lang => lang.code === code);
    return language ? language.name : "N/A";
};
const useBooksData = (id: number) => {
    const [data, setData] = useState<BookFormData | null>(null);
    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const url = `/api/books/${id}`;
                    const res = await fetch(url);
                    const result = await res.json();
                    setData(result)
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchData();
        }
    }, [id])
    return { data }
}

const FetchUser = (id: number) => {
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