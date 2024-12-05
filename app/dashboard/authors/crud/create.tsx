import { TextInput, Label, Textarea } from "flowbite-react";
import { createAuthor } from "@/lib/createAuthor";
import { toast } from "sonner";
import { Respuest } from "@/interface/Interface";
export function FormCreate({ view, id, data, setOpenModal }: { id?: number, data?: any, view?: boolean, setOpenModal: (open: boolean) => void }) {
    let defaultName
    let defaultBiografy

    if (data)
        [defaultName, defaultBiografy] = data;

    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const result: Respuest = await createAuthor(formData);
        if (!result.success) {
            toast.error(result.message, {
                description: result.description
            }); return;
        }
        toast.success(result.message, {
            description: result.description
        });
        setOpenModal(false);
    }
    return (
        <form id="submit-form" onSubmit={onSave}>
            <div className="space-y-6" >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                    <div className="mb-4">
                        <Label htmlFor="author_name" value="Nombre del Autor" />
                        <TextInput
                            required
                            name="author_name"
                            id="author_name"
                            placeholder="Amedus Mozart"
                            disabled={view}
                            defaultValue={defaultName}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="author_biografia" value="Bigrafia del Autor" />
                        <Textarea
                            disabled={view}
                            name="author_biografia"
                            id="author_biografia"
                            placeholder="Biografia"
                            defaultValue={defaultBiografy}
                        />
                    </div>
                    <input name="id" id="id" hidden defaultValue={id} />
                </div>
            </div>

        </form>

    )
}
