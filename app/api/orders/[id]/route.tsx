import { NextResponse } from "next/server"
import { env } from "process"
import { getTokenFromSession } from "../../utils/auth"

interface interfaceParams {
    id: number
}
export async function GET(request: any, { params }: { params: interfaceParams }) {
    const token = await getTokenFromSession()
    const res = await fetch(`${env.NEXT_PUBLIC_URL_API}orders/${params.id}`,
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
    const token = await getTokenFromSession()
    const response = await fetch(`${env.NEXT_PUBLIC_URL_API}orders/${params.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const deleted = await response.json();
    return NextResponse.json(deleted);
}