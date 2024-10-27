import { NextResponse } from "next/server"
import { env } from "process"

interface interfaceParams {
    id: number
}
export async function GET(request: any, { params }: { params: interfaceParams }) {
    const res = await fetch(`${env.NEXT_PUBLIC_URL_API}contents/${params.id}`)
    const book = await res.json()
    return NextResponse.json(book)
}
export async function DELETE(request: any, { params }: { params: interfaceParams }) {
    console.log(params.id);
    const response = await fetch(`${env.NEXT_PUBLIC_URL_API}contents/${params.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        const errorMessage = await response.text(); // Captura el mensaje de error del servidor
        return NextResponse.json({ errorMessage }, { status: response.status });
    }
    const deletedBook = await response.json();
    return NextResponse.json(deletedBook);
}
export async function PUT(request: any, { params }: { params: interfaceParams }) {

}