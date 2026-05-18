"use client"

import Link from "next/link"
import { useState } from "react"
import { UserPlus } from "lucide-react"

const initialState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
}

export default function Register() {

    
    const [formData, setFormData] = useState(initialState)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError("")
    }

    const validate = () => {
        if (!formData.name.trim()) {
            setError("Full name is required")
            return false
        }
        if (!formData.email.trim()) {
            setError("Email address is required")
            return false
        }
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters")
            return false
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!validate()) return

        setLoading(true)

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess(true)
            } else {
                setError(data.message || "Something went wrong")
            }


        } catch (error) {
            setError("Something went wrong. Please try again.", error)
        } finally {
            setLoading(false)
        }
    }

    // Success state — email sent
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-sm bg-white border border-gray-200
                                rounded-2xl p-8 shadow-sm text-center">

                    <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center
                                    justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-green-600" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 
                                   2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 
                                   2 0 002 2z" />
                        </svg>
                    </div>

                    <h1 className="text-lg font-medium text-gray-900 mb-2">
                        Check your inbox
                    </h1>
                    <p className="text-sm text-gray-500 mb-2">
                        We sent a verification email to
                    </p>
                    <p className="text-sm font-medium text-gray-800 mb-4">
                        {formData.email}
                    </p>
                    <p className="text-xs text-gray-400 mb-6">
                        Click the link in the email to activate your account.
                        Check your spam folder if you don't see it.
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

                            <UserPlus className="w-6 h-6 text-blue-600" />
                            
                        {/* <svg className="w-6 h-6 text-blue-600" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 
                                   0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 
                                   2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 
                                   2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg> */}
                    </div>
                    <h1 className="text-lg font-medium text-gray-900">Create your account</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Join to find your next opportunity
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200
                                    rounded-lg text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Full name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full name
                        </label>
                        <input
                            name="name"
                            type="text"
                            placeholder="Ram Kumar"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg
                                       text-sm focus:outline-none focus:ring-2
                                       focus:ring-blue-500 focus:border-transparent
                                       placeholder:text-gray-400"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email address
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="ram@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg
                                       text-sm focus:outline-none focus:ring-2
                                       focus:ring-blue-500 focus:border-transparent
                                       placeholder:text-gray-400"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Min. 8 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg
                                       text-sm focus:outline-none focus:ring-2
                                       focus:ring-blue-500 focus:border-transparent
                                       placeholder:text-gray-400"
                        />
                    </div>

                    {/* Confirm password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm password
                        </label>
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Repeat your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg
                                       text-sm focus:outline-none focus:ring-2
                                       focus:ring-blue-500 focus:border-transparent
                                       placeholder:text-gray-400"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700
                                   disabled:bg-blue-400 disabled:cursor-not-allowed
                                   text-white text-sm font-medium rounded-lg
                                   transition-colors mt-2">
                        {loading ? "Creating account..." : "Create account"}
                    </button>

                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{" "}
                    <Link href="/login"
                        className="text-blue-600 font-medium hover:underline">
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    )
}

