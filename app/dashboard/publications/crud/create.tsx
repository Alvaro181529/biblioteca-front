"use client"
import { TextInput, Label, Tabs, FileInput, Textarea, Select } from "flowbite-react";
import { createPublication } from "../lib/createPublications";
import { useEffect, useState } from "react";
import { Publication } from "../Interface/Interface";

export function FormCreate({ view, id, data, setOpenModal }: { id?: number, data?: any, view?: boolean, setOpenModal: (open: boolean) => void }) {
    const [fetch, setFetch] = useState<Publication | null>(null)
    let defaultActive
    if (data) {
        defaultActive = data[3]
        defaultActive = defaultActive == "Publicacion esta visible" ? "true" : "false"
    }
    const onSave = async () => {
        setTimeout(() => {
            setOpenModal(false);
        }, 500);
    }
    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                const res = await image(id)
                setFetch(res);
            }
        }
        fetchData()
    }, [id])
    return (
        <form id="submit-form" action={createPublication} onSubmit={onSave}>
            <div className="space-y-6" >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="col-span-2 mb-4">
                        <Label htmlFor="publication_title" value="Titulo" />
                        <TextInput
                            name="publication_title"
                            id="publication_title"
                            placeholder="Sólfeo"
                            defaultValue={fetch?.publication_title}
                        />
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="publication_content" value="Contenido" />
                        <Textarea
                            name="publication_content"
                            id="publication_content"
                            placeholder="Contenido"
                            defaultValue={fetch?.publication_content}
                        />
                    </div>
                    <div className="col-span-2 mb-4">
                        <Tabs aria-label="Tabs with underline" style="underline" >
                            <Tabs.Item active title="URL">
                                <Label htmlFor="publication_imagen" value="Imagen " />
                                <span className="text-xs text-gray-700">(opcional)</span>
                                <TextInput
                                    name="publication_imagen"
                                    defaultValue={fetch?.publication_imagen}
                                    placeholder="URL de la imagen"
                                />
                            </Tabs.Item>
                            <Tabs.Item title="Archivo">
                                <Label htmlFor="publication_imagen" value="Imagen " />
                                <span className="text-xs text-gray-700">(opcional)</span>
                                <FileInput
                                    id="publication_imagen"
                                    defaultValue={fetch?.publication_imagen}
                                />
                            </Tabs.Item>
                        </Tabs>
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="publication_importance" value="Importancia de la publicación" />
                        <Select
                            name="publication_importance"
                            id="publication_importance"
                            defaultValue={fetch?.publication_importance}
                        >
                            <option>ALTO</option>
                            <option>MEDIO</option>
                            <option>BAJO</option>
                        </Select>
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="publication_active" value="Estado de publicacion" />
                        <Select
                            name="publication_active"
                            id="publication_active"
                            defaultValue={defaultActive}
                        >
                            <option value={"true"} >Publicacion esta visible</option>
                            <option value={"false"}>Publicacion no esta visible</option>
                        </Select>
                    </div>
                    <input name="id" id="id" hidden defaultValue={id} />
                </div>
            </div>
        </form>

    )
}

const image = async (id: number) => {
    const res = await fetch(`/api/publications/${id}`);

    if (!res.ok) {
        throw new Error('Error al crear la Publicacion: ' + res.statusText);
    }
    return await res.json()
}