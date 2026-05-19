"use client"

import Link from "next/link"
import { useState } from "react"


export default function ForgotPassword() {

    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            await fetch("/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            })

            // Always show success — don't reveal if email exists
            setSent(true)

        } catch (error) {
            setError("Something went wrong. Please try again.", error)
        } finally {
            setLoading(false)
        }
    }

    // Success state
    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-sm bg-white border border-gray-200 
                                rounded-2xl p-8 shadow-sm text-center">

                    <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center 
                                    justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-green-600" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-lg font-medium text-gray-900 mb-2">Check your inbox</h1>
                    <p className="text-sm text-gray-500 mb-6">
                        If <span className="font-medium text-gray-700">{email}</span> is
                        registered, you'll receive a reset link shortly. Check your spam
                        folder too.
                    </p>

                    <Link href="/login"
                        className="text-sm text-blue-600 font-medium hover:underline">
                        ← Back to sign in
                    </Link>

                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center 
                                    justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 
                                   17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 
                                   01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>

                        {/* <KeyIcon className="w-6 h-6 text-blue-600"/> */}
                    </div>
                    <h1 className="text-lg font-medium text-gray-900">Forgot password?</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Enter your email and we'll send a reset link
                    </p>
                </div>

                {/* Info box */}
                <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-100 
                                rounded-lg text-sm text-blue-700 flex gap-2">
                    <span className="mt-0.5">ℹ️</span>
                    <span>We'll send a link valid for 1 hour. Check spam if not received.</span>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 
                                    rounded-lg text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email address
                        </label>
                        <input
                            type="email"
                            placeholder="ram@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg 
                                       text-sm focus:outline-none focus:ring-2 
                                       focus:ring-blue-500 focus:border-transparent 
                                       placeholder:text-gray-400"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700
                                   disabled:bg-blue-400 disabled:cursor-not-allowed
                                   text-white text-sm font-medium rounded-lg 
                                   transition-colors">
                        {loading ? "Sending..." : "Send reset link"}
                    </button>

                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    <Link href="/login"
                        className="text-blue-600 font-medium hover:underline">
                        ← Back to sign in
                    </Link>
                </p>

            </div>
        </div>
    )
}

