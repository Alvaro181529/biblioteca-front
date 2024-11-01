import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiRequest, NextApiResponse } from "next";

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
}

export async function Signin(
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

export const authOptions = {
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
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.rols = user.rols;
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
  },
};

const handler = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, authOptions);

export { handler as GET, handler as POST };
