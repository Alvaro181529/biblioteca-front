"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookFormData } from "../Interface/Interface";
import { Button, Card, Tooltip } from "flowbite-react";
import { ComponentModalCreate } from "@/components/Modal/Modal";
import { FormCreate } from "./crud/create";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { FormDelete } from "./crud/delete";
import { notFound } from "next/navigation";
import { languages } from "../Interface/Types";
import { FormBorrowed } from "./crud/borrowed";

export default function BooksId({ params }: { params: { id: number } }) {

    const [openModal, setOpenModal] = useState(false);
    const { data } = useBooksData(params.id, openModal)

    if (data?.statusCode == 404) return notFound()
    return (
        <div className="mx-auto max-w-6xl px-4 py-2 md:px-2">
            <div className="mb-2 flex items-center justify-between">
                <section>
                    <h1 className="mb-2 text-2xl font-bold">{data?.book_title_original || "Título no disponible"}</h1>
                    <p className=" text-gray-500 dark:text-gray-400">{data?.book_title_parallel}</p>
                </section>
                <p className="p-2 text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Fecha de adquicision: </span>
                    {data?.book_acquisition_date ? data?.book_acquisition_date.toString() : "S/F"}
                </p>
            </div>
            <div className="grid items-start gap-4 md:grid-cols-2">
                <div className="m-auto mt-0 grid gap-6">
                    <Image
                        width={600}
                        height={800}
                        className="aspect-[3/4] w-full rounded-lg object-cover"
                        alt={String(data?.book_title_original)}
                        src={"/imagenes/concer.png"}
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
    const [modalState, setModalState] = useState(true)
    const [view, setView] = useState(false)
    const [actualData, setActualData] = useState(0);
    const [actual, setActual] = useState("");
    const [title, setTitle] = useState("Añadir contenido");
    const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'view' | 'borrowed'>('create');

    const handleCreate = () => {
        setOpenModal(true)
    }
    const closeModal = () => {
        setModalState(true);
        setOpenModal(false);
        setTitle("Añadir contenido")
        setModalType('create');
    };
    const onEdit = (id: number, contnet: any) => {
        setActual(contnet)
        setActualData(id)
        setModalState(true);
        setOpenModal(true);
        setTitle("Editar contenido")
        setModalType('edit');
        setView(true)
    }
    const onDelete = (id: number, contnet: string) => {
        setActual(contnet)
        setActualData(id)
        setModalState(false);
        setOpenModal(true);
        setTitle("Eliminar contenido")
        setModalType('delete');
    }

    const onBorrowed = () => {
        setModalState(true);
        setOpenModal(true);
        setTitle("Prestado")
        setModalType('borrowed');
    }
    return (
        <div className="grid gap-4">
            <Button className="w-full bg-verde-700 font-semibold" onClick={onBorrowed}>Prestar</Button>
            <Card>
                <div className="mb-4 flex justify-between">
                    <h1 className=" my-auto text-xl font-bold">Contenido</h1>
                    <Button onClick={handleCreate} color={"light"}>Agregar</Button>
                    <ComponentModalCreate title={title} openModal={openModal} setOpenModal={closeModal} status={modalState}>
                        {modalType === "create" && <FormCreate setOpenModal={closeModal} id={id} />}
                        {modalType === "edit" && <FormCreate setOpenModal={closeModal} id={id} data={actual} view={view} />}
                        {modalType === "delete" && <FormDelete contnet={actual} data={actualData} setOpenModal={closeModal} />}
                        {modalType === "borrowed" && <FormBorrowed id={id} setOpenModal={closeModal} />}
                    </ComponentModalCreate>
                </div>
                <nav className="grid gap-3">
                    {data?.book_contents && data?.book_contents.map((content: any) => (
                        <div key={content.id} className="grid grid-cols-5 text-gray-500">
                            <Link href="#" className="col-span-2 text-wrap hover:underline" prefetch={false}>
                                {content.content_sectionTitle}
                            </Link>
                            <div className="col-span-2 justify-self-end text-sm text-gray-500 dark:text-gray-400">
                                <span>Página</span>
                                <span className="ml-3 ">{content.content_pageNumber}</span>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Tooltip content="Editar">
                                    <button
                                        onClick={() => onEdit(content.id, content)}
                                        className="m-auto text-verde-600 hover:underline dark:text-verde-300"
                                    >
                                        <MdModeEditOutline className="text-xl" />
                                    </button>
                                </Tooltip>
                                <Tooltip content="Eliminar">
                                    <button
                                        onClick={() => onDelete(content.id, content.content_sectionTitle)}
                                        className="m-auto text-red-600 hover:underline dark:text-verde-300"
                                    >
                                        <MdDelete className="text-xl" />
                                    </button>
                                </Tooltip>
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
        <div className="my-4 grid grid-cols-2 gap-4">
            <Card>
                <h1 className=" mb-auto text-2xl font-bold">Detalles del libro</h1>
                <dl className="grid grid-cols-2 gap-5">
                    <div>
                        <dt className="font-semibold">ISBN:</dt>
                        <dd className="text-gray-700">{data?.book_isbn || "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Inventario:</dt>
                        <dd className="text-gray-700">{data?.book_inventory || "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Ubicación:</dt>
                        <dd className="text-gray-700">{data?.book_location || "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Idioma:</dt>
                        <dd className="text-gray-700">{getLanguageName(String(data?.book_language))}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Editorial:</dt>
                        <dd className="text-gray-700">{String(data?.book_editorial)}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Tipo:</dt>
                        <dd className="text-gray-700">{data?.book_type || "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Condición:</dt>
                        <dd className="text-gray-700">{data?.book_condition || "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Cantidad:</dt>
                        <dd className="text-gray-700">{data?.book_quantity || "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Precio original:</dt>
                        <dd className="text-gray-700">{data?.book_original_price ? `${data?.book_original_price} (${data?.book_price_type})` : "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Precio en bolivianos:</dt>
                        <dd className="text-gray-700">{data?.book_price_in_bolivianos || "N/A"}</dd>
                    </div>
                </dl>
            </Card>
            <div className="mt-0 grid gap-2 pt-0">
                <div className="  grid grid-cols-2 gap-3">
                    <Card>
                        <h1 className=" mb-auto text-xl font-bold">Autores</h1>
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
                    </Card>
                    <Card>
                        <h1 className=" mb-auto text-xl font-bold">Categorias</h1>
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
                    </Card>
                    <Card>
                        <h1 className=" mb-auto text-xl font-bold">Instrumentos</h1>
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
                    </Card>
                    <Card>
                        <h1 className=" mb-auto text-xl font-bold">Incluye</h1>
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
                    </Card>
                </div>
                <Card>
                    <h1 className=" mb-auto text-xl font-bold">Obeservacion</h1>
                    <p className="text-gray-600">{data?.book_observation || "No hay observaciones."}</p>
                </Card>
            </div>
            <Card className="col-span-2">
                <h1 className=" mb-auto  text-xl font-bold">Descripción</h1>
                <p className="text-gray-600">{data?.book_description || "No hay descripción disponible."}</p>
            </Card>
        </div>

    )
}
const getLanguageName = (code: string) => {
    const language = languages.find(lang => lang.code === code);
    return language ? language.name : "N/A";
};
const useBooksData = (id: number, openModal: boolean) => {
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
    }, [id, openModal])
    return { data }
}