import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ROLE_ACCESS = {
    dashboard: ["ADMIN", "ROOT"],
    profile: ["ESTUDIANTE", "USUARIO EXTERNO", "DOCENTE", "ESTUDIANTIL", "COLEGIAL"]
};

export default withAuth((req) => {
    const token = req.nextauth.token;
    if (!token || !token.exp) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const tokenExpirationTime = Number(token.exp);
    if (tokenExpirationTime < currentTime) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const path = req.nextUrl.pathname;
    const isAdminOrRoot = ROLE_ACCESS.dashboard.includes(token.rols as string);
    const isEstudianteOrUsuario = ROLE_ACCESS.profile.includes(token.rols as string);

    if (path.startsWith("/dashboard") && !isAdminOrRoot) {
        return NextResponse.redirect(new URL("/profile", req.url));
    }

    if (path.startsWith("/profile") && !isEstudianteOrUsuario) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*'],
};
