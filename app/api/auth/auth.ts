import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import jwt from "jsonwebtoken";
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            rols: string;
            accessToken: string;
        };
    }
}

interface UserData {
    name?: string;
    email: string;
    password: string;
}

interface SigninResponse {
    user: {
        id: string;
        name: string;
        email: string;
        rols: string;
    };
    accessToken: string;
    refreshToken: string;
}

async function Signin(
    userData: UserData,
): Promise<SigninResponse | null> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL_API}users/signin`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            },
        );

        if (!response.ok) {
            return null;
        }

        const responseData: SigninResponse = await response.json();
        return responseData;
    } catch (error) {
        console.error("Signin error:", error);
        return null;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email" },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Password",
                },
            },
            async authorize(credentials, req) {
                if (!credentials) {
                    throw new Error("No credentials provided");
                }
                const userData: UserData = {
                    email: credentials.email,
                    password: credentials.password,
                };
                const signin = await Signin(userData);
                if (!signin) throw new Error("Usuario no encontrado");
                return {
                    id: signin.user.id,
                    name: signin.user.name,
                    email: signin.user.email,
                    rols: signin.user.rols,
                    accessToken: signin.accessToken,
                    refreshToken: signin.refreshToken,
                };
            },
        }),
    ],
    session: {
        maxAge: 60 * 60,
        updateAge: 60 * 60,
    },
    jwt: {
        maxAge: 60 * 60,
    },
    callbacks: {
        async jwt({ token, user }: { token: any; user?: any }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken
                token.rols = user.rols;

            }
            const tokenExpired = isTokenExpired(String(token.accessToken))
            if (tokenExpired && token.refreshToken) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}users/refresh-token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ refreshToken: token.refreshToken }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        token.accessToken = data.accessToken;
                    }
                } catch (error) {
                    console.error('Error renovando el token:', error);
                }
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            if (session.user) {
                session.user.accessToken = token.accessToken;
                session.user.rols = token.rols;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
        signOut: "/",
        error: "/auth/error"
    },
};
function isTokenExpired(token: string): boolean {
    try {
        const decoded: any = jwt.decode(token);

        if (!decoded || !decoded.exp) {
            return false;
        }
        const currentTime = Math.floor(Date.now() / 1000);
        return currentTime >= decoded.exp;
    } catch (error) {
        console.error('Error decodificando el token:', error);
        return true;
    }
}
// function isTokenExpired(token: string): boolean {
//     try {
//         const parts = token.split('.');
//         if (parts.length !== 3) {
//             throw new Error('Token no válido');
//         }
//         const payloadBase64 = parts[1];
//         const payloadJson = atob(payloadBase64);  // atob() decodifica Base64 a texto
//         const payload = JSON.parse(payloadJson);
//         if (!payload.exp) {
//             return false; // Si no existe "exp", no podemos determinar la expiración
//         }
//         const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
//         return currentTime >= payload.exp; // Si el tiempo actual es mayor o igual a "exp", el token ha expirado
//     } catch (error) {
//         console.error('Error decodificando el token:', error);
//         return true; // Si hay un error, asumimos que el token ha expirado o es inválido
//     }
// }