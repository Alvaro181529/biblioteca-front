"use client"
import { TextInput, Label, FileInput, Datepicker, Textarea, Tabs, Select, Spinner, Button } from "flowbite-react";
import { bookTypes, currencies, languages } from "@/types/types";
import { createBook } from "@/lib/createBook";
import { BookFormData, Respuest } from "@/interface/Interface";
import { useEffect, useRef, useState } from "react";
import { Author } from "@/interface/Interface";
import { Instrument } from "@/interface/Interface";
import { Categories } from "@/interface/Interface";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Signatura } from "@/lib/generateIA";
import { FiRefreshCcw } from "react-icons/fi";

export function FormCreate({ id, setOpenModal }: { id?: number, setOpenModal: (open: boolean) => void }) {
    const [fetch, setFetch] = useState<BookFormData | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null); // Estado para imagen
    const [documentFile, setDocumentFile] = useState<File | null>(null); // Estado para documento
    const [bookType, setBookType] = useState<string>(""); // para el book type
    const [signatura, setSignatura] = useState<string | null>(null);
    const { data: session } = useSession();
    const [bookTitle, setBookTitle] = useState<string>(fetch?.book_title_original || "");
    const token = session?.user?.accessToken || ""
    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFile(e.target.files[0]);
        }
    };

    const onDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setDocumentFile(e.target.files[0]);
        }
    };

    const onClickSignatura = async (titulo: string, author: string) => {
        const signaturaEncontrada = await Signatura(titulo || "", author || "");
        setSignatura(String(signaturaEncontrada));
    }

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                const res = await fetchDataBook(id)
                setFetch(res);
            }
        }
        fetchData();
    }, [id])
    useEffect(() => {
        if (fetch?.book_type) {
            setBookType(fetch.book_type);
        }
    }, [fetch]);
    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        if (imageFile) formData.append("files", imageFile); // Agregar la imagen
        if (documentFile) formData.append("files", documentFile); // Agregar el documento

        const result: Respuest = await createBook(formData, token);
        if (!result.success) {
            toast.error(result.message, {
                description: result.description
            });
            return
        }
        toast.success(result.message, { description: result.description });
        setOpenModal(false);
    }

    if (fetch == null && id) return (
        <div className="text-center">
            <Spinner color="success" aria-label="Success spinner" size="xl" />
        </div >
    )
    const transformToSuggestions = (items: any[] = []): Suggestion[] => {
        return items.map(item => ({
            id: item.id,
            name: item.instrument_name || item.category_name || item.author_name || '', // Dependiendo del tipo de item
        }));
    };

    return (
        <form id="submit-form" onSubmit={onSave}>
            {!bookType && (
                <div className="mb-8 flex flex-col items-center gap-2">
                    <div className="w-full max-w-md">
                        <div className="flex items-center gap-2">
                            <Label
                                htmlFor="book_type"
                                className="mb-2 block text-center text-sm font-semibold text-gray-700"
                                value="Selecciona el tipo de libro"
                            />
                            <p className="text-red-600">*</p>
                        </div>
                        <Select
                            id="book_type"
                            name="book_type"
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                            value={bookType}
                            onChange={(e) => setBookType(e.target.value)}
                            required
                        >
                            <option value="" disabled>-- Selecciona una opción --</option>
                            {bookTypes.map((books) => (
                                <option key={books.code} value={books.code}>
                                    {books.name}
                                </option>
                            ))}
                        </Select>
                    </div>
                </div>
            )}
            {bookType && (
                <>
                    <div className="space-y-6" >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="mb-4 max-sm:col-span-2">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="book_title_original" value="Título Original" />
                                    <p className="text-red-600">*</p>
                                </div>
                                <TextInput
                                    name="book_title_original"
                                    id="book_title_original"
                                    placeholder="Título Original"
                                    defaultValue={fetch?.book_title_original}
                                    onChange={(e) => setBookTitle(e.target.value)} // Actualizamos el estado al escribir
                                    required
                                />
                            </div>

                            <div className="mb-4 max-sm:col-span-2">
                                <Label htmlFor="book_title_parallel" value="Título Paralelo" />
                                <TextInput
                                    name="book_title_parallel"
                                    id="book_title_parallel"
                                    placeholder="Título Paralelo"
                                    defaultValue={fetch?.book_title_parallel}
                                />
                            </div>
                            <div className="col-span-2 gap-4 md:grid md:grid-cols-4 ">
                                <div className="col-span-2 mb-4">
                                    <Label htmlFor="book_editorial" value={["CD", "DVD", "VHS"].includes(bookType) ? 'Sello Productor' : 'Editorial'} />
                                    <TextInput
                                        name="book_editorial"
                                        id="book_editorial"
                                        placeholder={["CD", "DVD", "VHS"].includes(bookType) ? 'Sello Productor' : 'Editorial'}
                                        defaultValue={fetch?.book_editorial}
                                    />
                                </div>
                                <div className={`${['LIBRO', 'PARTITURA', 'REVISTA'].includes(bookType) ? 'hidden ' : ''}` + "mb-4"}>
                                    <Label htmlFor="book_isbn" value="ISBN" />
                                    <TextInput
                                        name="book_isbn"
                                        id="book_isbn"
                                        placeholder="978-3-16-148410-0"
                                        defaultValue={fetch?.book_isbn}
                                    />
                                </div>
                                <div className="mb-4">
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="book_quantity" value="Numero de ejemplares" />
                                        <p className="text-red-600">*</p>
                                    </div>
                                    <TextInput
                                        name="book_quantity"
                                        id="book_quantity"
                                        type="number"
                                        required
                                        defaultValue={fetch?.book_quantity}
                                        min={1}
                                    />
                                </div>
                            </div>
                            <div className="mb-4 max-sm:col-span-2">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="book_condition" value="Condición" />
                                    <p className="text-red-600">*</p>
                                </div>
                                <Select id="book_condition" name="book_condition"
                                    defaultValue={String(fetch?.book_condition)}
                                    required>
                                    <option>BUENO</option>
                                    <option>REGULAR</option>
                                    <option>MALO</option>
                                    <option>PÉSIMO</option>
                                </Select>
                            </div>
                            <div className="mb-4 max-sm:col-span-2">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="book_language" value="Idioma" />
                                    <p className="text-red-600">*</p>
                                </div>
                                <Select id="book_language" name="book_language"
                                    defaultValue={String(fetch?.book_language)}
                                    required
                                >
                                    {languages.map((language, index) => (
                                        <option key={index} value={language.code}>
                                            {language.name} ({language.code})
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            < div className={['LIBRO', 'PARTITURA', 'REVISTA'].includes(bookType) ? 'hidden ' : '' + "mb-4 max-sm:col-span-2"}>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="book_location" value="Signatura tipográfica" />
                                    <p className="text-red-600">*</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <TextInput
                                            name="book_location"
                                            id="book_location"
                                            placeholder="Ubicación"
                                            defaultValue={fetch?.book_location || signatura || ''} // Mantén defaultValue como estaba
                                        />
                                    </div>
                                    <div className="flex-none">
                                        <Button onClick={() => onClickSignatura(String(bookTitle), String(fetch?.book_authors))} className={bookTitle ? " bg-gray-300 text-black" : 'hidden'}><FiRefreshCcw className="size-5" /></Button>
                                    </div>
                                </div>
                            </div>

                            <div className={`${!['LIBRO', 'PARTITURA', 'REVISTA'].includes(bookType) ? ' col-span-2 ' : ' max-sm:col-span-2 '}` + "mb-4"}>
                                <Label htmlFor="book_acquisition_date" value="Fecha de Adquisición" />
                                <Datepicker
                                    name="book_acquisition_date"
                                    id="book_acquisition_date"
                                />
                            </div>
                            <div className="col-span-2">
                                <section className="grid grid-cols-3 gap-2 max-sm:grid-cols-1">
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="book_price_type" value="Tipo de Precio" />
                                            <p className="text-red-600">*</p>
                                        </div>
                                        <Select id="book_price_type" name="book_price_type"
                                            defaultValue={fetch?.book_price_type || 0}
                                            required>
                                            {currencies.map(currency => (
                                                <option key={currency.code} value={currency.code}>
                                                    {currency.name} ({currency.code})
                                                </option>
                                            ))}
                                        </Select>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="book_original_price" value="Precio Original" />
                                            <p className="text-red-600">*</p>
                                        </div>
                                        <TextInput
                                            name="book_original_price"
                                            id="book_original_price"
                                            placeholder="3"
                                            required
                                            type="number"
                                            step="0.01"
                                            defaultValue={fetch?.book_original_price}
                                            min="0"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <Label htmlFor="book_type" value="Tipo de Libro" />
                                        <Select id="book_type" name="book_type"
                                            defaultValue={bookType ? bookType : String(fetch?.book_type)}
                                            onChange={(e) => setBookType(e.target.value)}
                                            required>
                                            {bookTypes.map(books => (
                                                <option key={books.code} value={books.code}>
                                                    {books.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                </section>
                            </div>

                            <div className={`${!['LIBRO', 'PARTITURA', 'REVISTA'].includes(bookType) ? ' mb-4' : ''}` + " max-sm:col-span-2"}>
                                <AutocompleteSuggestion
                                    id="book_category"
                                    name="Categorías"
                                    placeholder="Ingrese categorías separadas por comas"
                                    type="categories"
                                    initialSelectedItems={transformToSuggestions(fetch?.book_category) ?? []}
                                />

                            </div>
                            <div className={`${!['LIBRO', 'PARTITURA', 'REVISTA'].includes(bookType) ? 'mb-4' : ' '}` + " max-sm:col-span-2"}>
                                <AutocompleteSuggestion
                                    id="book_authors"
                                    name="Autores"
                                    placeholder="Ingrese autores separados por comas"
                                    type="authors"
                                    initialSelectedItems={transformToSuggestions(fetch?.book_authors) ?? []}
                                />
                            </div>
                            <div className={['PARTITURA', 'REVISTA'].includes(bookType) ? 'hidden' : '' + "mb-4 max-sm:col-span-2"}>
                                <AutocompleteSuggestion
                                    id="book_instruments"
                                    name="Instrumentos"
                                    placeholder="Ingrese instrumentos separados por comas"
                                    type="instruments"
                                    initialSelectedItems={transformToSuggestions(fetch?.book_instruments) ?? []}
                                />
                            </div>
                            <div className={['PARTITURA', 'REVISTA'].includes(bookType) ? 'hidden' : '' + "mb-4 max-sm:col-span-2"}>
                                <Label htmlFor="book_includes" value="Incluye" />
                                <Textarea
                                    name="book_includes"
                                    id="book_includes"
                                    defaultValue={fetch?.book_includes}
                                />
                            </div>
                            <div className="mb-4 max-sm:col-span-2">
                                <Tabs aria-label="Tabs with underline" style="underline" >
                                    <Tabs.Item active title="URL">
                                        <Label htmlFor="book_imagen" value="Imagen " />
                                        <span className="text-xs text-gray-700">(opcional)</span>
                                        <TextInput
                                            name="book_imagen"
                                            placeholder="URL de la imagen"
                                            defaultValue={fetch?.book_imagen}
                                        />
                                    </Tabs.Item>
                                    <Tabs.Item title="Archivo">
                                        <Label htmlFor="book_imagen" value="Imagen " />
                                        <span className="text-xs text-gray-700">(opcional)</span>
                                        <FileInput
                                            accept="image/*"
                                            // defaultValue={fetch?.book_imagen}
                                            id="book_imagen"
                                            onChange={onImageChange}
                                        />
                                    </Tabs.Item>
                                </Tabs>
                            </div>

                            <div className="mb-4 max-sm:col-span-2">
                                <Tabs aria-label="Tabs with underline" style="underline">
                                    <Tabs.Item active title="URL">
                                        <Label htmlFor="book_document" value="Documento " />
                                        <span className="text-xs text-gray-700">(opcional)</span>

                                        <TextInput
                                            name="book_document"
                                            defaultValue={fetch?.book_document}
                                            placeholder="URL del documento"

                                        />
                                    </Tabs.Item>
                                    <Tabs.Item title="Archivo">
                                        <Label htmlFor="book_document" value="Documento " />
                                        <span className="text-xs text-gray-700">(opcional)</span>
                                        <FileInput
                                            accept=".pdf"
                                            id="book_document"
                                            onChange={onDocumentChange}
                                        />
                                    </Tabs.Item>
                                </Tabs>
                            </div>
                            <div className="col-span-2 mb-4">
                                <Label htmlFor="book_description" value="Descripción" />
                                <Textarea
                                    name="book_description"
                                    id="book_description"
                                    placeholder="Descripción"
                                    defaultValue={fetch?.book_description}
                                />
                            </div>
                            {['CD', 'VHS', 'DVD'].includes(bookType) && (
                                <div className="col-span-2">
                                    <Label htmlFor="book_headers" value="Encabezados" />
                                    <Textarea
                                        name="book_headers"
                                        id="book_headers"
                                        defaultValue={fetch?.book_headers}
                                    />
                                </div>
                            )}
                            <div className="col-span-2">
                                <Label htmlFor="book_observation" value="Observaciones" />
                                <Textarea
                                    name="book_observation"
                                    id="book_observation"
                                    placeholder="Observaciones"
                                    defaultValue={fetch?.book_observation}

                                />
                            </div>
                            <input type="text" id="id" name="id" hidden defaultValue={fetch?.id} />
                        </div>
                    </div>
                </>
            )
            }
        </form >

    )
}
type SuggestionProps = {
    id: string
    name: string
    placeholder: string
    type: 'categories' | 'authors' | 'instruments'
    initialSelectedItems: Suggestion[]
}

type Suggestion = {
    id: number;
    name: string;
}
function AutocompleteSuggestion({ id, name, placeholder, type, initialSelectedItems }: SuggestionProps) {
    const [value, setValue] = useState('')
    const [selectedItems, setSelectedItems] = useState<Suggestion[]>(initialSelectedItems)
    const [search, setSearch] = useState('')
    const [view, setView] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const suggestions = useFetchSuggestions(type, search, view)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        if (selectedItems.length >= 0) {
            setValue(selectedItems.map(item => item.name).join(', ') + '');
        }
    }, [selectedItems]); // Dependencia en selectedItems
    useEffect(() => {
        if (suggestions.length > 0) {
            setIsLoading(false)
        }
    }, [suggestions]); // Dependencia en selectedItems

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value
        setValue(inputValue)
        const lastWord = inputValue.split(', ').pop()?.trim() || ''
        setSearch(lastWord)
    }

    const handleSuggestionClick = (suggestion: Suggestion) => {
        const newSelectedItems = [...selectedItems, suggestion]
        setSelectedItems(newSelectedItems)
        setValue(newSelectedItems.map(item => item.name).join(', ') + ', ')
        setSearch('')
        setView(false)
    }
    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setView(false);
            setIsLoading(false)
        }, 500)
    };
    const handleRemoveItem = (itemToRemove: Suggestion) => {
        const newSelectedItems = selectedItems.filter(item => item.id !== itemToRemove.id);
        setSelectedItems(newSelectedItems);
    };


    return (
        <div className="relative mb-4">
            <Label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {name}
            </Label>
            <Textarea
                id={id}
                name={id}
                placeholder={placeholder}
                value={value}
                onBlur={resetTimeout}
                onFocus={() => setView(true)}
                onClick={() => { setView(true); setIsLoading(true) }}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
            />
            <div className="mt-2">
                {selectedItems.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {selectedItems.map(item => (
                            <span
                                key={item.id}
                                className="inline-block rounded-full bg-amarillo-200 px-3 py-1 text-sm text-black"
                            >
                                {item.name}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(item)}
                                    className="ml-2 text-red-500"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {isLoading ? (
                <div className="absolute z-10 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white p-2 text-center shadow-lg">
                    <Spinner color="success" size="md" />
                </div>
            ) : (
                suggestions.length > 0 && (
                    <ul className="absolute z-10 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                        {suggestions.map((suggestion) => (
                            <li
                                key={suggestion.id}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                value={suggestion.id}
                            >
                                {suggestion.name}
                            </li>
                        ))}
                    </ul>
                )
            )}

            <input
                type="hidden"
                name={`${id}_ids`}
                defaultValue={selectedItems.map(item => item.id).join(',')}
            />
        </div >
    )
}


const fetchDataBook = async (id: number) => {
    const res = await fetch(`/api/books/${id}`);
    if (!res.ok) {
        throw new Error('Error al crear la Publicacion: ' + res.statusText);
    }
    return await res.json()
}
const useFetchSuggestions = (type: 'categories' | 'authors' | 'instruments', search: string, view: boolean) => {
    const [data, setData] = useState<Suggestion[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (search || view) {
                const url = `/api/${type}?query=${search}`;
                const res = await fetch(url);
                const result = await res.json();
                const mappedData = result.data.map((item: Author | Instrument | Categories) => {
                    if ("category_name" in item) {
                        return { id: item.id, name: item.category_name };
                    } else if ("author_name" in item) {
                        return { id: item.id, name: item.author_name };
                    } else if ("instrument_name" in item) {
                        return { id: item.id, name: item.instrument_name };
                    }
                    throw new Error("Unexpected item type");
                });
                setData(mappedData);
            } else {
                setData([]);
            }
        };
        fetchData();
    }, [type, search, view]);

    return data;
};
