import connectDB from "../../utils/db/db";
import ResetRequest from "../../models/resetRequest";
import User from "../../models/user";
import bcrypt from "bcrypt";
await connectDB();
export default async function resetPassword(req, res) {
  try {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ message: "method not allowed", status: "failed" });
    }
    const password = req.body.password;
    const id = req.body.id;
    console.log(password, id);
    const resetRequest = await ResetRequest.findById(id);
    console.log(resetRequest);
    const user = await User.findOne({ email: resetRequest.email });

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "something went wrong", status: "failed" });
      }
      user.password = hash;
      await user.save();

      return res.status(200).json({
        message: "Password Updated Successfully",
        status: "success",
      });
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "internal server error", status: "failed" });
  }
}
