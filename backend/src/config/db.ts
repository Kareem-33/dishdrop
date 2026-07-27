import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

export const connectDB = async () => {
  try {
    console.log("MONGO_URI exists:", !!MONGO_URI);

    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error: any) {
    console.log(`Error connecting to MongoDB: ${error}`)

    throw error;
  }
}