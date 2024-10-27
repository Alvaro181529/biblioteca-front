import { NextResponse } from "next/server"

export async function GET(request: any) {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page")
    const size = searchParams.get("size")
    const search = searchParams.get("search")
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}search?page=${page}&pageSize=${size}&term=${search}`);

        if (!res.ok) {
            console.error("Error fetching data:", res.statusText);
            return NextResponse.json({ message: "Error en la conexión" }, { status: 500 });
        }

        const book = await res.json();
        return NextResponse.json(book);
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ message: "Error en la conexión" }, { status: 500 });
    }
}