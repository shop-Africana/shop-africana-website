import crypto from "node:crypto";

type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
};

type CloudinaryApiResponse = {
  secure_url?: string;
  public_id?: string;
  error?: {
    message?: string;
  };
};

const cloudinaryHost = "res.cloudinary.com";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not configured.");
  }

  return { cloudName, apiKey, apiSecret };
}

function signCloudinaryParams(
  params: Record<string, string | number>,
  apiSecret: string,
) {
  const payload = Object.entries(params)
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${payload}${apiSecret}`)
    .digest("hex");
}

export async function uploadOwnerImageToCloudinary({
  image,
  folder,
  publicIdPrefix,
}: {
  image: File;
  folder: "shop-africana/products" | "shop-africana/restaurant";
  publicIdPrefix: string;
}): Promise<CloudinaryUploadResult> {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `${publicIdPrefix}-${crypto.randomUUID()}`;
  const signedParams = {
    folder,
    public_id: publicId,
    timestamp,
  };
  const signature = signCloudinaryParams(signedParams, apiSecret);
  const formData = new FormData();

  formData.append("file", image);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );
  const result = (await response.json()) as CloudinaryApiResponse;

  if (!response.ok || !result.secure_url || !result.public_id) {
    throw new Error(result.error?.message ?? "Image upload failed.");
  }

  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteCloudinaryImage(publicId: string) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signCloudinaryParams({ public_id: publicId, timestamp }, apiSecret);
  const formData = new FormData();

  formData.append("public_id", publicId);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);

  await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body: formData,
  });
}

export function getCloudinaryPublicIdFromUrl(imageUrl: string | null | undefined) {
  if (!imageUrl) return null;

  try {
    const url = new URL(imageUrl);
    if (url.hostname !== cloudinaryHost) return null;

    const marker = "/image/upload/";
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex === -1) return null;

    const afterUpload = url.pathname.slice(markerIndex + marker.length);
    const withoutVersion = afterUpload.replace(/^v\d+\//, "");
    const extensionIndex = withoutVersion.lastIndexOf(".");

    return extensionIndex === -1
      ? withoutVersion
      : withoutVersion.slice(0, extensionIndex);
  } catch {
    return null;
  }
}
