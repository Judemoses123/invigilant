import authenticate from "../../middlewares/authentication";
import Test from "../../models/test";
import connectDB from "../../utils/db/db";

export default async function submitTest(req, res) {
  await connectDB();
  await authenticate(req, res);
  try {
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
      test.save();
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
