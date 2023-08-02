import { IUser } from "../interfaces/user.interface"
import nodemailer, { SentMessageInfo } from "nodemailer";
import { capitalizeString } from "../utils/capitalize.utils";

export default async function sendMail (fullname: string, recipient: string, subject: string, content: string): Promise<void> {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USERNAME as string,
      pass: process.env.MAIL_PASSWORD as string,
    },
  });

  let mailOptions = {
    from: process.env.MAIL_ADDRESS,
    to: recipient,
    subject: subject,
    sender: "The Bale Team",
    html: `<!doctype html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      </head>
      <body style="font-family: sans-serif;">
        <div style="display: block; margin: auto; max-width: 600px;" class="main">
            <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Hello, ${capitalizeString(
              fullname
            )}!</h1>
            ${content}
            <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">The Bale Team</h1>
              </div>
              <!-- Example of invalid for email html/css, will be detected by Mailtrap: -->
              <style>
                .main { background-color: white; }
                a:hover { border-left-width: 1em; min-height: 2em; }
              </style>
            </body>
          </html>`,
  };

  transporter.sendMail(mailOptions, function (err: any, data: SentMessageInfo):  void {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log(`Email successfully sent to ${recipient}`);
    }
  });
};
