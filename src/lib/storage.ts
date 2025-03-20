import { S3 } from "@aws-sdk/client-s3";
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env";

// Configure S3 client to use Digital Ocean Spaces
const s3Client = new S3({
  region: "blr1", // Based on your DO space region
  endpoint: env.DO_ENDPOINT_ORIGIN,
  credentials: {
    accessKeyId: env.DO_ACCESS_KEY_ID,
    secretAccessKey: env.DO_ACCESS_KEY_SECRET,
  },
  forcePathStyle: true, // Required for DigitalOcean Spaces
});

const BUCKET_NAME = "empowerwomn";

/**
 * Uploads a file to Digital Ocean Spaces storage
 * @param file - The file buffer to upload
 * @param fileName - Original file name
 * @param contentType - MIME type of the file
 * @param folder - Optional folder path inside bucket (default: "slides")
 * @returns Promise with the public URL of the uploaded file
 */
export async function uploadFile(
  file: Buffer,
  fileName: string,
  contentType: string,
  folder = "slides",
): Promise<string> {
  // Generate unique file name to avoid collisions
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;
  const key = `${folder}/${uniqueFileName}`;

  try {
    // Upload file to DO Spaces
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: "public-read", // Make the file publicly accessible
    });

    await s3Client.send(command);

    // Return the public URL for the file
    return `${env.DO_ENDPOINT_ORIGIN}/${BUCKET_NAME}/${key}`;
  } catch (error) {
    console.error("Error uploading file to Digital Ocean Spaces:", error);
    throw new Error("Failed to upload file to storage");
  }
}

/**
 * Generates a signed URL for accessing a private file
 * @param key - The storage key of the file
 * @returns Promise with the signed URL
 */
export async function getSignedFileUrl(key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    // Create a signed URL valid for 1 hour (3600 seconds)
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error("Failed to generate file access URL");
  }
}

/**
 * Deletes a file from Digital Ocean Spaces storage
 * @param fileUrl - The complete URL of the file to delete
 * @returns Promise that resolves when deletion is complete
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // Extract the key from the full URL
    // Format: https://empowerwomn.blr1.digitaloceanspaces.com/slides/filename.ext
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split("/");
    // Remove the first empty segment and the bucket name
    if (pathParts[1] === BUCKET_NAME) {
      pathParts.splice(0, 2);
    } else {
      pathParts.shift(); // Remove just the first empty segment
    }
    const key = pathParts.join("/");

    if (!key) {
      throw new Error("Invalid file URL format");
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    console.log(`Successfully deleted file: ${key}`);
  } catch (error) {
    console.error("Error deleting file from Digital Ocean Spaces:", error);
    throw new Error("Failed to delete file from storage");
  }
}
