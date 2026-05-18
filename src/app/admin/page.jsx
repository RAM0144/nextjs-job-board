"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import PropTypes from "prop-types"

const TYPE_LABELS = {
    FULLTIME: "Full time",
    PARTTIME: "Part time",
    INTERNSHIP: "Internship",
    REMOTE: "Remote"
}

const TYPE_COLORS = {
    FULLTIME: "bg-blue-50 text-blue-700",
    PARTTIME: "bg-purple-50 text-purple-700",
    INTERNSHIP: "bg-amber-50 text-amber-700",
    REMOTE: "bg-green-50 text-green-700"
}

const STATUS_COLORS = {
    PENDING: "bg-gray-100 text-gray-600",
    REVIEWED: "bg-blue-50 text-blue-700",
    SHORTLISTED: "bg-amber-50 text-amber-700",
    REJECTED: "bg-red-50 text-red-600",
    HIRED: "bg-green-50 text-green-700"
}

const STATUS_LABELS = {
    PENDING: "Pending",
    REVIEWED: "Reviewed",
    SHORTLISTED: "Shortlisted",
    REJECTED: "Rejected",
    HIRED: "Hired"
}


const STATUSES = ["PENDING", "REVIEWED", "SHORTLISTED", "REJECTED", "HIRED"]

// Post Job Form
function PostJobForm({ onSuccess }) {

    const initialState = {
        title: "", company: "", location: "",
        type: "FULLTIME", salary: "",
        description: "", requirements: ""
    }

    const [formData, setFormData] = useState(initialState)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        const { title, company, location, type, description, requirements } = formData

        if (!title || !company || !location || !type || !description || !requirements) {
            setError("All fields except salary are required")
            return
        }

        setLoading(true)

        try {

            const res = await fetch("/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (res.ok) {
                setFormData(initialState)
                onSuccess(data.job)
            } else {
                setError(data.message || "Something went wrong")
            }

        } catch (error) {
            console.log(error)
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }


    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="px-3 py-2 bg-red-50 border border-red-200
                                rounded-lg text-sm text-red-600">
                    {error}
                </div>
            )}
            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job title <span className="text-red-500">*</span>
                        </label>
                        <input name="title" type="text"
                            placeholder="e.g. Frontend Developer"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg
                                   text-sm focus:outline-none focus:ring-2
                                   focus:ring-blue-500 focus:border-transparent
                                   placeholder:text-gray-400" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company <span className="text-red-500">*</span>
                        </label>
                        <input name="company" type="text"
                            placeholder="e.g. StartupTN"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg
                                   text-sm focus:outline-none focus:ring-2
                                   focus:ring-blue-500 focus:border-transparent
                                   placeholder:text-gray-400" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location <span className="text-red-500">*</span>
                        </label>
                        <input name="location" type="text"
                            placeholder="e.g. Chennai"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg
                                   text-sm focus:outline-none focus:ring-2
                                   focus:ring-blue-500 focus:border-transparent
                                   placeholder:text-gray-400" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job type <span className="text-red-500">*</span>
                        </label>
                        <select name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg
                                   text-sm focus:outline-none focus:ring-2
                                   focus:ring-blue-500 focus:border-transparent
                                   bg-white">
                            <option value="FULLTIME">Full time</option>
                            <option value="PARTTIME">Part time</option>
                            <option value="INTERNSHIP">Internship</option>
                            <option value="REMOTE">Remote</option>
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Salary
                            <span className="text-xs text-gray-400 ml-1">(optional)</span>
                        </label>
                        <input name="salary" type="text"
                            placeholder="e.g. ₹5-8 LPA or ₹40,000/month"
                            value={formData.salary}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg
                                   text-sm focus:outline-none focus:ring-2
                                   focus:ring-blue-500 focus:border-transparent
                                   placeholder:text-gray-400" />
                    </div>

                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job description <span className="text-red-500">*</span>
                    </label>
                    <textarea name="description"
                        placeholder="Describe the role, responsibilities, team..."
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg
                               text-sm focus:outline-none focus:ring-2
                               focus:ring-blue-500 focus:border-transparent
                               placeholder:text-gray-400 resize-none" />
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Requirements <span className="text-red-500">*</span>
                    </label>
                    <textarea name="requirements"
                        placeholder="List skills, experience, qualifications..."
                        value={formData.requirements}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg
                               text-sm focus:outline-none focus:ring-2
                               focus:ring-blue-500 focus:border-transparent
                               placeholder:text-gray-400 resize-none" />
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={loading}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700
                               disabled:bg-blue-400 disabled:cursor-not-allowed
                               text-white text-sm font-medium rounded-lg
                               transition-colors">
                        {loading ? "Posting..." : "Post job"}
                    </button>
                </div>

            </div>
        </form>
    )
}

