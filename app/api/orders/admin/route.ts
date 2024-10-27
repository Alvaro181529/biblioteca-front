import { NextResponse } from "next/server";

export async function GET(request: any) {
    const { searchParams } = new URL(request.url)
    let page = searchParams.get("page")
    let size = searchParams.get("size")
    let state = searchParams.get("state")
    let query = searchParams.get("query")
    page = (!page || Number(page) < 1) ? "1" : page;
    size = (!size || Number(size) < 1) ? "10" : size;
    state = (!state || Number(state) < 1) ? "" : state;
    query = (!query || Number(query) < 1) ? "" : query;
    try {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhbGpha0Bzc2RzZC5jb20iLCJpYXQiOjE3MjkyMjkzNTAsImV4cCI6MTcyOTIzMjk1MH0.LHpz5jFQmQzIlKnQcemO27pYEHmNulbne5PiFBChxtw"

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}orders/admin?pageSize=${size}&page=${page}&state=${state}&term=${query}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

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

