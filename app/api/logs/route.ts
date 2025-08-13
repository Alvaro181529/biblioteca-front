import { NextResponse } from "next/server";
import { getTokenFromSession } from "../utils/auth";
export async function GET(request: any) {
    const token = await getTokenFromSession();
    const { searchParams } = new URL(request.url)
    let page = searchParams.get("page")
    let size = searchParams.get("size")
    page = (!page || Number(page) < 1) ? "1" : page;
    size = (!size || Number(size) < 1) ? "10" : size;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}logs?pageSize=${size}&page=${page}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        const book = await res.json();
        return NextResponse.json(book);
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ message: "Error en la conexión" }, { status: 500 });
    }
}

