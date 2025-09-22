import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth";

export async function getTokenFromSession() {
    const session = await getServerSession(authOptions);
    return session?.user?.accessToken || null; // Retorna el token o null si no existe
}
export async function getSessionUser() {
    const session = await getServerSession(authOptions);
    return session?.user?.email; // Retorna el token o null si no existe
}
