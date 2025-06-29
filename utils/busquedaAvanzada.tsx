"use client"
import { Author, Categories } from "@/interface/Interface";
import { Checkbox, Label, Spinner, Textarea } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';

interface Instrument {
    instrument_name: string;
}
interface Category {
    category_name: string;
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

const transformToSuggestions = (items: any[] = []): Suggestion[] => {
    return items.map(item => ({
        id: item.id,
        name: item.instrument_name || item.category_name || item.author_name || '', // Dependiendo del tipo de item
    }));
};

export function BusquedaAvanzada() {
    const [selectedInstruments, setSelectedInstruments] = useState<Set<string>>(new Set());
    const [selectedCategory, setSelectedCategory] = useState<Set<string>>(new Set());
    const resultIntrument = FetchIntrumento();
    const resultCategory = FetchCategoria();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSerchAuthor = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set('author', term);
        } else {
            params.delete('author');
        }
        replace(`${pathname}?${params}`, { scroll: false });
    }, 320);

    const handleSerchCategory = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set('category', term);
        } else {
            params.delete('category');
        }
        replace(`${pathname}?${params}`, { scroll: false });
    }, 320);

    const handleSerchInstrument = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set('instrument', term);
        } else {
            params.delete('instrument');
        }
        replace(`${pathname}?${params}`, { scroll: false });
    }, 320);

    const handleCheckboxChange = (instrumentName: string) => {
        const newSelectedInstruments = new Set(selectedInstruments);
        if (newSelectedInstruments.has(instrumentName)) {
            newSelectedInstruments.delete(instrumentName);
        } else {
            newSelectedInstruments.add(instrumentName);
        }
        setSelectedInstruments(newSelectedInstruments);

        // Actualizar queryParams de instrumentos
        const params = new URLSearchParams(searchParams.toString());
        params.set('instrument', Array.from(newSelectedInstruments).join(','));
        replace(`${pathname}?${params}`, { scroll: false });
    };

    const handleCheckboxChangeCat = (categoryName: string) => {
        const newSelectedCategory = new Set(selectedCategory);
        if (newSelectedCategory.has(categoryName)) {
            newSelectedCategory.delete(categoryName);
        } else {
            newSelectedCategory.add(categoryName);
        }
        setSelectedCategory(newSelectedCategory);

        // Actualizar queryParams de categorías
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', Array.from(newSelectedCategory).join(','));
        replace(`${pathname}?${params}`, { scroll: false });
    };

    return (
        <section className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="col-span-2 mb-4 w-full gap-4">
                <h1 className="mb-4 text-lg font-semibold text-gray-800">Busqueda por autor</h1>
                <AutocompleteSuggestion
                    id="book_authors"
                    name=""
                    placeholder="Ingrese autores separados por comas"
                    type="authors"
                    initialSelectedItems={transformToSuggestions([])}
                    onSearch={handleSerchAuthor}
                />
            </div>
            <div className="col-span-2 max-w-md  sm:col-span-1">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">Instrumentos</h2>
                <div className="flex flex-col gap-2 p-2">
                    {resultIntrument.map((inst: Instrument, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                            <Checkbox
                                id={inst.instrument_name}
                                checked={selectedInstruments.has(inst.instrument_name)}
                                onChange={() => handleCheckboxChange(inst.instrument_name)}
                            />
                            <Label htmlFor={inst.instrument_name} className="text-sm text-gray-700">
                                {inst.instrument_name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="col-span-2 max-w-md  sm:col-span-1">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">Categorías</h2>
                <div className="flex flex-col gap-2 p-2">
                    {resultCategory.map((cat: Category, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                            <Checkbox
                                id={cat.category_name}
                                checked={selectedCategory.has(cat.category_name)}
                                onChange={() => handleCheckboxChangeCat(cat.category_name)}
                            />
                            <Label htmlFor={cat.category_name} className="text-sm text-gray-700">
                                {cat.category_name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* <div className="flex flex-col">
                <div className="flex max-w-md gap-4">
                    <h1>Instrumentos</h1>
                    {resultIntrument.map((inst: Instrument, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <Checkbox
                                id={inst.instrument_name}
                                checked={selectedInstruments.has(inst.instrument_name)}
                                onChange={() => handleCheckboxChange(inst.instrument_name)}
                            />
                            <Label className="flex" htmlFor={inst.instrument_name}>{inst.instrument_name}</Label>
                        </div>
                    ))}
                </div>
                <div className="flex max-w-md gap-4">
                    <h1>Categorias</h1>
                    {resultCategory.map((cat: Category, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <Checkbox
                                id={cat.category_name}
                                checked={selectedCategory.has(cat.category_name)}
                                onChange={() => handleCheckboxChangeCat(cat.category_name)}
                            />
                            <Label className="flex" htmlFor={cat.category_name}>{cat.category_name}</Label>
                        </div>
                    ))}
                </div>
            </div> */}
        </section>
    );
}

const FetchIntrumento = () => {
    const [result, setResult] = useState<Instrument[]>([]);

    useEffect(() => {
        const instrument = async () => {
            try {
                const url = `/api/instruments?page=1&size=100`;
                const res = await fetch(url);
                const data = await res.json();
                setResult(data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        instrument();
    }, []);

    return result;
};

const FetchCategoria = () => {
    const [result, setResult] = useState<Category[]>([]);

    useEffect(() => {
        const category = async () => {
            try {
                const url = `/api/categories?page=1&size=100`;
                const res = await fetch(url);
                const data = await res.json();
                setResult(data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        category();
    }, []);

    return result;
};

function AutocompleteSuggestion({ id, name, placeholder, type, initialSelectedItems, onSearch }: SuggestionProps & { onSearch: (term: string) => void }) {
    const [value, setValue] = useState('');
    const [selectedItems, setSelectedItems] = useState<Suggestion[]>(initialSelectedItems);
    const [search, setSearch] = useState('');
    const [view, setView] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const suggestions = useFetchSuggestions(type, search, view);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (selectedItems.length >= 0) {
            setValue(selectedItems.map(item => item.name).join(', ') + '');
        }
    }, [selectedItems]);

    useEffect(() => {
        if (suggestions.length > 0) {
            setIsLoading(false);
        }
    }, [suggestions]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value;
        setValue(inputValue);
        const lastWord = inputValue.split(', ').pop()?.trim() || '';
        setSearch(lastWord);
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        const newSelectedItems = [...selectedItems, suggestion];
        setSelectedItems(newSelectedItems);
        setValue(newSelectedItems.map(item => item.name).join(', ') + ', ');
        setSearch('');
        setView(false);
        onSearch(search); // Actualiza los queryParams al seleccionar una sugerencia
    };

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setView(false);
            setIsLoading(false);
        }, 500);
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
                onClick={() => { setView(true); setIsLoading(true); }}
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
                            >
                                {suggestion.name}
                            </li>
                        ))}
                    </ul>
                )
            )}
        </div>
    );
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

// "use client"
// import { Author, Categories } from "@/interface/Interface";
// import { Checkbox, Label, Spinner, Textarea, TextInput } from "flowbite-react";
// import { useEffect, useRef, useState } from "react";
// import { useSearchParams, usePathname, useRouter } from "next/navigation";
// import { useDebouncedCallback } from 'use-debounce';


// interface Instrument {
//     instrument_name: string;
// }
// interface Category {
//     category_name: string;
// }
// type SuggestionProps = {
//     id: string
//     name: string
//     placeholder: string
//     type: 'categories' | 'authors' | 'instruments'
//     initialSelectedItems: Suggestion[]
// }

// type Suggestion = {
//     id: number;
//     name: string;
// }
// const transformToSuggestions = (items: any[] = []): Suggestion[] => {
//     return items.map(item => ({
//         id: item.id,
//         name: item.instrument_name || item.category_name || item.author_name || '', // Dependiendo del tipo de item
//     }));
// };
// export function BusquedaAvanzada() {
//     const [selectedInstruments, setSelectedInstruments] = useState<Set<string>>(new Set());
//     const [selectedCategory, setSelectedCategory] = useState<Set<string>>(new Set());
//     const resultIntrument = FetchIntrumento();
//     const resultCategory = FetchCategoria();
//     const searchParams = useSearchParams()
//     const pathname = usePathname()
//     const { replace } = useRouter()
//     const handleSerchAuthor = useDebouncedCallback((term: string) => {
//         const params = new URLSearchParams(searchParams.toString())
//         if (term) {
//             params.set('author', term)
//         } else {
//             params.delete('author')
//         }
//         replace(`${pathname}?${params}`, { scroll: false })
//     }, 320)
//     const handleSerchCategory = useDebouncedCallback((term: string) => {
//         const params = new URLSearchParams(searchParams.toString())
//         if (term) {
//             params.set('category', term)
//         } else {
//             params.delete('category')
//         }
//         replace(`${pathname}?${params}`, { scroll: false })
//     }, 320)
//     const handleSerchInstrument = useDebouncedCallback((term: string) => {
//         const params = new URLSearchParams(searchParams.toString())
//         if (term) {
//             params.set('intrument', term)
//         } else {
//             params.delete('intrument')
//         }
//         replace(`${pathname}?${params}`, { scroll: false })
//     }, 320)

//     const handleCheckboxChange = (instrumentName: string) => {
//         const newSelectedInstruments = new Set(selectedInstruments);
//         if (newSelectedInstruments.has(instrumentName)) {
//             newSelectedInstruments.delete(instrumentName);
//         } else {
//             newSelectedInstruments.add(instrumentName);
//         }
//         setSelectedInstruments(newSelectedInstruments);
//     };
//     const handleCheckboxChangeCat = (categoryName: string) => {
//         const newSelectedCategory = new Set(selectedCategory);
//         if (newSelectedCategory.has(categoryName)) {
//             newSelectedCategory.delete(categoryName);
//         } else {
//             newSelectedCategory.add(categoryName);
//         }
//         setSelectedCategory(newSelectedCategory);

//     };

//     return (
//         <section className="grid grid-cols-2">
//             <div className="col-span-2 mb-4 w-full gap-4">
//                 <h1 className="mb-2">Busqueda por autor</h1>
//                 <AutocompleteSuggestion
//                     id="book_authors"
//                     name="Autores"
//                     placeholder="Ingrese autores separados por comas"
//                     type="authors"
//                     initialSelectedItems={transformToSuggestions([])}
//                 />

//             </div>
//             <div className="flex max-w-md flex-col gap-4" >
//                 <h1>Instrumentos</h1>
//                 {resultIntrument.map((inst: Instrument, index: number) => (
//                     <div key={index} className="flex items-center gap-2">
//                         <Checkbox
//                             id={inst.instrument_name}
//                             checked={selectedInstruments.has(inst.instrument_name)}
//                             onChange={() => handleCheckboxChange(inst.instrument_name)}
//                         />
//                         <Label className="flex" htmlFor={inst.instrument_name}>{inst.instrument_name}</Label>
//                     </div>
//                 ))}
//             </div>
//             <div className="flex max-w-md flex-col gap-4" >
//                 <h1>Categorias</h1>
//                 {resultCategory.map((cat: Category, index: number) => (
//                     <div key={index} className="flex items-center gap-2">
//                         <Checkbox
//                             id={cat.category_name}
//                             checked={selectedCategory.has(cat.category_name)}
//                             onChange={() => handleCheckboxChangeCat(cat.category_name)}
//                         />
//                         <Label className="flex" htmlFor={cat.category_name}>{cat.category_name}</Label>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     );
// }

// const FetchIntrumento = () => {
//     const [result, setResult] = useState<Instrument[]>([]);

//     useEffect(() => {
//         const instrument = async () => {
//             try {
//                 const url = `/api/instruments?page=1&size=100`;
//                 const res = await fetch(url);
//                 const data = await res.json();
//                 setResult(data.data);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             }
//         };
//         instrument();
//     }, []);

//     return result;
// };

// const FetchCategoria = () => {
//     const [result, setResult] = useState<Category[]>([]);

//     useEffect(() => {
//         const category = async () => {
//             try {
//                 const url = `/api/categories?page=1&size=100`;
//                 const res = await fetch(url);
//                 const data = await res.json();
//                 setResult(data.data);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             }
//         };
//         category();
//     }, []);

//     return result;
// };


// function AutocompleteSuggestion({ id, name, placeholder, type, initialSelectedItems }: SuggestionProps) {
//     const [value, setValue] = useState('')
//     const [selectedItems, setSelectedItems] = useState<Suggestion[]>(initialSelectedItems)
//     const [search, setSearch] = useState('')
//     const [view, setView] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const suggestions = useFetchSuggestions(type, search, view)
//     const timeoutRef = useRef<NodeJS.Timeout | null>(null);
//     useEffect(() => {
//         if (selectedItems.length >= 0) {
//             setValue(selectedItems.map(item => item.name).join(', ') + '');
//         }
//     }, [selectedItems]); // Dependencia en selectedItems
//     useEffect(() => {
//         if (suggestions.length > 0) {
//             setIsLoading(false)
//         }
//     }, [suggestions]); // Dependencia en selectedItems

//     const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//         const inputValue = e.target.value
//         setValue(inputValue)
//         const lastWord = inputValue.split(', ').pop()?.trim() || ''
//         setSearch(lastWord)
//     }

//     const handleSuggestionClick = (suggestion: Suggestion) => {
//         const newSelectedItems = [...selectedItems, suggestion]
//         setSelectedItems(newSelectedItems)
//         setValue(newSelectedItems.map(item => item.name).join(', ') + ', ')
//         setSearch('')
//         setView(false)
//     }
//     const resetTimeout = () => {
//         if (timeoutRef.current) {
//             clearTimeout(timeoutRef.current);
//         }

//         timeoutRef.current = setTimeout(() => {
//             setView(false);
//             setIsLoading(false)
//         }, 500)
//     };
//     const handleRemoveItem = (itemToRemove: Suggestion) => {
//         const newSelectedItems = selectedItems.filter(item => item.id !== itemToRemove.id);
//         setSelectedItems(newSelectedItems);
//     };


//     return (
//         <div className="relative mb-4">
//             <Label htmlFor={id} className="block text-sm font-medium text-gray-700">
//                 {name}
//             </Label>
//             <Textarea
//                 id={id}
//                 name={id}
//                 placeholder={placeholder}
//                 value={value}
//                 onBlur={resetTimeout}
//                 onFocus={() => setView(true)}
//                 onClick={() => { setView(true); setIsLoading(true) }}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
//             />
//             <div className="mt-2">
//                 {selectedItems.length > 0 && (
//                     <div className="flex flex-wrap gap-2">
//                         {selectedItems.map(item => (
//                             <span
//                                 key={item.id}
//                                 className="inline-block rounded-full bg-amarillo-200 px-3 py-1 text-sm text-black"
//                             >
//                                 {item.name}
//                                 <button
//                                     type="button"
//                                     onClick={() => handleRemoveItem(item)}
//                                     className="ml-2 text-red-500"
//                                 >
//                                     &times;
//                                 </button>
//                             </span>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {isLoading ? (
//                 <div className="absolute z-10 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white p-2 text-center shadow-lg">
//                     <Spinner color="success" size="md" />
//                 </div>
//             ) : (
//                 suggestions.length > 0 && (
//                     <ul className="absolute z-10 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
//                         {suggestions.map((suggestion) => (
//                             <li
//                                 key={suggestion.id}
//                                 onClick={() => handleSuggestionClick(suggestion)}
//                                 className="cursor-pointer px-4 py-2 hover:bg-gray-100"
//                                 value={suggestion.id}
//                             >
//                                 {suggestion.name}
//                             </li>
//                         ))}
//                     </ul>
//                 )
//             )}

//             <input
//                 type="hidden"
//                 name={`${id}_ids`}
//                 defaultValue={selectedItems.map(item => item.id).join(',')}
//             />
//         </div >
//     )
// }



// const useFetchSuggestions = (type: 'categories' | 'authors' | 'instruments', search: string, view: boolean) => {
//     const [data, setData] = useState<Suggestion[]>([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             if (search || view) {
//                 const url = `/api/${type}?query=${search}`;
//                 const res = await fetch(url);
//                 const result = await res.json();
//                 const mappedData = result.data.map((item: Author | Instrument | Categories) => {
//                     if ("category_name" in item) {
//                         return { id: item.id, name: item.category_name };
//                     } else if ("author_name" in item) {
//                         return { id: item.id, name: item.author_name };
//                     }
//                     throw new Error("Unexpected item type");
//                 });
//                 setData(mappedData);
//             } else {
//                 setData([]);
//             }
//         };
//         fetchData();
//     }, [type, search, view]);

//     return data;
// };

