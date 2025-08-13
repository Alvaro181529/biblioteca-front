"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookFormData, BooksFiles } from "@/interface/Interface";
import { Button, Card, Tooltip } from "flowbite-react";
import { ComponentModalCreate } from "@/components/Modal";
import { FormCreate } from "./crud/create";
import { MdModeEditOutline, MdDelete, MdOutlinePictureAsPdf } from "react-icons/md";
import { FormDelete } from "./crud/delete";
import { notFound, useRouter } from "next/navigation";
import { languages } from "@/types/types";
import { FormBorrowed } from "./crud/borrowed";
import { isValidUrl } from "@/lib/validateURL";
import { AiOutlineLoading } from "react-icons/ai";
import { IoPlayCircleOutline } from "react-icons/io5";
import Vizualizer from "./component/Vizualizer";

const loadMidiPlayerScript = () => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/@magenta/music@1.23.1/es6/core.js,npm/html-midi-player@1.5.0";
        script.defer = true;
        script.onload = () => resolve(true);
        script.onerror = (e) => reject(new Error("Failed to load MIDI player scripts"));
        document.body.appendChild(script);
    });
};


export default function BooksId({ params }: { params: { id: number } }) {
    const [openModal, setOpenModal] = useState(false);
    const [openModalMidi, setOpenModalMidi] = useState(false);
    const [pdf, setPdf] = useState(true);
    const [spin, setSpin] = useState(true);
    const [files, setFiles] = useState(false);
    const { data } = useBooksData(params.id, openModal)
    const { data: filesData } = useBooksDataFiles(params.id);

    useEffect(() => {
        if (data?.book_type === 'PARTITURA') {
            setFiles(true);
        }
    }, [data]);
    useEffect(() => {
        if (openModalMidi) {
            loadMidiPlayerScript()
                .then(() => {
                    console.log("MIDI player script loaded successfully!");
                })
                .catch((error) => {
                    console.error("Error loading MIDI player script:", error);
                });
        }
    }, [openModalMidi]);

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
    const DownloadMXL = () => {
        const mxlUrl = String(filesData?.mxl_url);
        if (isValidUrl(mxlUrl)) {
            router.push(mxlUrl);
        } else {
            const mxlDownloadUrl = `/api/books/mxl/${mxlUrl}`;
            router.push(mxlDownloadUrl);
        }
    }
    const DownloadMIDI = () => {
        const midiUrl = String(filesData?.midi_url);
        if (isValidUrl(midiUrl)) {
            router.push(midiUrl);
        } else {
            const mxlDownloadUrl = `/api/books/midi/${midiUrl}`;
            router.push(mxlDownloadUrl);
        }
    }
    if (data?.statusCode == 404) return notFound()
    const imageUrl = String(data?.book_imagen);
    const imageSrc = isValidUrl(imageUrl)
        ? imageUrl
        : imageUrl && imageUrl.toLowerCase() !== "null"
            ? `/api/books/image/${imageUrl}`
            : "/svg/placeholder.svg";

    const documentUrl = () => {
        const documentUrl = String(data?.book_document);

        if (isValidUrl(documentUrl)) {
            router.push(documentUrl);
        } else {
            const pdfUrl = `/api/books/document/${documentUrl}`;
            router.push(pdfUrl);
        }
    }
    return (
        <div className="mx-auto max-w-6xl px-4 py-2 md:px-2">
            <div className="mb-2 flex items-center justify-between">
                <section>
                    <h1 className="mb-2 text-2xl font-bold dark:text-white">{data?.book_title_original || "Título no disponible"}</h1>
                    <p className=" text-gray-500 dark:text-gray-400">{data?.book_title_parallel}</p>
                </section>
                <section className="p-2 text-gray-500 dark:text-gray-400">
                    <span className="font-semibold dark:text-white">Fecha de adquicision: </span>
                    <p>{data?.book_acquisition_date ? data?.book_acquisition_date.toString() : "S/F"}</p>
                </section>
            </div>
            <div className="grid grid-cols-1 items-start gap-x-4 md:grid-cols-2">
                <div className="m-auto mt-0 grid aspect-[3/4] w-full gap-6">
                    <ComponentModalCreate title="Visualizador" openModal={openModalMidi} setOpenModal={setOpenModalMidi} status={false}>
                        <Vizualizer DownloadMIDI={DownloadMIDI} DownloadMXL={DownloadMXL} filesData={filesData || { midi_url: null, mxl_url: null }} />
                    </ComponentModalCreate>
                    <div className="relative w-full">
                        {/* Imagen con Tailwind */}
                        <Image
                            width={560}
                            height={800}
                            className="aspect-[3/4] rounded-lg object-cover"
                            alt={String(data?.book_title_original)}
                            src={imageSrc}
                        />
                        {data?.book_type == 'PARTITURA' && (
                            <Tooltip className="z-50" content="Obtener archivos midi y mxl">
                                <button onClick={() => setOpenModalMidi(true)} className="absolute left-4 top-4 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100 focus:outline-none">
                                    <IoPlayCircleOutline className="size-10 text-green-900" />
                                </button>
                            </Tooltip>
                        )}
                        <Tooltip className="z-50" content="Ver Pef del libro">
                            <button
                                aria-label="Pdf"
                                className={`absolute left-4 ${data?.book_type === 'PARTITURA' ? 'top-20' : 'top-4'} ${data?.book_document === 'null' ? 'hidden' : ''} rounded-full bg-white p-2 shadow-lg hover:bg-gray-100 focus:outline-none ${['DVD', 'CD', 'VHS', 'CASSETTE', 'AUDIO LIBRO'].includes(String(data?.book_type)) ? 'hidden' : ''}`}
                                // processingSpinner={<AiOutlineLoading className="size-6 animate-spin" />}
                                // isProcessing={spin}
                                disabled={pdf}
                                onClick={documentUrl}
                            >
                                <MdOutlinePictureAsPdf className="size-10 text-red-700" />
                            </button>
                        </Tooltip>
                    </div>
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
            <Button aria-label="Prestar" className="w-full bg-verde-700 font-semibold" onClick={onBorrowed}>Prestar</Button>
            <Card>
                <div className="mb-4 flex justify-between">
                    <h1 className=" my-auto text-xl font-bold dark:text-white">Contenido</h1>
                    <Button aria-label="Agregar" onClick={handleCreate} color={"light"}>Agregar</Button>
                    <ComponentModalCreate title={title} openModal={openModal} setOpenModal={closeModal} status={modalState}>
                        {modalType === "create" && <FormCreate setOpenModal={closeModal} id={id} />}
                        {modalType === "edit" && <FormCreate setOpenModal={closeModal} id={id} data={actual} view={view} />}
                        {modalType === "delete" && <FormDelete contnet={actual} data={actualData} setOpenModal={closeModal} />}
                        {modalType === "borrowed" && <FormBorrowed id={id} setOpenModal={closeModal} />}
                    </ComponentModalCreate>
                </div>
                <nav className="grid gap-3 text-base  md:text-sm">
                    {data?.book_contents && data?.book_contents.map((content: any) => (
                        <div key={content.id} className="grid grid-cols-5  text-gray-500 dark:text-gray-200">
                            <div className=" col-span-2 grid text-wrap ">
                                <Link href="#" className="hover:underline" prefetch={false}>
                                    {content.content_sectionTitle}
                                </Link>
                                <Link href="#" className="hover:underline" prefetch={false}>
                                    {content.content_sectionTitleParallel}
                                </Link>
                            </div>
                            <div className="col-span-2 justify-self-end ">
                                <span>Página</span>
                                <span className="ml-3 ">{content.content_pageNumber}</span>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Tooltip content="Editar">
                                    <button
                                        aria-label="Editar"
                                        onClick={() => onEdit(content.id, content)}
                                        className="m-auto text-verde-600 hover:underline dark:text-verde-400"
                                    >
                                        <MdModeEditOutline className="text-xl" />
                                    </button>
                                </Tooltip>
                                <Tooltip content="Eliminar">
                                    <button
                                        aria-label="Eliminar"
                                        onClick={() => onDelete(content.id, content.content_sectionTitle)}
                                        className="m-auto text-red-600 hover:underline dark:text-red-700"
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
        <div className="my-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="col-span-2 sm:col-span-1">
                <h1 className=" mb-auto text-2xl font-bold dark:text-white">Detalles: </h1>
                <dl className="grid grid-cols-2 gap-5">
                    <div>
                        <dt className="font-semibold dark:text-white">ISBN:</dt>
                        <dd className="text-gray-700 dark:text-gray-400">{data?.book_isbn || "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold dark:text-white">Inventario:</dt>
                        <dd className="text-gray-700 dark:text-gray-400">{data?.book_inventory || "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold dark:text-white">Ubicación:</dt>
                        <dd className="text-gray-700 dark:text-gray-400">{data?.book_location || "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold dark:text-white">Idioma:</dt>
                        <dd className="text-gray-700 dark:text-gray-400">{getLanguageName(String(data?.book_language))}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold dark:text-white">Editorial:</dt>
                        <dd className="text-gray-700 dark:text-gray-400">{String(data?.book_editorial)}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold dark:text-white">Tipo:</dt>
                        <dd className="text-gray-700 dark:text-gray-400">{data?.book_type || "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold dark:text-white">Condición:</dt>
                        <dd className="text-gray-700 dark:text-gray-400">{data?.book_condition || "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold dark:text-white">Cantidad:</dt>
                        <dd className="text-gray-700 dark:text-gray-400">{data?.book_quantity || "0"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold dark:text-white">Precio original:</dt>
                        <dd className="text-gray-700 dark:text-gray-400">{data?.book_original_price ? `${data?.book_original_price} (${data?.book_price_type})` : "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold dark:text-white">Precio en bolivianos:</dt>
                        <dd className="text-gray-700 dark:text-gray-400">{data?.book_price_in_bolivianos || "N/A"}</dd>
                    </div>
                    <div className="col-span-2 font-normal ">
                        <span className="font-semibold dark:text-white">Encabezados: </span>
                        <ul className="flex flex-wrap gap-2 text-gray-700 dark:text-gray-400">
                            {data?.book_includes && data.book_includes.length > 0 ? (
                                data?.book_headers?.map((header, index) => (
                                    <p key={index} className="mt-2 rounded-full bg-amarillo-100 px-3 py-1 text-base ">{header}</p>
                                ))
                            ) : (
                                <p className="mt-2 text-base">No hay encabezados disponibles</p>
                            )}
                        </ul>
                    </div>
                </dl>
            </Card>
            <div className="col-span-2 mt-0 gap-2 pt-0 sm:col-span-1">
                <div className="  grid grid-cols-2 gap-3">
                    <Card>
                        <h1 className=" mb-auto text-xl font-bold dark:text-white">Autores</h1>
                        <ul className="flex flex-wrap gap-2 text-gray-700 dark:text-gray-400">
                            {data?.book_authors && data.book_authors.length > 0 ? (
                                data.book_authors.map((author) => (
                                    <li key={author.id} className="rounded-full bg-amarillo-100 px-3 py-1 text-base">
                                        {author.author_name}
                                    </li>
                                ))
                            ) : (
                                <li>No hay autores disponibles.</li>
                            )}
                        </ul>
                    </Card>
                    <Card>
                        <h1 className=" mb-auto text-xl font-bold dark:text-white">Categorias</h1>
                        <ul className="flex flex-wrap gap-2 text-gray-700 dark:text-gray-400">
                            {data?.book_category && data.book_category.length > 0 ? (
                                data.book_category.map((category) => (
                                    <li key={category.id} className="rounded-full bg-amarillo-100 px-3 py-1 text-base">
                                        {category.category_name}
                                    </li>
                                ))
                            ) : (
                                <li>No hay categorías disponibles.</li>
                            )}
                        </ul>
                    </Card>
                    <Card>
                        <h1 className=" mb-auto text-xl font-bold dark:text-white">Instrumentos</h1>
                        <ul className="flex flex-wrap gap-2 text-gray-700 dark:text-gray-400">
                            {data?.book_instruments && data.book_instruments.length > 0 ? (
                                data.book_instruments.map((instrument) => (
                                    <li key={instrument.id} className="rounded-full bg-amarillo-100 px-3 py-1 text-base">
                                        {instrument.instrument_name}
                                    </li>
                                ))
                            ) : (
                                <li>No hay instrumentos disponibles.</li>
                            )}
                        </ul>
                    </Card>
                    <Card>
                        <h1 className=" mb-auto text-xl font-bold dark:text-white">Incluye</h1>
                        <ul className="flex flex-wrap gap-2 text-gray-700 dark:text-gray-400">
                            {data?.book_includes && data.book_includes.length > 0 ? (
                                data.book_includes.map((include, index) => (
                                    <li key={index} className="rounded-full bg-amarillo-100 px-3 py-1 text-base">
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
                    <h1 className=" mb-auto text-xl font-bold dark:text-white">Obeservacion</h1>
                    <p className="text-gray-700 dark:text-gray-400">{data?.book_observation || "No hay observaciones."}</p>
                </Card>
            </div>
            <Card className="col-span-2">
                <h1 className=" mb-auto  text-xl font-bold dark:text-white">Descripción</h1>
                <p className="text-gray-700 dark:text-gray-400">{data?.book_description || "No hay descripción disponible."}</p>
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
const useBooksDataFiles = (id: number) => {
    const [data, setData] = useState<BooksFiles | null>(null);
    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const url = `/api/books/files/${id}`;
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