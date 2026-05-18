"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import PropTypes from "prop-types"

const JOB_TYPES = ["ALL", "FULLTIME", "PARTTIME", "INTERNSHIP", "REMOTE"]

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

//job card link 
function JobCard({ job }) {
    return (
        <Link href={`/jobs/${job.id}`}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6
                            hover:border-blue-300 hover:shadow-sm
                            transition-all cursor-pointer group">

                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600
                                       transition-colors text-base">
                            {job.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">{job.company}</p>
                    </div>

                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                                     flex-shrink-0 ${TYPE_COLORS[job.type]}`}>
                        {TYPE_LABELS[job.type]}
                    </span>
                </div>

                {/* Location + salary */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
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
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 
                                       3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08 
                                       .402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 
                                       0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 
                                       9 9 0 0118 0z" />
                            </svg>
                            {job.salary}
                        </div>
                    )}
                </div>

                {/* Description preview */}
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {job.description}
                </p>

                {/* Bottom row */}
                <div className="flex items-center justify-between pt-3
                                border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                        {job._count.applications} applicant
                        {job._count.applications !== 1 ? "s" : ""}
                    </span>
                    <span className="text-xs text-gray-400">
                        {new Date(job.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        })}
                    </span>
                </div>

            </div>
        </Link>
    )
}

JobCard.propTypes = {
    job: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        company: PropTypes.string.isRequired,
        location: PropTypes.string,
        type: PropTypes.string,
        salary: PropTypes.string,
        description: PropTypes.string,
        createdAt: PropTypes.string,
        _count: PropTypes.shape({
            applications: PropTypes.number
        })
    }).isRequired
}

function JobCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
            <div className="flex gap-4 mb-4">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="flex justify-between pt-3 border-t border-gray-100">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
        </div>
    )
}

//Listing all jobs
export default function JobsPage() {

    const { data: session } = useSession()

    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [location, setLocation] = useState("")
    const [activeType, setActiveType] = useState("ALL")
    const [searchInput, setSearchInput] = useState("")
    const [locationInput, setLocationInput] = useState("")

    const fetchJobs = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (search) params.set("search", search)
            if (location) params.set("location", location)
            if (activeType !== "ALL") params.set("type", activeType)

            const res = await fetch(`/api/jobs?${params.toString()}`)
            const data = await res.json()
            setJobs(data.jobs || [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [search, location, activeType])

    const handleSearch = (e) => {
        e.preventDefault()
        setSearch(searchInput)
        setLocation(locationInput)
    }

    const handleClear = () => {
        setSearchInput("")
        setLocationInput("")
        setSearch("")
        setLocation("")
        setActiveType("ALL")
    }

    const hasFilters = search || location || activeType !== "ALL"


    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center
                                justify-between">
                    <Link href="/"
                        className="font-medium text-xl text-gray-900 text">
                        JobBoard
                    </Link>
                    {session ? (
                        <div className="flex items-center gap-3">
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5
                                         rounded-full font-medium">
                                {session.user.name}
                            </span>

                            <Link href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Dashboard
                            </Link>

                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="text-sm text-gray-600 hover:text-red-700
                                   border border-gray-200 
                                    px-3 py-1.5 rounded-lg transition-colors duration-200"
                            >
                                Sign out
                            </button>

                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login"
                                className="text-sm text-gray-600 hover:text-gray-900">
                                Sign in
                            </Link>
                            <Link href="/register"
                                className="text-sm bg-blue-600 hover:bg-blue-700
                                       text-white px-4 py-1.5 rounded-lg transition-colors">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero + Search */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 py-10">

                    <h1 className="text-2xl font-medium text-gray-900 mb-1">
                        Find your next job
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">
                        Browse {jobs.length} open positions
                    </p>

                    {/* Search bar */}
                    <form onSubmit={handleSearch}
                        className="flex gap-2 flex-wrap sm:flex-nowrap">

                        <div className="relative flex-1 min-w-0">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2
                                            w-4 h-4 text-gray-400"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Job title or company"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 border border-gray-200
                                           rounded-lg text-sm focus:outline-none
                                           focus:ring-2 focus:ring-blue-500
                                           focus:border-transparent placeholder:text-gray-400"
                            />
                        </div>

                        <div className="relative flex-1 min-w-0">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2
                                            w-4 h-4 text-gray-400"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 
                                       01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Location"
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 border border-gray-200
                                           rounded-lg text-sm focus:outline-none
                                           focus:ring-2 focus:ring-blue-500
                                           focus:border-transparent placeholder:text-gray-400"
                            />
                        </div>

                        <button type="submit"
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700
                                       text-white text-sm font-medium rounded-lg
                                       transition-colors flex-shrink-0">
                            Search
                        </button>

                    </form>

                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6">

                {/* Filter tabs */}
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">

                    <div className="flex gap-2 flex-wrap">
                        {JOB_TYPES.map((type) => (
                            <button
                                key={type}
                                onClick={() => setActiveType(type)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium
                                            border transition-colors
                                            ${activeType === type
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                    }`}>
                                {type === "ALL" ? "All types" : TYPE_LABELS[type]}
                            </button>
                        ))}
                    </div>

                    {hasFilters && (
                        <button onClick={handleClear}
                            className="text-sm text-gray-500 hover:text-gray-700
                                       flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear filters
                        </button>
                    )}

                </div>

                {/* Results */}
                {loading ? (
                    <div className="grid gap-4">
                        {[...Array(5)].map((_, i) => (
                            <JobCardSkeleton key={i} />
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center
                                        justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-gray-400" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-medium text-gray-900 mb-1">
                            No jobs found
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Try changing your search or filters
                        </p>
                        <button onClick={handleClear}
                            className="text-sm text-blue-600 font-medium hover:underline">
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}