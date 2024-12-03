import { TextInput, Label, Select } from "flowbite-react";
import { createInstrument } from "@/lib/createIntrument";
import { family } from "@/types/types";

export function FormCreate({ view, id, data, setOpenModal }: { id?: number, data?: any, view?: boolean, setOpenModal: (open: boolean) => void }) {
    let defaultName
    let defaultFamily
    if (data) [defaultName, defaultFamily] = data;
    const onSave = async () => {
        setTimeout(() => {
            setOpenModal(false);
        }, 500);
    }
    return (
        <form id="submit-form" action={createInstrument} onSubmit={onSave}>
            <div className="space-y-6" >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="mb-4">
                        <Label htmlFor="instrument_name" value="Intrumento" />
                        <TextInput
                            name="instrument_name"
                            id="instrument_name"
                            placeholder="Guitarra"
                            disabled={view}
                            required
                            defaultValue={defaultName}
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="instrument_family" value="Familia" />
                        <Select name="instrument_family" defaultValue={defaultFamily} disabled={view} id="instrument_family">
                            {family.map((families, index) => (
                                <option key={index} value={families.name}>
                                    {families.name}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <input name="id" id="id" hidden defaultValue={id} />
                </div>
            </div>

        </form>

    )
}
