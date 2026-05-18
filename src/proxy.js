import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

//Middleware
export default withAuth(
    function middleware(req) {

        const token = req.nextauth.token
        const path = req.nextUrl.pathname

        //USER trying to access / admin

        if (path.startsWith("/admin") && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", req.url))
        }

        // ADMIN trying to access /dashboard
        if (path.startsWith("/dashboard") && token?.role === "ADMIN") {
            return NextResponse.redirect(new URL("/admin", req.url))
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
        pages: {
            signIn: "/login"
        }
    }
)

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*"]
}