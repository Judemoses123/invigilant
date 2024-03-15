import connectDB from "../../utils/db/db";
import User from "../../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export default async function signup(req, res) {
  await connectDB();
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "method not allowed", status: "failed" });
  }
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  if (!name || !email || !password) {
    return res
      .status(401)
      .json({ message: "invalid inuput", status: "failed" });
  }

  const existingUser = await User.findOne({ email: email });
  console.log(existingUser);
  if (!!existingUser) {
    return res
      .status(401)
      .json({ message: "user already exists", status: "failed" });
  }

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      console.log(err);
      return res
        .status(400)
        .json({ message: "somethign went wrong", status: "failed" });
    }
    const user = new User({
      name: name,
      email: email,
      password: hash,
    });
    user.save();
    const token = await generateAccessToken({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
    console.log("TOKEN", token);
    return res.status(200).json({
      message: "User signed up succesfully",
      status: "success",

      user: {
        name: user.name,
        email: user.email,
        token: token,
      },
    });
  });
}

const generateAccessToken = async (user) => {
  const token = await jwt.sign(user, process.env.JWT_SECRET_KEY);
  return token;
};
