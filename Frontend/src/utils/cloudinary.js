/**
 * Cloudinary Direct Upload Utility
 * Uses native fetch to avoid leaking Axios global authorization headers,
 * preventing CORS preflight rejection (net::ERR_FAILED) on unsigned uploads.
 */
export const uploadToCloudinary = async (
  file,
  uploadPreset = "linkedinClone",
  cloudName = "duwvyiocv"
) => {
  if (!file) throw new Error("No file provided for upload");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Cloudinary upload failed with status ${response.status}`
    );
  }

  const data = await response.json();
  return data.secure_url;
};
