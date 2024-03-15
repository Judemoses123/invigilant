import authenticate from "../../../middlewares/authentication";
import Test from "../../../models/test";
import connectDB from "../../../utils/db/db";

export default async function getBlankTest(req, res) {
  await connectDB();
  await authenticate(req, res);
  if (req.method !== "GET") {
    return res
      .status(400)
      .json({ message: "method not allowed", status: "failed" });
  }
  try {
    const { testId } = req.query;
    const test = await Test.findById(testId);
    if (!test) {
      return res
        .status(404)
        .json({ message: "test not found", status: "failed" });
    }
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
    const testSolvedByUser = test.solved.find(
      (test) => test.userId.toString() === req.user._id.toString()
    );
    if (testSolvedByUser) {
      return res.status(200).json({
        message: "test fetched successfully",
        status: "success",
        test: {
          _id: blankTest._id,
          duration: ((testSolvedByUser.endTime - Date.now()) / 60000).toFixed(
            0
          ),
          name: blankTest.name,
          questions: testSolvedByUser.questions,
          startTime: testSolvedByUser.startTime,
          endTime: testSolvedByUser.endTime,
        },
      });
    } else {
      return res.status(200).json({
        message: "test fetched successfully",
        status: "success",
        test: {
          _id: blankTest._id,
          duration: blankTest.duration,
          name: blankTest.name,
          questions: blankTest.questions,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong", status: "failed" });
  }
}
