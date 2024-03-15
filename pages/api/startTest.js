import authenticate from "../../middlewares/authentication";
import Test from "../../models/test";
import connectDB from "../../utils/db/db";

export default async function startTest(req, res) {
  await connectDB();
  if (req.method != "POST") {
    return res
      .status(405)
      .json({ message: "method not allowed", status: "failed" });
  }
  await authenticate(req, res);
  try {
    const test = await Test.findById(req.body.testId);
    if (test.solved) {
      const testSolvedByUser = test.solved.find((item) => {
        console.log(item.userId, req.user._id);
        return item.userId.toString() == req.user._id.toString();
      });
      const blankTest = { ...test._doc };
      const blankQuestions = blankTest.questions.map((q) => {
        if (q.type === "mcq") {
          return {
            type: "mcq",
            points: q.points,
            questionText: q.questionText,
            options: q.options,
            _id: q._id,
          };
        } else {
          return {
            type: "desc",
            points: q.points,
            questionText: q.questionText,
            answerText: "",
            _id: q._id,
          };
        }
      });
      blankTest.questions = blankQuestions;
      if (!testSolvedByUser) {
        test.solved.push({
          userId: req.user._id,
          startTime: Date.now(),
          endTime: Date.now() + test.duration * 60000,
          questions: blankQuestions,
        });
      } else {
        return res
          .status(400)
          .json({ message: "test started already", status: "failed" });
      }
    } else {
      test.solved = [
        {
          userId: req.user._id,
          startTime: Date.now(),
          endTime: Date.now() + test.duration * 60000,
        },
      ];
    }
    await test.save();
    return res
      .status(200)
      .json({ message: "test started successfully", status: "success" });
  } catch (err) {
    console.log(err);
  }
}
