import { TextInput, Label } from "flowbite-react";
import { createCategory } from "@/lib/createCategory";
import { Respuest } from "@/interface/Interface";
import { toast } from "sonner";

export function FormCreate({ view, id, data, setOpenModal }: { id?: number, data?: any, view?: boolean, setOpenModal: (open: boolean) => void }) {
    let defaultName
    let defaultDescription
    if (data) [defaultName, defaultDescription] = data
    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const result: Respuest = await createCategory(formData)
        if (!result.success) {
            toast.error(result.message);
            return
        }
        toast.success(result.message);
        setOpenModal(false);
    }
    return (
        <form id="submit-form" onSubmit={onSave}>
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
