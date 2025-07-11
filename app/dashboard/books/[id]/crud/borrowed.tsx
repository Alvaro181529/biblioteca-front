"use client";

import { useState, useEffect } from "react";
import { TextInput, Label, ListGroup } from "flowbite-react";
import { User } from "@/interface/Interface";
import { createOrder } from "@/lib/createOrder";
import { toast } from "sonner";

export function FormBorrowed({
    id,
    setOpenModal,
}: {
    id?: number;
    setOpenModal: (open: boolean) => void;
}) {
    const [search, setSearch] = useState("");
    const [userid, setUserid] = useState("");
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSelectedUser, setHasSelectedUser] = useState(false);

    useEffect(() => {
        // Solo buscar si no hay usuario seleccionado y el search no está vacío
        if (!search.trim() || hasSelectedUser) {
            setSuggestions([]);
            return;
        }

        const fetchDataUser = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/users?query=${encodeURIComponent(search)}`);

                if (!res.ok) throw new Error("Error al obtener usuarios");

                const result = await res.json();
                setSuggestions(result.data || []);
            } catch (error) {
                console.error(error);
                toast.error("No se pudo cargar la lista de usuarios.");
            } finally {
                setLoading(false);
            }
        };

        fetchDataUser();
    }, [search, hasSelectedUser]);

    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userid) {
            toast.error("Por favor selecciona un usuario válido de la lista.");
            return;
        }

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const result = await createOrder(formData);

        if (!result.success) {
            toast.error(result.message, { description: result.description });
            return;
        }

        toast.success(result.message, { description: result.description });
        setOpenModal(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setUserid("");
        setHasSelectedUser(false); // si el usuario cambia el input, desbloquea búsqueda
    };

    const handleSuggestionClick = (user: User) => {
        setSearch(user.name);
        setUserid(String(user.id));
        setSuggestions([]);
        setHasSelectedUser(true); // bloquea búsqueda al tener usuario seleccionado
    };

    return (
        <form id="submit-form" onSubmit={onSave} autoComplete="off">
            <div className="space-y-2">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <Label htmlFor="user" value="Usuario" />
                        <TextInput
                            id="user"
                            value={search}
                            onChange={handleChange}
                            placeholder="Buscar usuario..."
                            required
                        />
                        {loading && <p className="text-sm text-gray-500 mt-1">Cargando...</p>}
                    </div>

                    {suggestions.length > 0 && (
                        <ListGroup className="max-h-48 overflow-y-auto">
                            {suggestions.map((user) => (
                                <ListGroup.Item
                                    key={user.id}
                                    className="cursor-pointer"
                                    onClick={() => handleSuggestionClick(user)}
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <span>{user.name}</span>
                                        <span className="text-gray-600 dark:text-gray-300">{user.email}</span>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}

                    {/* Inputs ocultos para enviar con el formulario */}
                    <input type="hidden" name="id" value={userid} />
                    <input type="hidden" name="book" value={id} />
                </div>
            </div>
        </form>
    );
}
