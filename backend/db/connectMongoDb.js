import mongoose from "mongoose";

const connectMongoDb = async () => {
  try {
    const conn=await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with failure
  }
}

export default connectMongoDb;