
// New — application confirmation to user

import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

//Verification Email
export async function sendVerificationEmail(email, name, token) {
    
    const verifyLink = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Verify your email",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
            <div style="
                max-width: 500px;
                margin: auto;
                background: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
            ">

                <h2 style="color: #2563eb;">
                    Welcome to JobBoard 🚀
                </h2>

                <p style="color: #555; line-height: 1.6;">
                    Hi ${name}, <br/><br/>
                    Please verify your email address to activate your account.
                </p>

                <a
                    href="${verifyLink}"
                    style="
                        display: inline-block;
                        margin-top: 20px;
                        background: #2563eb;
                        color: white;
                        padding: 12px 24px;
                        text-decoration: none;
                        border-radius: 6px;
                        font-weight: bold;
                    "
                >
                    Verify Email
                </a>
                <p style="
                    margin-top: 25px;
                    font-size: 13px;
                    color: #888;
                ">
                    If you didn’t create this account, you can ignore this email.
                </p>

            </div>
        </div>
        `
    })

}

//Password Reset Email
export async function SendResetEmail(email, token) {

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Reset Your Password",

        html: `  <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            
            <h2>Reset Your Password</h2>

            <p>
                We received a request to reset your password.
                Click the button below to create a new password.
            </p>

            <a
                href="${resetLink}"
                style="
                    display: inline-block;
                    background: #2563eb;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 20px 0;
                "
            >
                Reset Password
            </a>

            <p style="font-size: 13px; color: #666;">
                If you didn't request a password reset, you can safely ignore this email.
            </p>

        </div>`
    })
}

export async function sendApplicationConfirmation(email, name, jobTitle, company) {
    
   try {
        await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Application received — ${jobTitle}`,
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                <h2>Application received!</h2>
                <p>Hi ${name},</p>
                <p>Your application for <strong>${jobTitle}</strong> 
                   at <strong>${company}</strong> has been received.</p>
                <p>We will notify you by email when your application status changes.</p>
                <p style="color: #888; font-size: 12px; margin-top: 16px;">
                    JobBoard — Find your next opportunity
                </p>
            </div>
           `
    })
   } catch (error) {
       console.error("Email sending failed:", error);
        throw error;
   }

}


// New — status update to user
export async function sendStatusUpdate(email, name, jobTitle, company, status) {

    const statusMessages = {
        REVIEWED: "Your application is being reviewed.",
        SHORTLISTED: "Great news! You've been shortlisted.",
        REJECTED: "Unfortunately your application was not selected this time.",
        HIRED: "Congratulations! You have been selected for this role."
    }

    const message = statusMessages[status] || "Your application status has been updated."

    try {
          await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Application update — ${jobTitle}`,
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                <h2>Application status update</h2>
                <p>Hi ${name},</p>
                <p>${message}</p>
                <div style="background: #f3f4f6; padding: 12px 16px;
                            border-radius: 8px; margin: 16px 0;">
                    <p style="margin: 0; font-size: 14px;">
                        <strong>Job:</strong> ${jobTitle}<br/>
                        <strong>Company:</strong> ${company}<br/>
                        <strong>Status:</strong> ${status}
                    </p>
                </div>
                <p style="color: #888; font-size: 12px; margin-top: 16px;">
                    JobBoard — Find your next opportunity
                </p>
            </div>
        `
    })
    } catch (error) {
        console.error("Failed to send status update email:", error)
        throw error
    }

}



// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendVerificationEmail(email, token) {
//     const verifyLink = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`

//     await resend.emails.send({
//         from: "JobBoard <onboarding@resend.dev>",
//         to: email,
//         subject: "Verify your email",
//         html: `
//              <h2>Verify Your Email</h2>
//              <p>Click below:</p>
//              <a href="${verifyLink}">Verify Email</a>`
//     })

// }


// export async function SendResetEmail(email, token) {

//     const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

//     await resend.emails.send({
//         from: "onboarding@resend.dev",
//         to: email,
//         subject: "Reset your email",
//         html: `
//          <h2>Reset Your Email</h2>
//          <p>Click below:</p>
//           <a href="${resetLink}">Click here to resent password</a>
//           `
//     })

// }
