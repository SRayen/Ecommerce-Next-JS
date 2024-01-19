import mongoose from "mongoose";

async function dbConnect() {
  try {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URL!);
  } catch (error) {
    throw new Error("Connection failed");
  }
}

export default dbConnect;
