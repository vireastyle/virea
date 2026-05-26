import { v2 as cloudinary } from "cloudinary";

function getCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key    = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Cloudinary credentials missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET."
    );
  }

  cloudinary.config({ cloud_name, api_key, api_secret });
  return cloudinary;
}

export async function uploadImage(
  buffer: Buffer,
  options: { folder?: string; publicId?: string } = {}
): Promise<string> {
  const cld = getCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      {
        folder:        options.folder ?? "virea/products",
        public_id:     options.publicId,
        resource_type: "image",
        transformation: [
          { width: 1200, crop: "limit" },
          { quality: "auto:good", fetch_format: "auto" },
        ],
      },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error("Cloudinary upload failed"));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}
