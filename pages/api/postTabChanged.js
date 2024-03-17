import authenticate from "../../middlewares/authentication";
import connectDB from "../../utils/db/db";
import Test from "../../models/test";
await connectDB();
export default async function postTabChanged(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "method not allowed", status: "failed" });
  }
  await authenticate(req, res);
  const testId = req.body.testId;
  try {
    const test = await Test.findById(testId);
    console.log("TEST> ", test);
    const testSolvedByUser = test.solved.find(
      (t) => t.userId.toString() === req.user._id.toString()
    );
    let currentFlags = 0;
    if (!!testSolvedByUser.flags) {
      currentFlags = testSolvedByUser.flags;
    }

    currentFlags++;
    testSolvedByUser.flags = currentFlags;
    if (!!testSolvedByUser.flaggedInstances) {
      testSolvedByUser.flaggedInstances.push({
        flagType: "Tab Change",
        timestamp: Date.now(),
      });
    } else {
      testSolvedByUser.flaggedInstances = [
        {
          flagType: "Tab Change",
          timestamp: Date.now(),
        },
      ];
    }

    await test.save();

    return res.status(200).json({
      message: "Tab Change Registered successfully",
      status: "success",
      flags: currentFlags,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "something went wrong", status: "success" });
  }
}
