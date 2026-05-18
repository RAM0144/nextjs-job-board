import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
// import { sendStatusUpdate } from "@/lib/mail"

// Update the applications status(ADMIN)
export async function PUT(req, { params }) {
    try {

        const { id } = await params

        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== "ADMIN") {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const { status } = await req.json()

        const validStatuses = ["PENDING", "REVIEWED", "SHORTLISTED", "REJECTED", "HIRED"]

        if (!validStatuses.includes(status)) {
            return Response.json(
                { message: "Invalid status" },
                { status: 400 }
            )
        }

        const application = await prisma.application.update({
            where: { id },
            data: { status },
            include: {
                user: true,
                job: true
            }
        })

        // Send status update email to user
        // await sendStatusUpdate(
        //     application.user.email,
        //     application.user.name,
        //     application.job.title,
        //     application.job.company,
        //     status
        // )
        return Response.json({ message: "Status updated", application })

    } catch (error) {
        console.log(error)
        return Response.json(
            { message: "Something went wrong" },
            { status: 500 }
        )
    }
}

//  User withdraws own application
export async function DELETE(req, { params }) {

    try {
        const { id } = await params
        const session = await getServerSession(authOptions)

        if (!session) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const application = await prisma.application.findUnique({
            where: { id }
        })

        if (!application) {
            return Response.json(
                { message: "Application not found" },
                { status: 404 }
            )
        }

        // user can delete only own application
        if (application.userId !== session.user.id) {
            return Response.json(
                { message: "Forbidden" },
                { status: 403 }
            )
        }

        await prisma.application.delete({
            where: { id }
        })

        return Response.json(
            { message: "Application withdrawn successfully" }
        )

    } catch (error) {
        console.log(error)
        return Response.json(
            { message: "Something went wrong" },
            { status: 500 }
        )
    }


}