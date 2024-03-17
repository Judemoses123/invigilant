import authenticate from "../../middlewares/authentication";
import Test from "../../models/test";
import connectDB from "../../utils/db/db";

await connectDB();
export default async function submitTest(req, res) {
  console.log(req.body);
  if (req.method != "POST") {
    return res
      .status(405)
      .json({ message: "method not allowed", status: "failed" });
  }
  await authenticate(req, res);
  try {
    console.log(req.body.testId);
    const test = await Test.findById(req.body.testId);
    const testSolvedByUser = test.solved.find((t) => {
      return t.userId.toString() === req.user._id.toString();
    });

    if (!testSolvedByUser) {
      return res
        .status(400)
        .json({ message: "something went wrong", status: "failed" });
    } else {
      testSolvedByUser.endTime = Date.now();
      await test.save();
      console.log(testSolvedByUser);
      return res.status(200).json({
        message: "test submitted successfully",
        status: "success",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "something went wrong",
      status: "failed",
    });
  }
}
