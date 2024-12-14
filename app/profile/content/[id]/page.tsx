"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookFormData } from "@/interface/Interface";
import { Button, Card } from "flowbite-react";
import { ComponentModalCreate } from "@/components/Modal";
import { notFound, useRouter } from "next/navigation";
import { FormBorrowed } from "./crud/borrowed";
import { languages } from "@/types/types";
import { User } from "next-auth";
import { isValidUrl } from "@/lib/validateURL";
import { AiOutlineLoading } from "react-icons/ai";
import { useSession } from "next-auth/react";

export default function ContentId({ params }: { params: { id: number } }) {
    const [openModal, setOpenModal] = useState(false);
    const { data: session, status } = useSession()
    const [pdf, setPdf] = useState(true);
    const [spin, setSpin] = useState(true);
    const { data } = useBooksData(params.id);
    const imageUrl = String(data?.book_imagen);
    const router = useRouter()

    useEffect(() => {
        if (!data?.book_document) {
            setPdf(true)
            setSpin(false)
        } else {
            setSpin(false)
            setPdf(false)
        }
    }, [data?.book_document]);
    if (data?.statusCode == 404) { return notFound() }

    const documentUrl = () => {
        const documentUrl = String(data?.book_document);

        if (isValidUrl(documentUrl)) {
            router.push(documentUrl);
        } else {
            const pdfUrl = `/api/books/document/${documentUrl}`;
            router.push(pdfUrl);
        }
    }
    const imageSrc = isValidUrl(imageUrl)
        ? imageUrl // Si es una URL válida, usamos la URL
        : imageUrl && imageUrl.toLowerCase() !== "null"  // Si no es "null", pero no es una URL válida, entonces usamos la ruta de la API
            ? `/api/books/image/${imageUrl}`
            : "/svg/placeholder.svg";  // Si no hay imagen, usamos el placeholder

    return (
        <div className="mx-auto max-w-6xl px-4 py-2 md:px-2">
            <div className="grid items-start gap-4 md:grid-cols-2">
                <div className="m-auto mt-0 grid gap-6">
                    <Image
                        width={600}
                        height={800}
                        className="aspect-[3/4] w-full rounded-lg object-cover"
                        alt={String(data?.book_title_original)}
                        src={imageSrc}
                    />
                    {(session?.user.rols == "ESTUDIANTE" || session?.user.rols == "DOCENTE") && (
                        <Button
                            aria-label="Pdf"
                            className="mt-0 bg-red-700 font-semibold"
                            processingSpinner={<AiOutlineLoading className="size-6 animate-spin" />}
                            isProcessing={spin}
                            disabled={pdf}
                            onClick={documentUrl}
                        >
                            Ver pdf
                        </Button>
                    )}

                    <section className="mb-2 flex w-full items-center justify-between">
                        <div>
                            <h1 className="mb-2 text-2xl font-bold dark:text-white">{data?.book_title_original || "Título no disponible"}</h1>
                            <p className=" text-gray-500 dark:text-gray-300">{data?.book_title_parallel}</p>
                        </div>
                    </section>
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
    const [process, setProcess] = useState(true);
    const [title, setTitle] = useState("Prestamo");
    const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'view' | 'borrowed'>('create');
    const { data: userData } = FetchUser(Number(id))

    useEffect(() => {
        if (!userData) {
            setProcess(true);
        } else {
            setProcess(false);
        }
    }, [userData]);

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
            <Button className="w-full bg-verde-700 font-semibold dark:text-white" processingSpinner={<AiOutlineLoading className="size-6 animate-spin" />} disabled={process} isProcessing={process} onClick={onBorrowed}>Prestar</Button>
            <Card>
                <div className="flex justify-between">
                    <h1 className=" my-auto text-xl font-bold dark:text-white">Inidce</h1>
                    <ComponentModalCreate title={title} openModal={openModal} setOpenModal={closeModal} status={false}>
                        {modalType === "borrowed" && <FormBorrowed user={userData} id={id} setOpenModal={closeModal} />}
                    </ComponentModalCreate>
                </div>
                <nav className="grid gap-3">
                    {data?.book_contents && data?.book_contents.map((content: any) => (
                        <div key={content.id} className="grid grid-cols-5 text-gray-500 dark:text-gray-300">
                            <div className="col-span-3 grid text-wrap ">
                                <Link href="#" className="hover:underline" prefetch={false}>
                                    {content.content_sectionTitle}
                                </Link>
                                <Link href="#" className="hover:underline" prefetch={false}>
                                    {content.content_sectionTitleParallel}
                                </Link>
                            </div>
                            <div className="col-span-2 justify-self-end text-sm text-gray-500 dark:text-gray-300">
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
                <h1 className=" mb-auto text-2xl font-bold dark:text-white">Detalles del libro</h1>
                <dl className="grid grid-cols-2 gap-5">
                    <div>
                        <dt className="font-semibold dark:text-white">ISBN:</dt>
                        <dd className="text-gray-700 dark:text-gray-400">{data?.book_isbn || "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold dark:text-white">Idioma:</dt>
                        <dd className="text-gray-700 dark:text-gray-400">{getLanguageName(String(data?.book_language))}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold dark:text-white">Editorial:</dt>
                        <dd className="text-gray-700 dark:text-gray-400">{String(data?.book_editorial || "S/E")}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold dark:text-white">Tipo:</dt>
                        <dd className="text-gray-700 dark:text-gray-400">{data?.book_type || "S/T"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold dark:text-white">Autores:</dt>
                        <ul className="flex flex-wrap gap-2 text-gray-700 dark:text-gray-400">
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
                        <dt className="font-semibold dark:text-white">Categorias:</dt>
                        <ul className="flex flex-wrap gap-2 text-gray-700 dark:text-gray-400">
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
                        <dt className="font-semibold dark:text-white">Instrumentos:</dt>
                        <ul className="flex flex-wrap gap-2 text-gray-700 dark:text-gray-400">
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
                        <dt className="font-semibold dark:text-white">Incluye:</dt>
                        <ul className="flex flex-wrap gap-2 text-gray-700 dark:text-gray-400">
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
        if (id) {
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
        }
    }, [id])
    return { data }
}