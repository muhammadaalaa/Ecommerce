import  nodemailer  from "nodemailer";

export const sendEmail = async ({ email, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EmailSender,
      pass: process.env.EmailPassword,
    },
  });

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" aa9900743@gmail.com',
    to: email,
    subject: subject ? subject : "Hello ✔",
    text: "Hello world?",
    html: html ? html : "<b>Hello world?</b>",
  });

  console.log("Message sent: %s", info);
};
 // check in init app it is working or not   //******************************** */
  // import { sendEmail } from "./src/service/sendEmail.js";
  // sendEmail({
  //   email: "aa9900743@gmail.com",
  //   subject: "Hello",
  //   html: "<h1>hello</h1> ",
  // });
  //********************************* */
