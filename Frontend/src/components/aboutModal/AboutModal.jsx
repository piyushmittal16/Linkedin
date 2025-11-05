import React, { useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const AboutModal = ({ handleEditFunc, userData }) => {
  const [data, setData] = useState({
    about: userData?.about,
    skills: userData?.skills?.join(","),
    resume: userData?.resume,
  });
  const handleChange = async (event, key) => {
    setData({ ...data, [key]: event.target.value });
  };

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
      setData({ ...data, resume: imageUrl });
    } catch (error) {
      console.log({ message: "modal uploadImage error", error });
      alert("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = () => {
    let arr = data?.skills?.split(",");

    let newData = {
      ...userData,
      about: data.about,
      skills: arr,
      resume: data.resume,
    };

    handleEditFunc(newData);
  };

  return (
    <div className="mt-8 w-full h-[350px]">
      {/*For About Input Box */}

      <div className="w-full mb-4">
        <label>About*</label>
        <br />
        <textarea
          value={data.about}
          onChange={(e) => {
            handleChange(e, "about");
          }}
          className="p-2 mt-1 w-full border-1 rounded-md "
          color={10}
          rows={3}
        ></textarea>
      </div>

      {/*For Skill Input Box */}
      <div className="w-full mb-4">
        <label>Skill* (Add by Separating comma)</label>
        <br />
        <textarea
          value={data.skills}
          onChange={(e) => {
            handleChange(e, "skills");
          }}
          className="p-2 mt-1 w-full border-1 rounded-md "
          color={10}
          rows={3}
        ></textarea>
      </div>

      {/*Save & Resume Button */}

      <div className="flex flex-col w-full gap-2">
        <label
          htmlFor="resumeUpload"
          className="bg-blue-600 text-white w-fit py-1 px-3 cursor-pointer hover:bg-blue-950 rounded-2xl"
        >
          Resume Upload
        </label>
        <input
          onChange={handleInputImage}
          type="file"
          className="hidden"
          id="resumeUpload"
        />
        {data.resume && <div className="my-2">{data.resume}</div>}
        {loading ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : null}
        <button
          className="bg-blue-600 text-white w-fit py-1 px-3 cursor-pointer hover:bg-blue-950 rounded-2xl"
          onClick={handleOnChange}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AboutModal;
