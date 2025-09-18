import { getTokenFromSession } from '@/app/api/utils/auth';
import { NextResponse } from "next/server";

export async function GET(request: any, { params }: { params: { file: string } }) {
    const token = await getTokenFromSession();
    const { searchParams } = new URL(request.url);
    const file = searchParams.get("file");

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}backup/download/${file}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!res.ok) {
            throw new Error('No se pudo descargar el archivo');
        }

        const fileBlob = await res.blob();

        return new NextResponse(fileBlob.stream(), {
            headers: {
                'Content-Type': 'application/sql', 'Content-Disposition': `attachment; filename="${file}"`,
            },
        });

    } catch (error) {
        console.error("Error en la solicitud GET:", error);
        return NextResponse.json({ message: "Error en la conexión" }, { status: 500 });
    }
}