"use client"
import { TextInput, Label, ListGroup } from "flowbite-react";
import { useEffect, useState } from "react";
import { User } from "@/interface/Interface";
import { createOrder } from "@/lib/createOrder";

export function FormBorrowed({ id, setOpenModal }: { id?: number, setOpenModal: (open: boolean) => void }) {
    const [search, setSearch] = useState("");
    const [userid, setUserid] = useState("");
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const data = UserData(search);

    useEffect(() => {
        if (search) {
            setSuggestions(data);
        }
    }, [data, search]);

    const onSave = async () => {
        setTimeout(() => {
            setOpenModal(false);
        }, 500);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const Search = event.target.value
        setSearch(Search);
    };

    const handleSuggestionClick = (user: User) => {
        setSearch(user.name);
        setUserid(String(user.id));
        setSuggestions([]);
    };

    return (
        <form id="submit-form" action={createOrder} onSubmit={onSave}>
            <div className="space-y-2">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <Label htmlFor="user" value="Usuario" />
                        <TextInput
                            id="user"
                            value={search}
                            onChange={handleChange}
                        />
                    </div>
                    {suggestions.length > 0 && (
                        <ListGroup className="w-full">
                            {suggestions.map((user) => (
                                <ListGroup.Item
                                    key={user.id}
                                    onClick={() => handleSuggestionClick(user)}
                                >
                                    <div className="grid w-full grid-cols-2 gap-5">
                                        <span className="text-left">{user.name}</span>
                                        <span className="text-left text-gray-600 dark:text-gray-300">{user.email}</span>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                    <input name="id" id="id" hidden defaultValue={userid} />
                    <input name="book" id="book" hidden defaultValue={id} />
                </div>
            </div>
        </form>
    );
}

const UserData = (search: string) => {
    const [data, setData] = useState<User[]>([]); // Cambié a un array de usuarios
    useEffect(() => {
        const fetchDataUser = async () => {
            if (search) {
                const url = `/api/users?name=${search}`;
                const res = await fetch(url);
                const result = await res.json();
                setData(result.data || []); // Asegurándome de que sea un array
            } else {
                setData([]); // Limpiar datos si no hay búsqueda
            }
        };
        fetchDataUser();
    }, [search]);

    return data;
};
