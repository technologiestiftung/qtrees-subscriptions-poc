import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
// const nodemailer = require("nodemailer");

export async function mailer(payload: Record<string, unknown>): Promise<void> {
  const hostname = "from account page";
  const username = "from account page";
  const password = "from account page";

  const transporter = nodemailer.createTransport({
    host: hostname,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: username,
      pass: password,
    },
    logger: true,
  });

  const mails = Object.keys(payload);
  for (const mail of mails) {
    const mailPayload = payload[mail];
    const mailOptions: Mail.Options = {
      from: username,
      to: mail,
      subject: "",
      text: "",
      html: "",
    };

    await transporter.sendMail(mailOptions);
  }
}
