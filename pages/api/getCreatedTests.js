import authenticate from "../../middlewares/authentication";
import Test from "../../models/test";
import User from "../../models/user";
import connectDB from "../../utils/db/db";
export default async function getCreatedTests(req, res) {
  await connectDB();
  try {
    if (req.method !== "GET") {
      return res
        .status(405)
        .json({ message: "method not allowed", status: "failed" });
    }
    await authenticate(req, res);
    const user = await req.user.populate("createdTests.testId");
    console.log(user);
    const createdTests = user.createdTests.map((t) => {
      return { test: t.testId, name: t.name, _id: t._id };
    });
    if (user) {
      return res.status(200).json({
        message: "test fetched sucessfully",
        status: "success",
        createdTests: createdTests,
      });
    } else {
      return res
        .status(404)
        .json({ message: "something went wrong", status: "failed" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "something went wrong", status: "failed" });
  }
}
