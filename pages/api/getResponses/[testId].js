import authenticate from "../../../middlewares/authentication";
import Test from "../../../models/test";
import connectDB from "../../../utils/db/db";

await connectDB();
export default async function getResponses(req, res) {
  if (req.method != "GET") {
    return res
      .status(405)
      .json({ message: "method not allowed", status: "failed" });
  }
  await authenticate(req, res);
  try {
    const { testId } = req.query;
    console.log(testId);
    const checkTestCreatedByUser = req.user.createdTests.find(
      (test) => test.testId.toString() === testId.toString()
    );
    console.log(checkTestCreatedByUser);
    if (!checkTestCreatedByUser) {
      return res
        .status(400)
        .json({ message: "access unauthorized", status: "failed" });
    }
    const test = await Test.findById(testId).populate({
      path: "solved.userId",
      select: "name email",
    });
    console.log(test.solved);

    let totalPoints = 0;
    for (let i = 0; i < test.questions.length; i++) {
      totalPoints += test.questions[i].points;
    }
    test.totalPoints = totalPoints;

    for (let i = 0; i < test.solved.length; i++) {
      let scoredPoints = 0;
      for (let j = 0; j < test.solved[i].questions.length; j++) {
        if (test.solved[i].questions[j].type == "mcq") {
          if (
            test.solved[i].questions[j].correctOption ==
            test.questions[j].correctOption
          ) {
            scoredPoints += test.questions[j].points;
          }
        }
      }
      test.solved[i].scoredPoints = scoredPoints;
    }
    await test.save();

    return res.status(200).json({
      message: "responses fetched successfully",
      status: "sucess",
      test: test,
    });
  } catch (err) {
    console.log(err);
  }
}
