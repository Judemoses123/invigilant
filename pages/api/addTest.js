import Test from "../../models/test";
import authenticate from "../../middlewares/authentication";
import connectDB from "../../utils/db/db";

export default async function addTest(req, res) {
  await connectDB();
  if (req.method !== "POST") {
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

    const duration = 60 * Number(hour) + Number(minutes);
    const test = new Test({
      name: name,
      duration: duration,
      questions: questions,
    });
    await test.save();

    const createdTests = req.user.createdTests;
    createdTests.push({
      testId: test._id,
      name: test.name,
    });

    await req.user.save();

    return res
      .status(200)
      .json({ message: "test created successfully", status: "success" });
  } catch (error) {
    console.log(error);
  }
}
