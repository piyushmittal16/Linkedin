import React, { useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ImageModal = ({ isCircular, userData, handleEditFunc }) => {
  const [imageLink, setImageLink] = useState(
    isCircular ? userData?.profile_pic : userData?.cover_pic
  );
  const [loading, setLoading] = useState(false);

  const handleInputImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);

    data.append("upload_preset", "linkedinClone");
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/duwvyiocv/image/upload",
        data,
        { withCredentials: false }
      );
      const imageUrl = response.data.secure_url;
      setImageLink(imageUrl);
    } catch (error) {
      console.log({ message: "modal uploadImage error", error });
      alert("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBtn = async () => {
    let { data } = { ...userData };
    if (isCircular) {
      data = { ...data, ["profile_pic"]: imageLink };
    } else {
      data = { ...data, ["cover_pic"]: imageLink };
    }
    handleEditFunc(data);
  };

  return (
    <div className="p-5 relative flex items-center flex-col h-full">
      {isCircular ? (
        <img src={imageLink} className="rounded-full w-[150px] h-[150px]" />
      ) : (
        <img
          className="rounded-xl w-full h-[200px] object-cover"
          src={imageLink}
        />
      )}

      <label
        htmlFor="btn-submit"
        className="absolute bottom-10 left-0 p-3 bg-blue-900 text-white rounded-2xl cursor-pointer"
      >
        Upload
      </label>
      <input
        onChange={handleInputImage}
        type="file"
        className="hidden"
        id="btn-submit"
      />
      {loading ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      ) : (
        <div
          className="absolute bottom-10 right-0 p-3 bg-blue-900 text-white rounded-2xl cursor-pointer"
          onClick={handleSubmitBtn}
        >
          Submit
        </div>
      )}
    </div>
  );
};

export default ImageModal;
