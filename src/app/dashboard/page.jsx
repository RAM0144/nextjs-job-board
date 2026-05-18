"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


const STATUS_COLORS = {
    PENDING:     "bg-gray-100 text-gray-600",
    REVIEWED:    "bg-blue-50 text-blue-700",
    SHORTLISTED: "bg-amber-50 text-amber-700",
    REJECTED:    "bg-red-50 text-red-600",
    HIRED:       "bg-green-50 text-green-700"
}

const STATUS_LABELS = {
    PENDING:     "Pending",
    REVIEWED:    "Reviewed",
    SHORTLISTED: "Shortlisted",
    REJECTED:    "Rejected",
    HIRED:       "Hired"
}

const STATUS_DESCRIPTIONS = {
    PENDING:     "Your application is waiting to be reviewed",
    REVIEWED:    "The employer has seen your application",
    SHORTLISTED: "You've been shortlisted for this role",
    REJECTED:    "This application was not selected",
    HIRED:       "Congratulations! You got the job"
}

// User Dashboard
export default function UserDashboard() {
    
    const { data: session, status } = useSession()
    const router = useRouter()

    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(status === "unauthenticated") router.push("/login")
        if(status === "authenticated" && session.user.role === "ADMIN"){
            router.push("/admin")
        }
    }, [status, session])

    useEffect(() => {
        const fetchApplications = async() => {
            try {
                const res = await fetch("/api/user/applications")
                const data = await res.json()
                setApplications(data.applications || [])
            } catch (error) {
                console.log(error)
            }finally {
                setLoading(false)
            }
        }
        if(session?.user?.role === "USER") fetchApplications()
    }, [session])

    const stats = {
        total:       applications.length,
        pending:     applications.filter(a => a.status === "PENDING").length,
        shortlisted: applications.filter(a => a.status === "SHORTLISTED").length,
        hired:       applications.filter(a => a.status === "HIRED").length
    }

    const handleWithdraw = async (id) => {
        const confirmDelete = confirm("Are you sure you want to withdraw?")

        if(!confirmDelete) return

        try {
            const res = await fetch(`/api/applications/${id}`, {
                method: "DELETE"
            })
            const data = await res.json()

            if(!res.ok){
                alert(data.message)
                return
            }
            alert(data.message)

            // remove from UI instantly
            setApplications((prev) => 
                prev.filter((app) => app.id !== id)
            )
        } catch (error) {
           console.log(error) 
        }
    }

    return(
      <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center
                                justify-between">
                    <Link href="/"
                        className="font-medium text-xl text-gray-900">
                        JobBoard
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5
                                         rounded-full font-medium">
                            {session?.user?.name}
                        </span>
                        <Link href="/jobs"
                            className="text-sm text-gray-600 hover:text-gray-900">
                            Browse jobs
                        </Link>
                        <button onClick={() => signOut({ callbackUrl: "/login" })}
                            className="text-sm text-gray-600 hover:text-red-700
                                   border border-gray-200 
                                    px-3 py-1.5 rounded-lg transition-colors duration-200">
                            Sign out
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-6">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-xl font-medium text-gray-900">
                        My applications
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Track all your job applications
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Total applied",  value: stats.total },
                        { label: "Pending",        value: stats.pending },
                        { label: "Shortlisted",    value: stats.shortlisted },
                        { label: "Hired",          value: stats.hired }
                    ].map(({ label, value }) => (
                        <div key={label}
                            className="bg-white border border-gray-200 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-1">{label}</p>
                            <p className="text-2xl font-medium text-gray-900">{value}</p>
                        </div>
                    ))}
                </div>

                {/* Applications list */}
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i}
                                className="animate-pulse bg-white border border-gray-200
                                           rounded-2xl p-5">
                                <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-32 mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                            </div>
                        ))}
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-gray-200
                                    rounded-2xl">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center
                                        justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-gray-400" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22
                                       -.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2
                                       2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5
                                       a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm mb-3">
                            No applications yet
                        </p>
                        <Link href="/jobs"
                            className="text-sm text-blue-600 font-medium hover:underline">
                            Browse jobs →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {applications.map((app) => (
                            <div key={app.id}
                                className="bg-white border border-gray-200 rounded-2xl p-5">

                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div>
                                        <Link href={`/jobs/${app.job.id}`}
                                            className="font-medium text-gray-900
                                                       hover:text-blue-600 transition-colors">
                                            {app.job.title}
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {app.job.company} · {app.job.location}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1
                                                     rounded-full flex-shrink-0
                                                     ${STATUS_COLORS[app.status]}`}>
                                        {STATUS_LABELS[app.status]}
                                    </span>
                                </div>

                                <p className="text-xs text-gray-500 mb-3">
                                    {STATUS_DESCRIPTIONS[app.status]}
                                </p>

                                <div className="flex items-center justify-between
                                                flex-wrap gap-2 pt-3 border-t
                                                border-gray-100">
                                    <span className="text-xs text-gray-400">
                                        Applied {new Date(app.appliedAt)
                                            .toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                    </span>
                                    <a href={app.resumeUrl} target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:underline
                                                   flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round"
                                                strokeLinejoin="round" strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002
                                                   2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0
                                                   -6L10 14" />
                                        </svg>
                                        View my resume
                                    </a>
                                    {app.status === "PENDING" &&(
                                        <button
                                        onClick={()=> handleWithdraw(app.id)}
                                        className="text-xs text-red-600 hover:underline"
                                        >
                                            Withdraw
                                        </button>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}