import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { getR2PublicBaseUrl } from "@/lib/utils/urls";

const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

const EXT_BY_CONTENT_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/**
 * Maps a validated content type to a storage extension. Never derive the
 * extension from a user-supplied filename — it isn't checked against the
 * allowlist the route validates `contentType` with.
 */
function extensionForContentType(contentType: string): string {
  return EXT_BY_CONTENT_TYPE[contentType] ?? "bin";
}

/** Strips the filename down to characters safe for an S3 metadata header. */
function sanitizeFilenameForMetadata(filename: string): string {
  return filename.replace(/[^\w.-]/g, "_").slice(0, 255);
}

function getR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

interface PresignUploadResult {
  /** Presigned PUT URL — forward to client for direct upload */
  uploadUrl: string;
  /** Public URL of the object after upload */
  publicUrl: string;
  /** Object key stored in R2 */
  key: string;
}

/**
 * Generate a presigned PUT URL for direct browser-to-R2 upload.
 * Expires in 5 minutes.
 */
export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  folder = "screenshots",
): Promise<PresignUploadResult> {
  const ext = extensionForContentType(contentType);
  const key = `${folder}/${randomUUID()}.${ext}`;

  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
    Metadata: { "original-filename": sanitizeFilenameForMetadata(filename) },
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });
  const publicBaseUrl = getR2PublicBaseUrl();
  if (!publicBaseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_R2_PUBLIC_URL or R2_PUBLIC_URL environment variable.",
    );
  }

  const publicUrl = `${publicBaseUrl}/${key}`;

  return { uploadUrl, publicUrl, key };
}

/**
 * Generate a presigned GET URL for a private R2 object.
 * Expires in 1 hour.
 */
export async function getPresignedReadUrl(key: string): Promise<string> {
  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn: 3600 });
}
