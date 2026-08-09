import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { getR2PublicBaseUrl } from "@/lib/utils/urls";

declare global {
  var _r2Client: S3Client | undefined;
}

function getR2Client(): S3Client {
  if (globalThis._r2Client) return globalThis._r2Client;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing R2 credentials in environment variables (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY).",
    );
  }
  if (!process.env.R2_BUCKET_NAME) {
    throw new Error("Missing R2_BUCKET_NAME in environment variables.");
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  if (process.env.NODE_ENV !== "production") {
    globalThis._r2Client = client;
  }

  return client;
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
  const ext = filename.split(".").pop() ?? "bin";
  const key = `${folder}/${randomUUID()}.${ext}`;

  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
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
