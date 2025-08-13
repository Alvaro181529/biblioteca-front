import { NextResponse } from "next/server"
import { env } from "process"
import { getTokenFromSession } from "@/app/api/utils/auth";

interface interfaceParams {
    id: string
}
//Esta ruta obtiene los links de los archivos mxl y midi de un libro específico
export async function GET(request: any, { params }: { params: interfaceParams }) {
    const token = await getTokenFromSession()
    const res = await fetch(`${env.NEXT_PUBLIC_URL_API}books/files/${params.id}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await res.json();

    if (!res.ok)
        return NextResponse.json({ message: data.message + data.statusCode }, { status: res.status });

    return NextResponse.json(data);
}
