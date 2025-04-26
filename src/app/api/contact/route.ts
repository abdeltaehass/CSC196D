import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mogoodb";
import mongoose from "mongoose";

// Define the Contact schema
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create the Contact model
const Contact =
  mongoose.models.ContactModel || mongoose.model("Contact", ContactSchema);

// Connect to the database
export async function POST(req: Request) {
  // Check if the request is a POST request
  await connectToDatabase();
  try {
    // Parse the request body as JSON
    const { name, email, message } = await req.json();
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    // Return a success response
    return NextResponse.json({ message: "Contact saved successfully" }, { status: 201 });
    // If the request is not a POST request, return an error
  } catch (error) {
    console.error("Error saving contact:", error);
    // Handle errors during database operations
    return NextResponse.json({ error: "Failed to save contact" }, { status: 500 });
  }
}
// Handle GET request to retrieve all contacts
export async function GET() {
  await connectToDatabase();
  try {
    // Check if the request is a GET request
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    console.log("error", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}