import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth";

export async function getTokenFromSession() {
    const session = await getServerSession(authOptions);
    return session?.user?.accessToken || null; // Retorna el token o null si no existe
}
