"use client"
import { TextInput, Label } from "flowbite-react";
import { createContent } from "@/lib/createContent";
import React, { useState } from "react";
import { Respuest } from "@/interface/Interface";
import { toast } from "sonner";

export function FormCreate({ id, data, setOpenModal, view }: { id?: number, data?: any, setOpenModal: (open: boolean) => void, view?: boolean }) {
    let title: any;
    let titleParallel: any;
    let number: any;
    let idData: any;
    if (data) ({ id: idData, content_sectionTitle: title, content_sectionTitleParallel: titleParallel, content_pageNumber: number } = data);

    const [contents, setContents] = useState([{ sectionTitle: title, sectionTitleParallel: titleParallel, pageNumber: number }]);

    const handleAddContent = () => {
        setContents([...contents, { sectionTitle: '', sectionTitleParallel: '', pageNumber: 0 }]);
    };

    const handleChange = (index: any, field: any, value: any) => {
        const newContents: any = [...contents];
        newContents[index][field] = value;
        setContents(newContents);
    };
    const onSave = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement);
        const result: Respuest = await createContent(formData)
        if (!result.success) {
            toast.error(result.message);
            return
        }
        toast.success(result.message);
        setOpenModal(false);
    }

    return (
        <form id="submit-form" onSubmit={onSave}>
            <div className="space-y-2" >
                {contents.map((content, index) => (
                    <div key={index} className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="col-span-3 mb-4">
                            <Label htmlFor={`content_sectionTitle_${index}`} value="Seccion" />
                            <TextInput
                                name={`content_sectionTitle_${index}`}
                                id={`content_sectionTitle_${index}`}
                                placeholder="Contenido"
                                defaultValue={title}
                                onChange={(e) => handleChange(index, 'sectionTitle', e.target.value)}
                            />
                            <Label htmlFor={`content_sectionTitleParallel_${index}`} value="Seccion" />
                            <TextInput
                                name={`content_sectionTitleParallel_${index}`}
                                id={`content_sectionTitleParallel_${index}`}
                                placeholder="Contenido"
                                defaultValue={titleParallel}
                                onChange={(e) => handleChange(index, 'sectionTitleParallel', e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor={`content_pageNumber_${index}`} value="Pagina" />
                            <TextInput
                                type="number"
                                name={`content_pageNumber_${index}`}
                                id={`content_pageNumber_${index}`}
                                defaultValue={number}
                                placeholder="2"
                                onChange={(e) => handleChange(index, 'pageNumber', Number(e.target.value))}
                            />
                        </div>
                        <input name="book" id="book" hidden defaultValue={id} />
                        <input name={`id_${index}`} id={`id_${index}`} hidden defaultValue={String(idData)} />
                    </div>
                ))}
                {!view && (
                    <button
                        type="button"
                        aria-label="Agregar contenido"
                        className={`group relative flex items-center justify-center rounded-md border 
            border-gray-300 bg-white p-2 text-sm font-medium text-gray-900 
            transition duration-200 hover:bg-gray-100 focus:outline-none focus:ring-4 
            dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700`}
                        onClick={handleAddContent}
                    >
                        Agregar Contenido
                    </button>
                )}
            </div>
        </form>
    )
}
