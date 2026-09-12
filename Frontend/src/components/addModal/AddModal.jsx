import { useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import { toast } from "react-toastify";
import axios from "axios";

import { uploadToCloudinary } from "../../utils/cloudinary";

const AddModal = (props) => {
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handlePost = async () => {
    if (desc.trim().length === 0 && !imageUrl)
      return toast.error("Please Enter any field");
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/post`,
        { desc, imageLink: imageUrl },
        { withCredentials: true }
      );
      toast.success("Post created successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Failed to create post");
    }
  };

  const handleUploadImage = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(files[0]);
      setImageUrl(url);
      toast.success("Image attached!");
    } catch (error) {
      console.error("modal uploadImage error", error);
      toast.error(error.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div>
      <div className="flex gap-4 items-center">
        <div className="relative">
          <img
            src={props.data?.profile_pic}
            className="w-15 h-15 rounded-4xl"
            alt="img"
          />
        </div>
        <div className="text-2xl">{props.data?.f_name}</div>
      </div>
      <div>
        <textarea
          value={desc}
          onChange={(e) => {
            setDesc(e.target.value);
          }}
          cols={50}
          rows={5}
          placeholder="What do you want to talk about ?"
          className="my-3 outline-0 text-xl p-2"
        ></textarea>
      </div>
      {imageUrl && (
        <div>
          <img className="w-20 h-20 rounded-xl" src={imageUrl} />
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="my-7">
          <label className="cursor-pointer" htmlFor="inputFile">
            <ImageIcon />
          </label>
          <input
            onChange={handleUploadImage}
            type="file"
            className="hidden"
            id="inputFile"
          />
        </div>
        <div
          className="bg-blue-950 text-white py-1 px-3 cursor-pointer rounded-2xl"
          onClick={handlePost}
        >
          Post
        </div>
      </div>
    </div>
  );
};

export default AddModal;
