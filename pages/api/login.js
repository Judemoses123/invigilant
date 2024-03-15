import connectDB from "../../utils/db/db";
import User from "../../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
await connectDB();
export default async function login(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "method not allowed", status: "failed" });
  }
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res
      .status(401)
      .json({ message: "invalid inuput", status: "failed" });
  }

  const existingUser = await User.findOne({ email: email });
  console.log(existingUser);
  if (!existingUser) {
    return res
      .status(404)
      .json({ message: "user doesnt exists", status: "failed" });
  }
  bcrypt.compare(password, existingUser.password, async (err, match) => {
    if (err) {
      console.log(err);
    }
    if (match) {
      const token = await generateAccessToken({
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      });
      console.log("TOKEN", token);
      return res.status(200).json({
        message: "User logged in succesfully",
        status: "success",

        user: {
          name: existingUser.name,
          email: existingUser.email,
          token: token,
        },
      });
    }
    if (!match) {
      return res
        .status(401)
        .json({ message: "invalid credentials", status: "failed" });
    }
  });
}

const generateAccessToken = async (user) => {
  const token = await jwt.sign(user, process.env.JWT_SECRET_KEY);
  return token;
};
