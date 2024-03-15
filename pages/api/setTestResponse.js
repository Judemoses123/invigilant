import authenticate from "../../middlewares/authentication";
import Test from "../../models/test";
import connectDB from "../../utils/db/db";

export default async function setTestResponse(req, res) {
  await connectDB();
  if (req.method != "POST") {
    return res
      .status(405)
      .json({ message: "method not allowed", status: "failed" });
  }
  await authenticate(req, res);
  try {
    const date = Date.now();
    const test = await Test.findById(req.body._id);

    if (test.solved) {
      const testSolvedByUser = test.solved.find((item) => {
        return item.userId.toString() == req.user._id.toString();
      });
      const currentTime = Date.now();

      if (!testSolvedByUser) {
        test.solved.push({
          userId: req.user._id,
          questions: req.body.questions,
        });
      } else {
        if (
          testSolvedByUser.startTime < currentTime &&
          testSolvedByUser.endTime > currentTime
        ) {
          testSolvedByUser.questions = req.body.questions;
        }
      }
    } else {
      test.solved = [
        {
          userId: req.user._id,
          questions: req.body.questions,
        },
      ];
    }
    await test.save();
  } catch (err) {
    console.log(err);
  }
}
