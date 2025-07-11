"use client";

import { Author, Categories } from "@/interface/Interface";
import { Checkbox, Label, Spinner, Textarea } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

// Tipos
interface Instrument {
    instrument_name: string;
    id: any,
}
interface Category {
    category_name: string;
    id: any
}
type Suggestion = {
    id: any;
    name: string;
};
type SuggestionProps = {
    id: string;
    name: string;
    placeholder: string;
    type: "categories" | "authors" | "instruments";
    initialSelectedItems: Suggestion[];
    onSearch: (term: string) => void;
};

// Transformación genérica
const transformToSuggestions = (items: any[] = []): Suggestion[] => {
    return items.map((item) => ({
        id: item.id,
        name: item.instrument_name || item.category_name || item.author_name || "",
    }));
};

// Hook para instrumentos
function useFetchInstrumento() {
    const [result, setResult] = useState<Instrument[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/instruments?page=1&size=100");
                const data = await res.json();
                setResult(data.data);
            } catch (error) {
                console.error("Error fetching instruments:", error);
            }
        };
        fetchData();
    }, []);

    return result;
}

// Hook para categorías
function useFetchCategoria() {
    const [result, setResult] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/categories?page=1&size=100");
                const data = await res.json();
                setResult(data.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchData();
    }, []);

    return result;
}

// Hook de sugerencias
function useFetchSuggestions(
    type: "categories" | "authors" | "instruments",
    search: string,
    view: boolean
) {
    const [data, setData] = useState<Suggestion[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (search || view) {
                try {
                    const url = `/api/${type}?query=${search}`;
                    const res = await fetch(url);
                    const result = await res.json();

                    const mappedData = result.data.map(
                        (item: Author | Instrument | Categories) => {
                            if ("category_name" in item)
                                return { id: item.id, name: item.category_name };
                            if ("author_name" in item)
                                return { id: item.id, name: item.author_name };
                            if ("instrument_name" in item)
                                return { id: item.id, name: item.instrument_name };
                            throw new Error("Unexpected item type");
                        }
                    );
                    setData(mappedData);
                } catch (err) {
                    console.error("Error fetching suggestions:", err);
                }
            } else {
                setData([]);
            }
        };
        fetchData();
    }, [type, search, view]);

    return data;
}

