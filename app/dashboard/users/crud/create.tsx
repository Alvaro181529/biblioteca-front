import { TextInput, Label, Select } from "flowbite-react";
import { createUser } from "../lib/createIntrument";
import { useEffect, useState } from "react";
import { User } from "../Interface/Interface";

export function FormCreate({ view, id, data, setOpenModal }: { id?: number, data?: any, view?: boolean, setOpenModal: (open: boolean) => void }) {
    let email
    let name
    let rol
    if (data) {
        [email, name, rol] = data
    }
    const onSave = async () => {
        setTimeout(() => {
            setOpenModal(false);
        }, 500);
    }
    return (
        <form id="submit-form" action={createUser} onSubmit={onSave}>
            <div className="space-y-6" >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="mb-4">
                        <Label htmlFor="name" value="Nombre completo" />
                        <TextInput
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
                        >
                            <option value={"ESTUDIANTE"}>Estudiante</option>
                            <option value={"USUARIO"}>Persona Comun</option>
                        </Select>
                    </div>
                    <input type="text" id="id" name="id" defaultValue={id} hidden />
                </div>
            </div>
        </form>
    )
}
