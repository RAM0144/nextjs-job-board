import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"


export async function GET(req, { params }) {

    try {

        const { id } = await params

        const job = await prisma.job.findUnique({
            where: { id },
            include: {
                admin: { select: { name: true, email: true } },
                _count: { select: { applications: true } }
            }
        })

        if (!job) {
            return Response.json(
                { message: "Job not found" },
                { status: 404 }
            )
        }
        return Response.json({ job })

    } catch (error) {
        console.log(error)
        return Response.json(
            { message: "Something went wrong" },
            { status: 500 }
        )
    }
}


// PUT — update(edit) job (admin only)
export async function PUT(req, { params }) {

    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const body = await req.json()

        const job = await prisma.job.update({
            where: { id: params.id },
            data: {
                ...body,
                updatedAt: new Date()
            }
        })

        return Response.json({ message: "Job updated", job })

    } catch (error) {
        console.log(error)
        return Response.json(
            { message: "Something went wrong" },
            { status: 500 }
        )
    }
}

// DELETE — delete job (admin only)
export async function DELETE(req, { params }) {

    try {
        const { id } = await params
        console.log(id)
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return Response.json(
                { message: "Unathorized" },
                { status: 401 }
            )
        }

        await prisma.job.delete({
            where: { id }
        })

        return Response.json({ message: "Job deleted" })

    } catch (error) {
        console.log(error)
        return Response.json(
            { message: "Something went wrong" },
            { status: 500 }
        )
    }
}