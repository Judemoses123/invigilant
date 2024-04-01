import authenticate from "../../middlewares/authentication";
import connectDB from "../../utils/db/db";
import Test from "../../models/test";

await connectDB();
export default async function postPicture(req, res) {
  try {
    await authenticate(req, res);

    const imageSrc = req.body.imageSrc;
    const testId = req.body.testId;
    if (!imageSrc) {
      return res
        .status(400)
        .json({ message: "Image data is missing", status: "failed" });
    }
    const test = await Test.findById(testId);
    if (!test) {
      return res
        .status(404)
        .json({ message: "test not found", status: "failed" });
    }
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
        flagType: "Irregular Face Detection",
        image: imageSrc,
        timestamp: Date.now(),
      });
    } else {
      testSolvedByUser.flaggedInstances = [
        {
          flagType: "Irregular Face Detection",
          image: imageSrc,
          timestamp: Date.now(),
        },
      ];
    }

    await test.save();

    return res.status(200).json({
      message: "Image posted successfully",
      status: "success",
      flags: currentFlags,
    });
    
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: "failed" });
  }
}
