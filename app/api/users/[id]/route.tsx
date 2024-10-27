import { NextResponse } from "next/server"
import { env } from "process"

interface interfaceParams {
    id: number
}
export async function GET(request: any, { params }: { params: interfaceParams }) {
    const res = await fetch(`${env.NEXT_PUBLIC_URL_API}users/${params.id}`)
    const book = await res.json()
    return NextResponse.json(book)
}
export async function DELETE(request: any, { params }: { params: interfaceParams }) {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJhbGpzYWFrQGdtYWlsLmNvbSIsImlhdCI6MTcyODYxMjExNiwiZXhwIjoxNzI4NjE1NzE2fQ.XA9yHG4Lx8-0Wb1CHQtY34ym5i_CZFgVdNkryhkAqIM"
    const response = await fetch(`${env.NEXT_PUBLIC_URL_API}users/${params.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) {
        const errorMessage = JSON.parse(await response.text()); // Captura el mensaje de error del servidor
        return NextResponse.json({ error: errorMessage || 'Error al eliminar el autor' }, { status: response.status });
    }
    const deletedBook = await response.json();
    return NextResponse.json(deletedBook);
}
export async function PUT(request: any, { params }: { params: interfaceParams }) {

}