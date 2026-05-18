"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"


const TYPE_LABELS = {
    FULLTIME:   "Full time",
    PARTTIME:   "Part time",
    INTERNSHIP: "Internship",
    REMOTE:     "Remote"
}

const TYPE_COLORS = {
    FULLTIME:   "bg-blue-50 text-blue-700",
    PARTTIME:   "bg-purple-50 text-purple-700",
    INTERNSHIP: "bg-amber-50 text-amber-700",
    REMOTE:     "bg-green-50 text-green-700"
}

//apply form for users like resume
function ApplyForm({ jobId, onSuccess }) {

    const [formData, setFormData] = useState({
         coverLetter: "",
        resumeUrl: ""
    }) 

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        setFormData({...formData, 
            [e.target.name]: e.target.value
        })
        setError("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!formData.resumeUrl) {
            setError("Resume link is required")
            return
        }
        setLoading(true)

        try {
            const res = await fetch("/api/applications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    jobId,
                    coverLetter: formData.coverLetter,
                    resumeUrl: formData.resumeUrl
                })
            })
            const data = await res.json()
            if(res.ok){
               onSuccess()
            }else{
                setError(data.message || "Something went wrong")
            }
        } catch (error) {
            console.log(error)
            setError("Something went wrong. Please try again.")
        }finally{
            setLoading(false)
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="px-3 py-2 bg-red-50 border border-red-200
                                rounded-lg text-sm text-red-600">
                    {error}
                </div>
            )}

            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume link
                    <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input 
                   name="resumeUrl"
                    type="url"
                    placeholder="https://drive.google.com/your-resume"
                    value={formData.resumeUrl}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg
                               text-sm focus:outline-none focus:ring-2
                               focus:ring-blue-500 focus:border-transparent
                               placeholder:text-gray-400"
                />
                 <p className="text-xs text-gray-400 mt-1">
                    Paste a Google Drive or Dropbox link to your resume PDF
                </p>
            </div>

            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover letter
                    <span className="text-xs text-gray-400 ml-1">(optional)</span>
                </label>
                <textarea 
                  name="coverLetter"
                    placeholder="Tell the employer why you're a good fit..."
                    value={formData.coverLetter}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg
                               text-sm focus:outline-none focus:ring-2
                               focus:ring-blue-500 focus:border-transparent
                               placeholder:text-gray-400 resize-none"
                />
                <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700
                           disabled:bg-blue-400 disabled:cursor-not-allowed
                           text-white text-sm font-medium rounded-lg
                           transition-colors">
                {loading ? "Submitting..." : "Submit application"}
              </button>

            </div>
        </form>
    )
}

