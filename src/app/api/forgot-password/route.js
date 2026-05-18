import { prisma } from "@/lib/prisma";
import crypto from "crypto"
import { SendResetEmail } from "@/lib/mail";

export async function POST(req) {
    try {

        const { email } = await req.json()

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return Response.json(
                { message: "If this email exists, a reset link has been sent" },
                { status: 404 }
            )
        }

        const token = crypto.randomBytes(32).toString("hex")

        await prisma.user.update({
            where: { email },
            data: {
                resetToken: token,
                resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 60)
            }
        })

        await SendResetEmail(email, token)

        return Response.json({ message: "Reset email sent" })

    } catch (error) {
        console.log(error)
        return Response.json(
            { message: "Something went wrong" },
            { status: 500 }
        )
    }
}