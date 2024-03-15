import authenticate from "../../middlewares/authentication";
import connectDB from "../../utils/db/db";

export default async function getUser(req, res) {
  await connectDB();
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ message: "method not allowed", status: "failed" });
  }
  await authenticate(req, res);
  try {
    const token = req.headers["authorization"];
    return res.status(200).json({
      message: "user fetched successfully",
      status: "success",
      user: {
        token: token,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "something went wrong", status: "success" });
  }
}
