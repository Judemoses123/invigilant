import authenticate from "../../middlewares/authentication";
import * as faceapi from "face-api.js";
import connectDB from "../../utils/db/db";
import { createCanvas, loadImage } from "canvas";

await faceapi.nets.ssdMobilenetv1.loadFromUri(
  "https://cdn.jsdelivr.net/gh/cgarciagl/face-api.js/weights/"
);

export default async function postPicture(req, res) {
  await connectDB();
  try {
    await authenticate(req, res);

    const imageSrc = req.body.imageSrc;
    if (!imageSrc) {
      return res
        .status(400)
        .json({ message: "Image data is missing", status: "failed" });
    }

    const base64Image = imageSrc;
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const buffer = Buffer.from(base64Data, "base64");

    const canvas = await createCanvasFromBase64(buffer);
    const detections = await faceapi.detectAllFaces(canvas);
    console.log(detections.length);

    return res.status(200).json({
      message: "Image posted successfully",
      status: "success",
      faces: detections.length,
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
