import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI); // Remove useNewUrlParser and useUnifiedTopology
    isConnected = true;
    console.log("Connected to MongoDB successfully");
  } catch (error:any) {
    console.error("MongoDB connection error:", error.message || error);
    if (error.name === "MongoNetworkError") {
      console.error("Network error - Check your internet or MongoDB Atlas IP whitelist");
    } else if (error.name === "MongoParseError") {
      console.error("Invalid connection string:", MONGODB_URI);
    }
    throw new Error("Failed to connect to MongoDB");
  }
};