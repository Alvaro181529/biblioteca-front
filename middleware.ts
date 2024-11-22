import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth((req) => {
    const token = req.nextauth.token;
    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if (!token.exp) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenExpirationTime = Number(token.exp);
    if (tokenExpirationTime && tokenExpirationTime < currentTime) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    const isAdminOrRoot = token?.rols === "ADMIN" || token?.rols === "ROOT";
    const isEstudianteOrUsuario = token?.rols === "ESTUDIANTE" || token?.rols === "USUARIO EXTERNO" || token?.rols === "DOCENTE" || token?.rols === "ESTUDIANTIL" || token?.rols === "COLEGIAL";

    if (req.nextUrl.pathname.startsWith("/dashboard") && !isAdminOrRoot) {
        return NextResponse.redirect(new URL("/profile", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/profile") && !isEstudianteOrUsuario) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*'],
};
