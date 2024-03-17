import mongoose from "mongoose";

let isConnected;

export default async function connectDB() {
  if (isConnected) {
    return;
  }
  console.log(process.env.MONGO_URI);
  const db = await mongoose.connect(process.env.MONGO_URI);
  console.log("connected");
  isConnected = db.connections[0].readyState;
}
