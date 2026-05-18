import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, token) {
    const verifyLink = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`

    await resend.emails.send({
        from: "JobBoard <onboarding@resend.dev>",
        to: email,
        subject: "Verify your email",
        html: `
             <h2>Verify Your Email</h2>
             <p>Click below:</p>
             <a href="${verifyLink}">Verify Email</a>`
    })

}


export async function SendResetEmail(email, token) {

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your email",
        html: `
         <h2>Reset Your Email</h2>
         <p>Click below:</p>
          <a href="${resetLink}">Click here to resent password</a>
          `
    })

}



// New — application confirmation to user
export async function sendApplicationConfirmation(email, name, jobTitle, company) {
    const { error } = await resend.emails.send({
        from: "JobBoard <onboarding@resend.dev>",
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

    if (error) throw new Error("Failed to send confirmation email")
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

    const { error } = await resend.emails.send({
        from: "JobBoard <onboarding@resend.dev>",
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

    if (error) throw new Error("Failed to send status update email")
}