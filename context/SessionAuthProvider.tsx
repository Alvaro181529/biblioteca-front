"use client";

import { SessionProvider } from "next-auth/react";

interface SessionAuthProviderProps {
    session: any; // Puedes definir un tipo más específico aquí
    children: React.ReactNode;
}

const SessionAuthProvider: React.FC<SessionAuthProviderProps> = ({ session, children }) => {
    return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default SessionAuthProvider;