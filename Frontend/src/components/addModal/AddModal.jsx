import { useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const AddModal = (props) => {
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  // cloudinaryName= duwvyiocv
  // presetName =linkedinClone

  const handlePost = async () => {
    if ((desc.trim().length === 0) & !imageUrl)
      return toast.error("Please Enter any field");

    await axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/post`,
        { desc: desc, imageLink: imageUrl },
        { withCredentials: true }
      )
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUploadImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);

    data.append("upload_preset", "linkedinClone");
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/duwvyiocv/image/upload",
        data,
        { withCredentials: false }
      );
      const imageUrl = response.data.secure_url;
      setImageUrl(imageUrl);
    } catch (error) {
      console.log({ message: "modal uploadImage error", error });
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
      <ToastContainer />
    </div>
  );
};

export default AddModal;
