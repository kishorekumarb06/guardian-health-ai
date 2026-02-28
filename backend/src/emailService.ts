import nodemailer from "nodemailer";

export async function sendEmergencyEmail(location: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "yourgmail@gmail.com",
            pass: "your_app_password_here"
        }
    });

    const mailOptions = {
        from: "yourgmail@gmail.com",
        to: "receiver1@gmail.com, receiver2@gmail.com",
        subject: "🚨 Emergency Alert - Fall Detected",
        text: `
    A fall has been detected.
    
    Location:
    ${location}
    
    Immediate attention required.
    `
    };

    await transporter.sendMail(mailOptions);
}
