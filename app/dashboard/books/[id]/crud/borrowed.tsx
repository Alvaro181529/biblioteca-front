// "use client"
// import { TextInput, Label, ListGroup } from "flowbite-react";
// import { useEffect, useState } from "react";
// import { User } from "@/interface/Interface";
// import { createOrder } from "@/lib/createOrder";
// import { toast } from "sonner";

// export function FormBorrowed({ id, setOpenModal }: { id?: number, setOpenModal: (open: boolean) => void }) {
//     const [search, setSearch] = useState("");
//     const [userid, setUserid] = useState("");
//     const [suggestions, setSuggestions] = useState<User[]>([]);
//     const data = UserData(search);

//     useEffect(() => {
//         if (search) {
//             setSuggestions(data);
//         }
//     }, [data, search]);

//     const onSave = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const formData = new FormData(e.target as HTMLFormElement);
//         const result = await createOrder(formData)
//         if (!result.success) {
//             toast.error(result.message, {
//                 description: result.description
//             });
//             return
//         }
//         toast.success(result.message, {
//             description: result.description
//         });
//         setOpenModal(false);
//     }

//     const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const Search = event.target.value
//         setSearch(Search);
//     };

//     const handleSuggestionClick = (user: User) => {
//         setSearch(user.name);
//         setUserid(String(user.id));
//         setSuggestions([]);
//     };

//     return (
//         <form id="submit-form" onSubmit={onSave}>
//             <div className="space-y-2">
//                 <div className="grid grid-cols-1 gap-4">
//                     <div>
//                         <Label htmlFor="user" value="Usuario" />
//                         <TextInput
//                             id="user"
//                             value={search}
//                             onChange={handleChange}
//                         />
//                     </div>
//                     {suggestions.length > 0 && (
//                         <ListGroup className="w-full">
//                             {suggestions.map((user) => (
//                                 <ListGroup.Item
//                                     key={user.id}
//                                     onClick={() => handleSuggestionClick(user)}
//                                 >
//                                     <div className="grid w-full grid-cols-2 gap-5">
//                                         <span className="text-left">{user.name}</span>
//                                         <span className="text-left text-gray-600 dark:text-gray-300">{user.email}</span>
//                                     </div>
//                                 </ListGroup.Item>
//                             ))}
//                         </ListGroup>
//                     )}
//                     <input name="id" id="id" hidden defaultValue={userid} />
//                     <input name="book" id="book" hidden defaultValue={id} />
//                 </div>
//             </div>
//         </form>
//     );
// }

// const UserData = (search: string) => {
//     const [data, setData] = useState<User[]>([]); // Cambié a un array de usuarios
//     useEffect(() => {
//         const fetchDataUser = async () => {
//             if (search) {
//                 const url = `/api/users?name=${search}`;
//                 const res = await fetch(url);
//                 const result = await res.json();
//                 setData(result.data || []); // Asegurándome de que sea un array
//             } else {
//                 setData([]); // Limpiar datos si no hay búsqueda
//             }
//         };
//         fetchDataUser();
//     }, [search]);

//     return data;
// };
"use client";
import { TextInput, Label, ListGroup } from "flowbite-react";
import { useEffect, useState } from "react";
import { User } from "@/interface/Interface";
import { createOrder } from "@/lib/createOrder";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

export function FormBorrowed({ id, setOpenModal }: { id?: number, setOpenModal: (open: boolean) => void }) {
    const [formState, setFormState] = useState<{ search: string, userid: string }>({ search: '', userid: '' });
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Función que obtiene los datos de los usuarios basados en la búsqueda
    const fetchDataUser = async (search: string) => {
        if (search) {
            setIsLoading(true);
            try {
                const url = `/api/users?name=${search}`;
                const res = await fetch(url);

                if (!res.ok) {
                    throw new Error("Error al obtener los usuarios");
                }

                const result = await res.json();
                setSuggestions(result.data || []);
            } catch (error) {
                console.error(error);
                toast.error("Hubo un problema al buscar usuarios.");
            } finally {
                setIsLoading(false);
            }
        } else {
            setSuggestions([]);
        }
    };

    // Usamos debounce para optimizar las búsquedas
    const debouncedSearch = useDebouncedCallback((search: string) => {
        fetchDataUser(search);
    }, 500); // 500ms de espera

    // Manejo de cambios en el input de búsqueda
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const search = event.target.value;
        setFormState(prev => ({ ...prev, search }));
        debouncedSearch(search); // Llamada con debounce
    };

    // Manejo de clic en una sugerencia de usuario
    const handleSuggestionClick = (user: User) => {
        setFormState({ search: user.name, userid: String(user.id) });
        setSuggestions([]);
    };

    // Enviar el formulario
    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones
        if (!formState.search || !formState.userid) {
            toast.error("Por favor selecciona un usuario.");
            return;
        }

        const formData = new FormData(e.target as HTMLFormElement);
        const result = await createOrder(formData);

        if (!result.success) {
            toast.error(result.message, { description: result.description });
            return;
        }

        toast.success(result.message, { description: result.description });
        setOpenModal(false);
    };

    return (
        <form id="submit-form" onSubmit={onSave}>
            <div className="space-y-2">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <Label htmlFor="user" value="Usuario" />
                        <TextInput
                            id="user"
                            value={formState.search}
                            onChange={handleChange}
                            placeholder="Buscar usuario..."
                        />
                        {isLoading && <div className="text-sm text-gray-500">Cargando...</div>}
                    </div>
                    {suggestions.length > 0 && (
                        <ListGroup>
                            {suggestions.map((user) => (
                                <div
                                    key={user.id}
                                    className="grid w-full cursor-pointer grid-cols-2 gap-5 p-2 hover:bg-gray-100"
                                    onClick={() => handleSuggestionClick(user)}
                                >
                                    <span className="text-left">{user.name}</span>
                                    <span className="text-left text-gray-600 dark:text-gray-300">{user.email}</span>
                                </div>
                            ))}
                        </ListGroup>
                    )}
                    <input name="id" id="id" hidden defaultValue={formState.userid} />
                    <input name="book" id="book" hidden defaultValue={id} />
                </div>
            </div>
        </form>
    );
}
