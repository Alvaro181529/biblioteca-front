import { NextResponse } from "next/server"
import { env } from "process"
import { getTokenFromSession } from "../../utils/auth";

interface interfaceParams {
    id: number
}
export async function GET(request: any, { params }: { params: interfaceParams }) {
    const token = await getTokenFromSession();
    const res = await fetch(`${env.NEXT_PUBLIC_URL_API}users/${params.id}`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    const book = await res.json()
    return NextResponse.json(book)
}
export async function DELETE(request: any, { params }: { params: interfaceParams }) {
    const token = await getTokenFromSession();
    console.log(token);
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