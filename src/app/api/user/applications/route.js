import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"


//GET -logged in user's applications
export async function GET(req) {
    try {

        const session = await getServerSession(authOptions)

        if (!session) {
            return Response.json(
                { message: "Please login to apply" },
                { status: 401 }
            )
        }

        const applications = await prisma.application.findMany({
            where: { userId: session.user.id },
            orderBy: { appliedAt: "desc" },
            include: {
                job: {
                    select: {
                        id: true,
                        title: true,
                        company: true,
                        location: true,
                        type: true
                    }
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