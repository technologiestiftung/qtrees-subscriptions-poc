import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export async function mailer(payload: {
  userId: number;
  email: string;
  predictions: {
    tree_geom: string;
    prediction: string;
    tree_id: string;
  }[];
}): Promise<void> {
  const hostname = "localhost";
  const username = "admin@inbucket.org";
  const password = "123456";

  const transporter = nodemailer.createTransport({
    host: hostname,
    port: 2500,
    // secure: true,
    // requireTLS: false,
    auth: {
      user: username,
      pass: password,
    },
    logger: true,
  });



  const mailPayload = payload.predictions;
  const mailOptions: Mail.Options = {
    from: username,
    to: payload.email,
    subject: "",
    text: JSON.stringify(mailPayload),
    html: "",

  };
  await transporter.sendMail(mailOptions);
}

