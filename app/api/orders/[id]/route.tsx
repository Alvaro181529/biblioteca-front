import { NextResponse } from "next/server"
import { env } from "process"

interface interfaceParams {
    id: number
}
export async function GET(request: any, { params }: { params: interfaceParams }) {
    const res = await fetch(`${env.NEXT_PUBLIC_URL_API}orders/${params.id}`)
    const book = await res.json()
    return NextResponse.json(book)
}
export async function DELETE(request: any, { params }: { params: interfaceParams }) {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhbGpha0Bzc2RzZC5jb20iLCJpYXQiOjE3MjkyMjkzNTAsImV4cCI6MTcyOTIzMjk1MH0.LHpz5jFQmQzIlKnQcemO27pYEHmNulbne5PiFBChxtw"
    const response = await fetch(`${env.NEXT_PUBLIC_URL_API}orders/${params.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) {
        const errorMessage = JSON.parse(await response.text()); // Captura el mensaje de error del servidor
        return NextResponse.json({ error: errorMessage || 'Error al eliminar el order' }, { status: response.status });
    }
    const deletedBook = await response.json();
    return NextResponse.json(deletedBook);
}
export async function PUT(request: any, { params }: { params: interfaceParams }) {

}