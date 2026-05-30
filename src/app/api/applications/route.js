import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { sendApplicationConfirmation } from "@/lib/mail"

// POST Apply the job(resume, cover letter) USER
export async function POST(req) {

    try {

        const session = await getServerSession(authOptions)

        if (!session) {
            return Response.json(
                { message: "Please login to apply" },
                { status: 401 }
            )
        }

        if (session.user.role === "ADMIN") {
            return Response.json(
                { message: "Admin cannot apply for jobs" },
                { status: 403 }
            )
        }

        const body = await req.json()

        const { jobId, resumeUrl, coverLetter } = body

        if (!jobId || !resumeUrl) {
            return Response.json(
                { message: "Job and resume are required" },
                { status: 400 }
            )
        }

        const existing = await prisma.application.findUnique({
            where: {
                jobId_userId: {
                    jobId,
                    userId: session.user.id
                }
            }
        })

        if (existing) {
            return Response.json(
                { message: "You already applied for this job" },
                { status: 400 }
            )
        }

        // get job for email
        const job = await prisma.job.findUnique({
            where: { id: jobId }
        })

        if (!job) {
            return Response.json(
                { message: "Job not found" },
                { status: 404 }
            )
        }

        const application = await prisma.application.create({
            data: {
                jobId,
                userId: session.user.id,
                coverLetter,
                resumeUrl
            }
        })

        try {
            await sendApplicationConfirmation(
                session.user.email,
                session.user.name,
                job.title,
                job.company
            )
        } catch (emailError) {
            console.log("Email failed but application saved:", emailError) 
        }

        return Response.json(
            { message: "Application submitted successfully", application },
            { status: 201 }
        )

    } catch (error) {
        console.log(error)
        return Response.json(
            { message: "Something went wrong" },
            { status: 500 }
        )
    }
}

