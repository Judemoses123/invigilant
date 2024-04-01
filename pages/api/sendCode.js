import connectDB from "../../utils/db/db";
import User from "../../models/user";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import ResetRequest from "../../models/resetRequest";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "judemoses123@gmail.com",
    pass: "vxov xwcy etvl xzta",
  },
});

await connectDB();
export default async function sendCode(req, res) {
  try {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ message: "method not allowed", status: "failed" });
    }

    const email = req.body.email;
    console.log(email);
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "user doesn't exist", status: "failed" });
    }
    const otp = Math.floor(Math.random() * 9999);
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Invigilant Tests" <judemoses123@gmail.com>',
      to: `${email}`,
      subject: "Password Reset verification Code",
      text: `Hi ${user.name}, your one time password reset verification code is ${otp}`,
      // html: "<b>Hello world?</b>", // html body
    });

    const resetRequest = new ResetRequest({ email: email, otp: otp });

    await resetRequest.save();

    console.log("Message sent: %s", info.messageId);
    return res.status(200).json({
      message: "verification code sent successfully",
      status: "success",
      id: resetRequest._id,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "internal server error", status: "failed" });
  }
}

