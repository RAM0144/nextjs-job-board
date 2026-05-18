import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma";


export const authOptions = {

    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                // console.log("credentials:", credentials);
                // console.log("DB Password", user.password);

                if (!user) throw new Error("user not found")

                if (!user.emailVerified) {
                    throw new Error("Please verify email first")
                }

                const isMatch = await bcrypt.compare(
                    credentials.password, user.password
                )

                if (!isMatch) throw new Error("Invalid password")

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        })
    ],

    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login"
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },

        async session({ session, token }) {
            session.user.id = token.id
            session.user.role = token.role
            return session
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }