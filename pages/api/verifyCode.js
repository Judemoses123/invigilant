import connectDB from "../../utils/db/db";
import User from "../../models/user";
import jwt from "jsonwebtoken";
import ResetRequest from "../../models/resetRequest";

await connectDB();
export default async function verifyCode(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "method not allowed", status: "failed" });
  }

  const otp = req.body.otp;
  const id = req.body.id;

  const resetRequest = await ResetRequest.findById(id);
  console.log(resetRequest, otp);
  if (resetRequest.otp != otp)
    return res.status(401).json({ message: "invalid otp", status: "failed" });

  const user = await User.findOne({ email: resetRequest.email });
  const token = await generateAccessToken({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
  console.log(token);
  return res.status(200).json({
    message: "otp verification successfull",
    status: "success",
    token: token,
    id: resetRequest._id,
  });
}
const generateAccessToken = async (user) => {
  const token = await jwt.sign(user, process.env.JWT_SECRET_KEY);
  return token;
};
