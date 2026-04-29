import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export function bucketConfigReady() {
  return Boolean(
    process.env.BUCKET &&
      process.env.ENDPOINT &&
      process.env.ACCESS_KEY_ID &&
      process.env.SECRET_ACCESS_KEY
  );
}

export function bucketClient() {
  return new S3Client({
    region: process.env.REGION || "auto",
    endpoint: process.env.ENDPOINT,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  });
}

export async function putFile({ key, body, contentType }) {
  await bucketClient().send(
    new PutObjectCommand({
      Bucket: process.env.BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
}

export async function getFile(key) {
  return bucketClient().send(
    new GetObjectCommand({
      Bucket: process.env.BUCKET,
      Key: key,
    })
  );
}
