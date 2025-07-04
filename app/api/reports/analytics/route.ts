import { NextResponse } from "next/server";
import { getTokenFromSession } from "../../utils/auth";

export async function GET(request: Request) {
    const token = await getTokenFromSession();
    const { searchParams } = new URL(request.url);
    let page = searchParams.get("page");
    let startDate = searchParams.get("startDate");
    let endDate = searchParams.get("endDate");
    const date = new Date().toISOString().split('T')[0];
    startDate = startDate ? new Date(startDate).toISOString().split('T')[0] : null;
    endDate = endDate ? new Date(endDate).toISOString().split('T')[0] : null;
    try {
        // Hacer la solicitud al backend
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}reports/analytics`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const blob = await res.blob(); // Obtener el blob (archivo binario)
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf'); // Aseguramos que la respuesta tenga el tipo correcto
        headers.set('Content-Disposition', `inline; filename=reporte-analytics-${date}.pdf`); // Nombre del archivo de descarga

        return new NextResponse(blob, { headers }); // Devolver el archivo binario como respuesta
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ message: "Error en la conexión" }, { status: 500 });
    }
}
