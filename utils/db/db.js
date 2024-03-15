import mongoose from "mongoose";

let isConnected;

export default async function connectDB() {
  if (isConnected) {
    return;
  }
  console.log(process.env.MONGO_URI);
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("conected");
  isConnected = db.connections[0].readyState;
}
