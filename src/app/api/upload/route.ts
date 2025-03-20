import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { uploadFile } from "~/lib/storage";

// Define response types
interface SuccessResponse {
  fileUrl: string;
}

interface ErrorResponse {
  error: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" } as ErrorResponse,
        { status: 401 },
      );
    }

    // Only trainers and admins can upload files
    if (!["trainer", "admin"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized access" } as ErrorResponse,
        { status: 403 },
      );
    }

    // Handle file upload with FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" } as ErrorResponse, {
        status: 400,
      });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" } as ErrorResponse,
        { status: 400 },
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" } as ErrorResponse,
        { status: 400 },
      );
    }

    // Convert File to Buffer for uploadFile function
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Create folder structure based on type
    const uploadFolder = type === "course-cover" ? "course-covers" : "uploads";

    // Upload file to Digital Ocean Spaces
    const fileUrl = await uploadFile(
      fileBuffer,
      file.name,
      file.type,
      uploadFolder,
    );

    return NextResponse.json({ fileUrl } as SuccessResponse);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" } as ErrorResponse,
      { status: 500 },
    );
  }
}

// Add file size limit to config
export const config = {
  api: {
    bodyParser: false,
  },
};