export default function JobDetailsPage() {

    const { id } = useParams()
    const router = useRouter()
    const { data: session } = useSession()

    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [applied, setApplied] = useState(false)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch(`/api/jobs/${id}`)
                const data = await res.json()
                      
                if(!res){
                   router.push("/jobs") 
                }
                setJob(data.job)
            } catch (error) {
                router.push("/jobs")
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
       fetchJob()
    },[id])

      const handleApplyClick = () => {
        if (!session) {
            router.push("/login")
            return
        }
        setShowForm(true)
    }

     if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-5xl mx-auto px-4 h-14 flex items-center">
                        <Link href="/jobs"
                            className="font-medium text-gray-900">
                            JobBoard
                        </Link>
                    </div>
                </nav>
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <div className="h-6 bg-gray-200 rounded w-64 mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-40 mb-6"></div>
                            <div className="flex gap-3 mb-6">
                                <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                                <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

      if (!job) return null

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center
                                justify-between">
                    <Link href="/jobs"
                        className="font-medium text-gray-900">
                        JobBoard
                    </Link>
                    {session ? (
                        <Link href="/dashboard"
                            className="text-sm text-gray-600 hover:text-gray-900">
                            My applications
                        </Link>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login"
                                className="text-sm text-gray-600 hover:text-gray-900">
                                Sign in
                            </Link>
                            <Link href="/register"
                                className="text-sm bg-blue-600 hover:bg-blue-700
                                           text-white px-4 py-1.5 rounded-lg
                                           transition-colors">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-6">

                {/* Back link */}
                <Link href="/jobs"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500
                               hover:text-gray-700 mb-5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to jobs
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Left — job details */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Job header card */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">

                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div>
                                    <h1 className="text-xl font-medium text-gray-900 mb-1">
                                        {job.title}
                                    </h1>
                                    <p className="text-gray-500">{job.company}</p>
                                </div>
                                <span className={`text-xs font-medium px-2.5 py-1
                                                 rounded-full flex-shrink-0
                                                 ${TYPE_COLORS[job.type]}`}>
                                    {TYPE_LABELS[job.type]}
                                </span>
                            </div>

                            {/* Meta info */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 
                                               01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {job.location}
                                </div>

                                {job.salary && (
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round"
                                                strokeLinejoin="round" strokeWidth={2}
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 
                                                   2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 
                                                   2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0
                                                   -1c-1.11 0-2.08-.402-2.599-1M21 12a9 
                                                   9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {job.salary}
                                    </div>
                                )}

                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 
                                               20H7m10 0v-2c0-.656-.126-1.283-.356
                                               -1.857M7 20H2v-2a3 3 0 015.356-1.857M7 
                                               20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 
                                               5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 
                                               0 016 0z" />
                                    </svg>
                                    {job._count.applications} applicant
                                    {job._count.applications !== 1 ? "s" : ""}
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 
                                               002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12
                                               a2 2 0 002 2z" />
                                    </svg>
                                    Posted {new Date(job.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </div>
                            </div>

                        </div>

                        {/* Description */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <h2 className="text-base font-medium text-gray-900 mb-3">
                                Job description
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                {job.description}
                            </p>
                        </div>

                        {/* Requirements */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <h2 className="text-base font-medium text-gray-900 mb-3">
                                Requirements
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                {job.requirements}
                            </p>
                        </div>

                    </div>

                    {/* Right — apply card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6
                                        sticky top-20">

                            {applied ? (
                                // Applied success state
                                <div className="text-center py-4">
                                    <div className="w-11 h-11 rounded-xl bg-green-50
                                                    flex items-center justify-center
                                                    mx-auto mb-3">
                                        <svg className="w-6 h-6 text-green-600"
                                            fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path strokeLinecap="round"
                                                strokeLinejoin="round" strokeWidth={2}
                                                d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-1">
                                        Application sent!
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        We'll notify you by email when the status changes.
                                    </p>
                                    <Link href="/dashboard"
                                        className="text-sm text-blue-600 font-medium
                                                   hover:underline">
                                        View my applications →
                                    </Link>
                                </div>

                            ) : showForm ? (
                                // Apply form
                                <>
                                    <h3 className="font-medium text-gray-900 mb-4">
                                        Apply for this job
                                    </h3>
                                    <ApplyForm
                                        jobId={job.id}
                                        onSuccess={() => {
                                            setApplied(true)
                                            setShowForm(false)
                                        }}
                                    />
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="w-full mt-3 py-2 text-sm text-gray-500
                                                   hover:text-gray-700 transition-colors">
                                        Cancel
                                    </button>
                                </>

                            ) : (
                                // Default apply button
                                <>
                                    <h3 className="font-medium text-gray-900 mb-1">
                                        Interested in this role?
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Apply now and hear back within a few days.
                                    </p>

                                    {session?.user?.role === "ADMIN" ? (
                                        <div className="px-3 py-2 bg-amber-50
                                                        border border-amber-200
                                                        rounded-lg text-sm text-amber-700">
                                            Admins cannot apply for jobs
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleApplyClick}
                                            className="w-full py-2.5 bg-blue-600
                                                       hover:bg-blue-700 text-white
                                                       text-sm font-medium rounded-lg
                                                       transition-colors">
                                            Apply now
                                        </button>
                                    )}

                                    {!session && (
                                        <p className="text-xs text-gray-400 text-center mt-3">
                                            You need to{" "}
                                            <Link href="/login"
                                                className="text-blue-600 hover:underline">
                                                sign in
                                            </Link>{" "}
                                            to apply
                                        </p>
                                    )}
                                </>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}