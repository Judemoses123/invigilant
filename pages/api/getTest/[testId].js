import authenticate from "../../../middlewares/authentication";
import Test from "../../../models/test";
import connectDB from "../../../utils/db/db";
await connectDB();
export default async function (req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ message: "method not allowed", status: "failed" });
  }
  await authenticate(req, res);
  try {
    const { testId } = req.query;
    const test = await Test.findById(testId);
    if (!test) {
      return res
        .status(404)
        .json({ message: "test not found", status: "failed" });
    }
    return res.status(200).json({
      message: "test fetched successfully",
      status: "success",
      test: test,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "something went wrong", status: "failed" });
  }
}
