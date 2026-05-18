import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// Admin only create a new job
export async function POST(req) {
    
    try {
        const session = await getServerSession(authOptions)

        if(!session || session.user.role !== "ADMIN"){
            return Response.json(
                {message: "Unauthorized"},
                {status: 401}
            )
        }

        const body = await req.json()

        const { title, company, location, type, salary, description, requirements } = body

        if(!title || !company || !location || !type || !salary || !description || !requirements){
            return Response.json(
                {message: "All fields are required"},
                {status: 400}
            )
        }

        const job = await prisma.job.create({
            data: {
                title,
                company,
                location,
                type,
                salary,
                description,
                requirements,
                adminId: session.user.id
            }
        })

        return Response.json(
            {message: "Job created successfully", job},
            {status: 201}
        )

    } catch (error) {
        console.log(error)
        return Response.json(
            {message: "Somthing went wrong"},
            {status: 500}
        )
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        
        const location = searchParams.get("location") || ""
        const search = searchParams.get("search") || ""
        const type = searchParams.get("type") 

        // const where = {
        //     isActive: true,
        //     ...(type && {type}),
        //     ...(location && {location: {conatines: location}
        //     }),
        //     ...(search && {
        //         OR: [
        //             { title: { contains: search } },
        //             { company: { contains: search } }
        //         ]
        //     })
        // }

        // const jobs = await prisma.job.findMany({
        //     where,
        //     orderBy: { createdAt: "desc" },
        //     include: {
        //         _count: { select: { applications: true } }
        //     }
        // })

        const jobs = await prisma.job.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            {
                                title: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            },
                            {
                                company: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            }
                        ]
                    },
                     {
                        location: {
                        contains: location,
                        mode: "insensitive"
                        }
                    },
                    ...(type ? [{ type }]: [])   
                ]
            },
            
             include: {
                _count: {
                    select: {
                        applications: true
                    }
                }
             },
          
             orderBy: {
                createdAt: "desc"
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