PostJobForm.propTypes = {
    onSuccess: PropTypes.func.isRequired
}


// Application Modal get and edit the user applications

function ApplicationsModal({ job, onClose }) {

    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState(null)

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch(`/api/jobs/${job.id}/applications`)
                const data = await res.json()
                setApplications(data.applications || [])
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchApplications()
    }, [job.id])

    // Update the application Status
    const handleStatusChange = async (applicationId, status) => {
        setUpdatingId(applicationId)
        try {
            const res = await fetch(`/api/applications/${applicationId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            })

            if (res.ok) {
                setApplications(applications.map(app =>
                    app.id === applications ? { ...app, status } : app
                ))
            }
        } catch (error) {
            console.log(error)
        } finally {
            setUpdatingId(null)
        }
    }



    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center
                        justify-center px-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh]
                            flex flex-col">
                <div className="flex items-center justify-between px-6 py-4
                                border-b border-gray-200">
                    <div>
                        <h2 className="font-medium text-gray-900">{job.title}</h2>
                        <p className="text-sm text-gray-500">{job.company}</p>
                    </div>
                    <button onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Applications list */}
                <div className="overflow-y-auto flex-1 px-6 py-4">
                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="animate-pulse border
                                                         border-gray-200 rounded-xl p-4">
                                    <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                                </div>
                            ))}
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-sm">No applications yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {applications.map((app) => (
                                <div key={app.id}
                                    className="border border-gray-200 rounded-xl p-4">

                                    {/* Applicant info */}
                                    <div className="flex items-start justify-between
                                                    gap-3 mb-3">
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">
                                                {app.user.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {app.user.email}
                                            </p>
                                        </div>
                                        <span className={`text-xs font-medium px-2.5 py-1
                                                         rounded-full flex-shrink-0
                                                         ${STATUS_COLORS[app.status]}`}>
                                            {STATUS_LABELS[app.status]}
                                        </span>
                                    </div>
                                    {/* Cover letter */}
                                    {app.coverLetter && (
                                        <p className="text-sm text-gray-600 mb-3
                                                      line-clamp-2 bg-gray-50
                                                      rounded-lg px-3 py-2">
                                            {app.coverLetter}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center justify-between
                                                    flex-wrap gap-2">
                                        <a href={app.resumeUrl} target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600
                                                       hover:underline flex items-center
                                                       gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round"
                                                    strokeLinejoin="round" strokeWidth={2}
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 
                                                       002 2h10a2 2 0 002-2v-4M14 4h6m0 
                                                       0v6m0-6L10 14" />
                                            </svg>
                                            View resume
                                        </a>

                                        <div className="flex gap-1.5 flex-wrap">
                                            {STATUSES.filter(s => s !== app.status)
                                                .map((status) => (
                                                    <button key={status}
                                                        disabled={updatingId === app.id}
                                                        onClick={() => handleStatusChange(
                                                            app.id, status
                                                        )}
                                                        className={`text-xs px-2.5 py-1
                                                                   rounded-full border
                                                                   transition-colors
                                                                   disabled:opacity-50
                                                                   disabled:cursor-not-allowed
                                                                   ${STATUS_COLORS[status]}
                                                                   border-transparent
                                                                   hover:opacity-80`}>
                                                        {updatingId === app.id
                                                            ? "..."
                                                            : STATUS_LABELS[status]}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

}

ApplicationsModal.propTypes = {
    job: PropTypes.shape({
        id: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func.isRequired
}


// Admin Dashboard

export default function AdminDashboard() {

    const { data: session, status } = useSession()
    const router = useRouter()

    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("jobs")
    const [selectedJob, setSelectedJob] = useState(null)
    const [deletingId, setDeletingId] = useState(null)
    const [toast, setToast] = useState("")


    useEffect(() => {
        if (status === "unauthenticated") router.push("/login")
        if (status === "authenticated" && session.user.role !== "ADMIN") {
            router.push("/dashboard")
        }
    }, [status, session])

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch("/api/admin/jobs")
                const data = await res.json()
                setJobs(data.jobs || [])
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        if (session?.user?.role === "ADMIN") fetchJobs()
    }, [session])

    const showToast = (message) => {
        setToast(message)
        setTimeout(() => setToast(""), 3000)
    }

    const handleJobPosted = (newJob) => {
        setJobs([newJob, ...jobs])
        setActiveTab("jobs")
        showToast("Job posted successfully!")
    }

    const handleDelete = async (jobId) => {
        if (!confirm("Delete this job? This will also delete all applications.")) return
        setDeletingId(jobId)

        try {
            const res = await fetch(`/api/jobs/${jobId}`, {
                method: "DELETE"
            })
            if (res.ok) {
                setJobs(jobs.filter(j => j.id !== jobId))
                showToast("Job deleted")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setDeletingId(null)
        }
    }

    const totalApplications = jobs.reduce(
        (sum, job) => sum + (job._count?.applications || 0), 0
    )

    if (status === "loading") return null

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 px-4 py-2.5 bg-gray-900
                                text-white text-sm rounded-lg shadow-lg">
                    {toast}
                </div>
            )}

            {/* Application model */}
            {selectedJob && (
                <ApplicationsModal
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                />
            )}

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center
                                justify-between">
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-xl text-gray-900">JobBoard</span>
                        {/* <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5
                                         rounded-full font-medium">
                            Admin
                        </span> */}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5
                                         rounded-full font-medium">
                            {session?.user?.name}
                        </span>
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

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Total jobs</p>
                        <p className="text-2xl font-medium text-gray-900">
                            {jobs.length}
                        </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Active jobs</p>
                        <p className="text-2xl font-medium text-gray-900">
                            {jobs.filter(j => j.isActive).length}
                        </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4
                                    col-span-2 sm:col-span-1">
                        <p className="text-xs text-gray-500 mb-1">Total applications</p>
                        <p className="text-2xl font-medium text-gray-900">
                            {totalApplications}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-5">
                    <button onClick={() => setActiveTab("jobs")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium
                                    transition-colors
                                    ${activeTab === "jobs"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                            }`}>
                        My jobs
                    </button>
                    <button onClick={() => setActiveTab("post")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium
                                    transition-colors
                                    ${activeTab === "post"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                            }`}>
                        + Post new job
                    </button>
                </div>

                {/* Tab content */}
                {activeTab === "post" ? (

                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h2 className="font-medium text-gray-900 mb-5">Post a new job</h2>
                        <PostJobForm onSuccess={handleJobPosted} />
                    </div>

                ) : (

                    <div>
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="animate-pulse bg-white
                                                             border border-gray-200
                                                             rounded-2xl p-5">
                                        <div className="h-4 bg-gray-200 rounded w-48 mb-2">
                                        </div>
                                        <div className="h-3 bg-gray-200 rounded w-32">
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-16 bg-white border
                                            border-gray-200 rounded-2xl">
                                <p className="text-gray-500 text-sm mb-3">
                                    No jobs posted yet
                                </p>
                                <button onClick={() => setActiveTab("post")}
                                    className="text-sm text-blue-600 font-medium
                                               hover:underline">
                                    Post your first job →
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {jobs.map((job) => (
                                    <div key={job.id}
                                        className="bg-white border border-gray-200
                                                   rounded-2xl p-5">

                                        <div className="flex items-start justify-between
                                                        gap-3 mb-3">
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    {job.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    {job.company} · {job.location}
                                                </p>
                                            </div>
                                            <span className={`text-xs font-medium px-2.5
                                                             py-1 rounded-full flex-shrink-0
                                                             ${TYPE_COLORS[job.type]}`}>
                                                {TYPE_LABELS[job.type]}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between
                                                        flex-wrap gap-2">
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-gray-500">
                                                    {job._count?.applications || 0} applicant
                                                    {job._count?.applications !== 1 ? "s" : ""}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(job.createdAt)
                                                        .toLocaleDateString("en-IN", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric"
                                                        })}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedJob(job)}
                                                    className="text-sm text-blue-600
                                                               hover:underline font-medium">
                                                    View applications
                                                </button>
                                                <span className="text-gray-300">·</span>
                                                <Link href={`/jobs/${job.id}`}
                                                    className="text-sm text-gray-500
                                                               hover:text-gray-700">
                                                    View
                                                </Link>
                                                <span className="text-gray-300">·</span>
                                                <button
                                                    onClick={() => handleDelete(job.id)}
                                                    disabled={deletingId === job.id}
                                                    className="text-sm text-red-500
                                                               hover:text-red-700
                                                               disabled:opacity-50">
                                                    {deletingId === job.id
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                )}


            </div>
        </div>
    )
}