import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

const mongoUrl = process.env.MONGO_URL;

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
