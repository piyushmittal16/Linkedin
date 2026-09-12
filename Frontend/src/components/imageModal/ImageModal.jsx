import React, { useState } from "react";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { toast } from "react-toastify";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ImageModal = ({ isCircular, userData, handleEditFunc, closeModal }) => {
  const [imageLink, setImageLink] = useState(
    isCircular ? userData?.profile_pic : userData?.cover_pic
  );
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 📤 Upload file to Cloudinary safely
  const handleInputImage = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(files[0]);
      setImageLink(imageUrl);
      toast.success("Image uploaded! Click 'Save Changes' to apply.");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // 💾 Save new image link to profile
  const handleSubmitBtn = async () => {
    if (uploading || submitting) return;
    setSubmitting(true);
    try {
      let data = { ...userData };
      if (isCircular) {
        data.profile_pic = imageLink;
      } else {
        data.cover_pic = imageLink;
      }
      await handleEditFunc(data);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-lg mx-auto p-4 sm:p-6 space-y-6">
      {/* 🖼️ Image Preview Section */}
      <div className="w-full flex flex-col items-center justify-center">
        {isCircular ? (
          <div className="relative group">
            <img
              src={
                imageLink ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile preview"
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-white shadow-lg bg-gray-100"
            />
          </div>
        ) : (
          <div className="w-full h-44 sm:h-52 rounded-xl overflow-hidden shadow-md bg-gray-100 border border-gray-200">
            <img
              src={
                imageLink ||
                "https://img.freepik.com/free-photo/gradient-dark-blue-futuristic-digital-grid-background_53876-129728.jpg"
              }
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* 🔘 Select New File Trigger */}
      <div className="w-full flex justify-center">
        <label
          htmlFor="file-upload-input"
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium text-sm transition-all cursor-pointer ${
            uploading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? (
            <>
              <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
              <span>Uploading to cloud...</span>
            </>
          ) : (
            <>
              <CloudUploadIcon fontSize="small" />
              <span>{imageLink ? "Choose Another Photo" : "Choose Photo"}</span>
            </>
          )}
        </label>
        <input
          id="file-upload-input"
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={handleInputImage}
          className="hidden"
        />
      </div>

      {/* ⚖️ Balanced Action Buttons Footer */}
      <div className="w-full pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
        {closeModal && (
          <button
            type="button"
            onClick={closeModal}
            disabled={uploading || submitting}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={handleSubmitBtn}
          disabled={uploading || submitting}
          className={`px-6 py-2 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-all flex items-center gap-2 shadow-sm ${
            uploading || submitting ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Saving...</span>
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
