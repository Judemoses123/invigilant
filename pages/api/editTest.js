import authenticate from "../../middlewares/authentication";
import Test from "../../models/test";
import connectDB from "../../utils/db/db";

await connectDB();
export default async function editTest(req, res) {
  if (req.method != "POST") {
    return res
      .status(405)
      .json({ message: "method not allowed", status: "failed" });
  }
  await authenticate(req, res);
  try {
    const name = req.body.name;
    const hour = req.body.hour;
    const minutes = req.body.minutes;
    const questions = req.body.questions;
    const testId = req.body.testId;

    const duration = 60 * Number(hour) + Number(minutes);

    const test = await Test.findById(testId);
    test.name = name;
    test.duration = duration;
    test.questions = questions;
    console.log(test);
    await test.save();

    const createdTests = req.user.createdTests;
    const filteredTest = createdTests.find((t) => {
      return t.testId.toString() === testId.toString();
    });
    console.log(test);
    console.log(filteredTest);
    filteredTest.name = test.name;

    await req.user.save();

    return res
      .status(200)
      .json({ message: "test edited successfully", status: "success" });
  } catch (error) {
    console.log(error);
  }
}
