import { NextResponse } from "next/server";
import Certificate from "@/app/models/Certificate";
import { connectToDatabase } from "@/lib/mogoodb";
import { promises as fs } from "fs";
import path from "path";
import { ObjectId } from "mongodb";

// Handle POST request to upload certificate
export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const image = formData.get("image") as File;

    if (!name || !image) {
      return NextResponse.json({ error: "Name and image are required" }, { status: 400 });
    }

    // Generate a unique filename
    const fileExtension = image.name.split(".").pop();
    const filename = `${Date.now()}.${fileExtension}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, filename);

    // Ensure the uploads directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Save the file to the public/uploads directory
    const arrayBuffer = await image.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));

    // Save certificate data to MongoDB with the relative image URL
    const imageUrl = `/uploads/${filename}`;
    const newCertificate = new Certificate({ name, imageUrl });
    await newCertificate.save();

    return NextResponse.json(
      { message: "Certificate uploaded successfully", imageUrl },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading certificate:", error);
    return NextResponse.json(
      { error: "Error uploading certificate" },
      { status: 500 }
    );
  }
}

// Handle GET request to fetch all certificates
// export async function GET() {
//   await connectToDatabase();

//   try {
//     const certificates = await Certificate.find().sort({ createdAt: -1 });
//     return NextResponse.json(certificates, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Error retrieving certificates" },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
    await connectToDatabase();
  
    try {
      const certificates = await Certificate.find().sort({ createdAt: -1 });
  
      // Convert all _id fields to strings
      const formattedCertificates = certificates.map(cert => ({
        ...cert.toObject(),
        _id: cert._id.toString(), // Ensure _id is a string
      }));
  
      return NextResponse.json(formattedCertificates, { status: 200 });
    } catch (error) {
      console.error("Error retrieving certificates:", error);
      return NextResponse.json(
        { error: "Error retrieving certificates" },
        { status: 500 }
      );
    }
  }
  

// Handle DELETE request to remove a certificate
export async function DELETE(req: Request) {
    await connectToDatabase();
  
    try {
      const { id } = await req.json(); // Get ID from request body
      if (!id) {
        return NextResponse.json({ error: "Certificate ID is required" }, { status: 400 });
      }
  
      // Convert ID string to ObjectId for MongoDB
      const objectId = new ObjectId(id);
  
      const deletedCertificate = await Certificate.findByIdAndDelete(objectId);
      if (!deletedCertificate) {
        return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Certificate deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting certificate:", error);
      return NextResponse.json({ error: "Error deleting certificate" }, { status: 500 });
    }
  }
  

// Handle PUT request to update a certificate
export async function PUT(req: Request) {
  await connectToDatabase();

  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const image = formData.get("image") as File | null;

    if (!id || !name) {
      return NextResponse.json({ error: "ID and Name are required" }, { status: 400 });
    }

    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    let imageUrl = certificate.imageUrl;

    // If a new image is uploaded, replace the old one
    if (image) {
      const fileExtension = image.name.split(".").pop();
      const filename = `${Date.now()}.${fileExtension}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      const filePath = path.join(uploadDir, filename);

      // Ensure the uploads directory exists
      await fs.mkdir(uploadDir, { recursive: true });

      // Save the new file
      const arrayBuffer = await image.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));

      // Delete the old image
      const oldImagePath = path.join(process.cwd(), "public", certificate.imageUrl);
      await fs.unlink(oldImagePath).catch((err) => console.error("File delete error:", err));

      imageUrl = `/uploads/${filename}`;
    }

    // Update certificate in the database
    certificate.name = name;
    certificate.imageUrl = imageUrl;
    await certificate.save();

    return NextResponse.json(
      { message: "Certificate updated successfully", certificate },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating certificate:", error);
    return NextResponse.json(
      { error: "Error updating certificate" },
      { status: 500 }
    );
  }
}