// Componente principal
export function BusquedaAvanzada() {

    const instruments = useFetchInstrumento();
    const categories = useFetchCategoria();
    const searchParams = useSearchParams();
    const [selectedInstruments, setSelectedInstruments] = useState<Set<string>>(() => {
        const instrumentParam = searchParams.get("instrument");
        return new Set(instrumentParam ? instrumentParam.split(",") : []);
    });
    const [selectedCategory, setSelectedCategory] = useState<Set<string>>(() => {
        const categoryParam = searchParams.get("category");
        return new Set(categoryParam ? categoryParam.split(",") : []);
    });

    const pathname = usePathname();
    const { replace } = useRouter();

    const authorParam = searchParams.get("author");
    const initialAuthors = authorParam
        ? authorParam.split(",").map((name, index) => ({
            id: `${index}-${name.trim()}`,
            name: name.trim(),
        }))
        : [];

    const updateQueryParams = (key: string, values: Set<string>) => {

        const params = new URLSearchParams(searchParams.toString());
        if (values.size > 0) {
            params.set(key, Array.from(values).join(","));
        } else {
            params.delete(key);
        }
        replace(`${pathname}?${params}`, { scroll: false });
    };

    const handleSearch = useDebouncedCallback((key: string, term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set(key, term);
        } else {
            params.delete(key);
        }
        replace(`${pathname}?${params}`, { scroll: false });
    }, 300);

    const toggleSelection = (
        name: string,
        selectedSet: Set<string>,
        setSelected: React.Dispatch<React.SetStateAction<Set<string>>>,
        queryKey: string
    ) => {
        const newSet = new Set(selectedSet);
        newSet.has(name) ? newSet.delete(name) : newSet.add(name);
        setSelected(newSet);
        updateQueryParams(queryKey, newSet);
    };

    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Autores */}
            <div className="col-span-2">
                <h1 className="mb-4 text-lg font-semibold text-gray-800">Búsqueda por autor</h1>
                <AutocompleteSuggestion
                    id="book_authors"
                    name=""
                    placeholder="Ingrese autores separados por comas"
                    type="authors"
                    initialSelectedItems={initialAuthors}
                    onSearch={(term) => handleSearch("author", term)}
                />
            </div>

            {/* Instrumentos */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-800">Instrumentos</h2>
                <div className="flex flex-col gap-2 p-2">
                    {instruments.map((inst, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <Checkbox
                                id={inst.instrument_name}
                                checked={selectedInstruments.has(inst.instrument_name)}
                                onChange={() =>
                                    toggleSelection(inst.instrument_name, selectedInstruments, setSelectedInstruments, "instrument")
                                }
                            />
                            <Label htmlFor={inst.instrument_name} className="text-sm text-gray-700">
                                {inst.instrument_name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categorías */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-800">Categorías</h2>
                <div className="flex flex-col gap-2 p-2">
                    {categories.map((cat, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <Checkbox
                                id={cat.category_name}
                                checked={selectedCategory.has(cat.category_name)}
                                onChange={() =>
                                    toggleSelection(cat.category_name, selectedCategory, setSelectedCategory, "category")
                                }
                            />
                            <Label htmlFor={cat.category_name} className="text-sm text-gray-700">
                                {cat.category_name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Autocompletado
function AutocompleteSuggestion({
    id,
    name,
    placeholder,
    type,
    initialSelectedItems,
    onSearch,
}: SuggestionProps) {
    const [value, setValue] = useState("");
    const [selectedItems, setSelectedItems] = useState<Suggestion[]>(initialSelectedItems);
    const [search, setSearch] = useState("");
    const [view, setView] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const suggestions = useFetchSuggestions(type, search, view);

    useEffect(() => {
        setValue(selectedItems.map((item) => item.name).join(", "));
        onSearch(selectedItems.map((item) => item.name).join(","));
    }, [selectedItems]);
    useEffect(() => {
        if (suggestions.length > 0) setIsLoading(false);
    }, [suggestions]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value;
        setValue(inputValue);
        const lastWord = inputValue.split(",").pop()?.trim() || "";
        setSearch(lastWord);
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        if (selectedItems.some((item) => item.id === suggestion.id)) return;

        const newSelectedItems = [...selectedItems, suggestion];
        setSelectedItems(newSelectedItems);
        setView(false);
        setSearch("");
    };

    const resetTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setView(false);
            setIsLoading(false);
        }, 500);
    };

    const handleRemoveItem = (itemId: string) => {
        const updatedItems = selectedItems.filter((item: any) => item.id !== itemId);
        setSelectedItems(updatedItems);
    };

    return (
        <div className="relative w-full">
            <Textarea
                id={id}
                name={name}
                placeholder={placeholder}
                rows={2}
                value={value}
                onFocus={() => setView(true)}
                onBlur={resetTimeout}
                onChange={handleInputChange}
                className="resize-none"
            />

            {view && (
                <ul className="absolute z-10 mt-1 w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm">
                    {isLoading && (
                        <li className="flex justify-center p-2">
                            <Spinner size="sm" />
                        </li>
                    )}
                    {!isLoading &&
                        suggestions.map((suggestion) => (
                            <li
                                key={suggestion.id}
                                className="cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion.name}
                            </li>
                        ))}
                </ul>
            )}

            <div className="mt-2 flex flex-wrap gap-2">
                {selectedItems.map((item) => (
                    <span key={item.id} className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
                        {item.name}
                        <button className="ml-2 text-red-500" onClick={() => handleRemoveItem(item.id)}>
                            &times;
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}