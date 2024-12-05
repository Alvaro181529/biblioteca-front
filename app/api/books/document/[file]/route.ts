import { NextResponse } from "next/server"
import { env } from "process"
import { getTokenFromSession } from "@/app/api/utils/auth";

interface interfaceParams {
    file: string
}
export async function GET(request: any, { params }: { params: interfaceParams }) {
    const token = await getTokenFromSession()
    const res = await fetch(`${env.NEXT_PUBLIC_URL_API}books/document/${params.file}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const pdfBlob = await res.blob();
    const filename = params.file;

    return new NextResponse(pdfBlob.stream(), {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${filename}"`,
        },
    });
}
