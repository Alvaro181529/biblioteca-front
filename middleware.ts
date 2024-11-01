import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth((req) => {
    const token = req.nextauth.token;
    const isAdminOrRoot = token?.rols === "ADMIN" || token?.rols === "ROOT";
    const isEstudianteOrUsuario = token?.rols === "ESTUDIANTE" || token?.rols === "USUARIO";

    // Define las rutas permitidas según el rol
    if (req.nextUrl.pathname.startsWith("/dashboard") && !isAdminOrRoot) {
        return new Response("Unauthorized", { status: 403 });
    }

    if (req.nextUrl.pathname.startsWith("/profile") && !isEstudianteOrUsuario) {
        return new Response("Unauthorized", { status: 403 });
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*'],
};
