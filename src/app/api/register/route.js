import { sendVerificationEmail } from "@/lib/mail"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import crypto from "crypto"

export async function POST(req) {
    try {
        const body = await req.json()

        const existingUser = await prisma.user.findUnique({
            where: { email: body.email }
        })

        if (existingUser) {
            return Response.json({ message: "user already exists" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(body.password, 10)

        const token = crypto.randomBytes(32).toString("hex")

        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: hashedPassword,
                emailVerified: true,   // ✅ auto verify — skip email for now
                verifyToken: token,
                verifyTokenExpiry: new Date(Date.now() + 1000 * 60 * 60)
            }
        })

        // await sendVerificationEmail(body.email, token)

        return Response.json({ message: "User Created Successfully", user })

    } catch (error) {
        return Response.json({ message: "Something went wrong", error }, { status: 500 })
    }
}