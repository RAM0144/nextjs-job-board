import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// GET — all jobs posted by this admin
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "ADMIN") {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const jobs = await prisma.job.findMany({
            where: { adminId: session.user.id },
            orderBy: { createdAt: "desc" },
            include: {
                _count: { select: { applications: true } }
            }
        })

        return Response.json({ jobs })

    } catch (error) {
        console.log(error)
        return Response.json(
            { message: "Something went wrong" },
            { status: 500 }
        )
    }
}