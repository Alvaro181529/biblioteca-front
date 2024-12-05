import { NextResponse } from "next/server"
import { env } from "process"
import { getTokenFromSession } from "@/app/api/utils/auth";

interface interfaceParams {
    id: number
}

export async function PATCH(request: any, { params }: { params: interfaceParams }) {
    const token = await getTokenFromSession();
    const response = await fetch(`${env.NEXT_PUBLIC_URL_API}users/desactivate/${params.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const update = await response.json();
    if (!response.ok) {
        return NextResponse.json(update, { status: update.statusCode });
    };
    return NextResponse.json(update);
}