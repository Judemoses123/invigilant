import authenticate from "../../middlewares/authentication";
import * as faceapi from "face-api.js";
import connectDB from "../../utils/db/db";
import { createCanvas, loadImage } from "canvas";
import output from "image-output";
import Test from "../../models/test";

await faceapi.nets.tinyFaceDetector.loadFromUri(
  "https://cdn.jsdelivr.net/gh/cgarciagl/face-api.js/weights/"
);

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

    const base64Data = imageSrc.replace(/^data:image\/\w+;base64,/, "");

    const buffer = Buffer.from(base64Data, "base64");

    const canvas = await createCanvasFromBase64(buffer);

    const detections = await faceapi.detectAllFaces(
      canvas,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: 320,
        scoreThreshold: 0.5,
      })
    );
    console.log(detections.length);

    const test = await Test.findById(testId);

    const testSolvedByUser = test.solved.find(
      (t) => t.userId.toString() === req.user._id.toString()
    );
    let currentFlags = 0;
    if (!!testSolvedByUser.flags) {
      currentFlags = testSolvedByUser.flags;
    }

    if (detections.length != 1) {
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

async function createCanvasFromBase64(buffer) {
  const canvas = createCanvas();
  const ctx = canvas.getContext("2d");

  const img = await loadImage(buffer);

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0);

  return canvas;
}
