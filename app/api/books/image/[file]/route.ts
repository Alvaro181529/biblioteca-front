import { NextResponse } from "next/server"
import { env } from "process"
import { getTokenFromSession } from "@/app/api/utils/auth";

interface interfaceParams {
    file: string
}
export async function GET(request: any, { params }: { params: interfaceParams }) {
    const token = await getTokenFromSession()
    const res = await fetch(`${env.NEXT_PUBLIC_URL_API}books/image/${params.file}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const imageBlob = await res.blob();
    const contentType = res.headers.get('Content-Type') || 'application/octet-stream';
    const filename = params.file;

    // Devolver la imagen como un archivo
    return new NextResponse(imageBlob.stream(), {
        headers: {
            'Content-Type': contentType,
            'Content-Disposition': `inline; filename="${filename}"`,
        },
    });
}
