import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

//Admin only 
export async function GET(req, { params }) {

    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const applications = await prisma.application.findMany({
            where: { jobId: id },
            orderBy: { appliedAt: "desc" },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        })

        return Response.json({ applications })
    } catch (error) {
        console.log(error)
        return Response.json(
            { message: "Something went wrong" },
            { status: 500 }
        )
    }
}