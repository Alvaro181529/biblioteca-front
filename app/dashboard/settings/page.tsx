import { Button, Card, Label, TextInput } from "flowbite-react"

export default function SettingPage() {
    return (
        <section>
            <SectionMe />
            <SectionAccountDelete />
        </section>
    )
}

const SectionMe = () => {
    return (
        <Card className="mb-2 grid w-full grid-cols-2">
            <h5 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                Actualizar constraseña
            </h5>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="email1" value="Your email" />
                </div>
                <TextInput id="email1" type="email" placeholder="name@flowbite.com" required />
            </div>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="email1" value="Your email" />
                </div>
                <TextInput id="email1" type="email" placeholder="name@flowbite.com" required />
            </div>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="email1" value="Your email" />
                </div>
                <TextInput id="email1" type="email" placeholder="name@flowbite.com" required />
            </div>
            <section className=" flex">
                <Button className="bg-verde-600 ">Guardar</Button>
            </section>
        </Card>
    )
}

const SectionAccountDelete = () => {
    return (
        <Card className="mb-2 w-full">
            <h5 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-white">
                Eliminar cuenta
            </h5>
            <section className=" flex">
                <Button className="bg-red-600 dark:bg-red-700">Eliminar</Button>
            </section>
        </Card>
    )
}