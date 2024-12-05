"use client"
import { TextInput, Label, Tabs, FileInput, Textarea, Select, Spinner } from "flowbite-react";
import { createPublication } from "@/lib/createPublications";
import { useEffect, useState } from "react";
import { Publication, Respuest } from "@/interface/Interface";
import { toast } from "sonner";

export function FormCreate({ view, id, data, setOpenModal }: { id?: number, data?: any, view?: boolean, setOpenModal: (open: boolean) => void }) {
    const [fetch, setFetch] = useState<Publication | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null);
    let defaultActive
    if (data) {
        defaultActive = data[3]
        defaultActive = defaultActive == "Publicacion esta visible" ? "true" : "false"
    }

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFile(e.target.files[0]);
        }
    };

    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        if (imageFile) formData.append("file", imageFile);
        const result: Respuest = await createPublication(formData)
        if (!result.success) {
            toast.error(result.message, {
                description: result.description
            });
            return
        }
        toast.success(result.message, {
            description: result.description
        });
        setOpenModal(false);
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

    if (fetch == null && id) return (
        <div className="text-center">
            <Spinner color="success" aria-label="Success spinner" size="xl" />
        </div >
    )
    return (
        <form id="submit-form" onSubmit={onSave}>
            <div className="space-y-6" >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="col-span-2 mb-4">
                        <Label htmlFor="publication_title" value="Titulo" />
                        <TextInput
                            name="publication_title"
                            id="publication_title"
                            placeholder="Sólfeo"
                            defaultValue={fetch?.publication_title ?? ""}
                        />
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="publication_content" value="Contenido" />
                        <Textarea
                            name="publication_content"
                            id="publication_content"
                            placeholder="Contenido"
                            defaultValue={fetch?.publication_content ?? ""}
                        />
                    </div>
                    <div className="col-span-2 mb-4">
                        <Tabs aria-label="Tabs with underline" style="underline" >
                            <Tabs.Item active title="URL">
                                <Label htmlFor="publication_imagen" value="Imagen " />
                                <span className="text-xs text-gray-700">(opcional)</span>
                                <TextInput
                                    name="publication_imagen"
                                    defaultValue={fetch?.publication_imagen ?? ""}
                                    placeholder="URL de la imagen"
                                />
                            </Tabs.Item>
                            <Tabs.Item title="Archivo">
                                <Label htmlFor="publication_imagen" value="Imagen " />
                                <span className="text-xs text-gray-700">(opcional)</span>
                                <FileInput
                                    accept="image/*"
                                    id="imagen"
                                    onChange={onImageChange}
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