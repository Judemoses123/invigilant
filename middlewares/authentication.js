import jwt from "jsonwebtoken";
import User from "../models/user";
import connectDB from "../utils/db/db";

export default async function authenticate(req, res) {
  await connectDB();
  return new Promise((resolve, reject) => {
    const token = req.headers["authorization"];
    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      async function (err, decryptedUser) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ message: "something went wrong", status: "failed" });
        }
        const user = await User.findById(decryptedUser._id);
        if (user) {
          req.user = user;
          resolve(user);
        } else {
          reject();
          return res
            .status(400)
            .status({ message: "unauthorized", status: "failed" });
        }
      }
    );
  });
}
