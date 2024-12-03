import { TextInput, Label } from "flowbite-react";
import { createCategory } from "@/lib/createCategory";

export function FormCreate({ view, id, data, setOpenModal }: { id?: number, data?: any, view?: boolean, setOpenModal: (open: boolean) => void }) {
    let defaultName
    let defaultDescription
    if (data) [defaultName, defaultDescription] = data
    const onSave = async () => {
        setTimeout(() => {
            setOpenModal(false);
        }, 500);
    }
    return (
        <form id="submit-form" action={createCategory} onSubmit={onSave}>
            <div className="space-y-6" >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="mb-4">
                        <Label htmlFor="category_name" value="Categoria" />
                        <TextInput
                            name="category_name"
                            id="category_name"
                            placeholder="Sólfeo"
                            disabled={view}
                            defaultValue={defaultName}
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="category_description" value="Descripcion" />
                        <TextInput
                            name="category_description"
                            id="category_description"
                            placeholder="Cuerdas"
                            disabled={view}
                            defaultValue={defaultDescription}
                        />
                    </div>
                    <input name="id" id="id" hidden defaultValue={id} />
                </div>
            </div>

        </form>

    )
}
