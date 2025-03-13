import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mogoodb";
import mongoose from "mongoose";


const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Contact =
  mongoose.models.ContactModel || mongoose.model("Contact", ContactSchema);

export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const { name, email, message } = await req.json();
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    return NextResponse.json({ message: "Contact saved successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error saving contact:", error);
    return NextResponse.json({ error: "Failed to save contact" }, { status: 500 });
  }
}

export async function GET() {
  await connectToDatabase();
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    console.log("error", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}