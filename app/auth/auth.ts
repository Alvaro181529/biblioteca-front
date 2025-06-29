import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/auth"
export default async function AuthRols() {
    const session = await getServerSession(authOptions)
    return session?.user?.rols || null
}