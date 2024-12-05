import { TextInput, Label, Select } from "flowbite-react";
import { createUser } from "@/lib/createUser";
import { Respuest } from "@/interface/Interface";
import { toast } from "sonner";

export function FormCreate({ view, id, data, setOpenModal }: { id?: number, data?: any, view?: boolean, setOpenModal: (open: boolean) => void }) {
    let email
    let name
    let rol
    if (data) {
        [email, name, rol] = data
    }
    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const result: Respuest = await createUser(formData)
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
    return (
        <form id="submit-form" onSubmit={onSave}>
            <div className="space-y-6" >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="mb-4">
                        <Label htmlFor="name" value="Nombre completo" />
                        <TextInput
                            required
                            disabled={view}
                            name="name"
                            id="name"
                            defaultValue={name}
                            placeholder="Alvaro Herbert Medrano Perez"
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="email" value="Email" />
                        <TextInput
                            disabled={view}
                            defaultValue={email}
                            type="email"
                            name="email"
                            id="email"
                            placeholder="example@gmail.com"
                            autoComplete="off"
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="password" value="Contraseña" />
                        <TextInput
                            disabled={view}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="********"
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="rols" value="Tipo de usuario" />
                        <Select
                            disabled={view}
                            name="rols"
                            id="rols"
                            defaultValue={String(rol)}
                            required
                        >
                            <option value={"ESTUDIANTE"}>Estudiante</option>
                            <option value={"DOCENTE"}>Docente</option>
                            <option value={"ADMINISTRADOR"}>Estudiante</option>
                            <option value={"ESTUDIANTIL"}>Estudiantil</option>
                            <option value={"USUARIO EXTERNO"}>Usuario Externo</option>
                            <option value={"COLEGIAL"}>Colegial</option>
                        </Select>
                    </div>
                    <input type="text" id="id" name="id" defaultValue={id} hidden />
                </div>
            </div>
        </form>
    )
}
