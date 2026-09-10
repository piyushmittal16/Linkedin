import React, { useState } from "react";

const ExperienceModal = ({
  handleEditFunc,
  userData,
  updateExperience,
  updateExperienceEdit,
}) => {
  const [data, setData] = useState({
    designation: updateExperience?.clicked
      ? updateExperience?.data?.designation
      : "",
    company_name: updateExperience?.clicked
      ? updateExperience?.data?.company_name
      : "",
    duration: updateExperience?.clicked ? updateExperience?.data?.duration : "",
    location: updateExperience?.clicked ? updateExperience?.data?.location : "",
  });

  const onChangeHandle = async (e, key) => {
    setData({ ...data, [key]: e.target.value });
  };

  const updateExpSave = () => {
    let newFilteredData = userData?.experience.filter(
      (item) => item._id !== updateExperience?.data?._id
    );
    let newArr = [...newFilteredData, data];
    let newData = { ...userData, experience: newArr };
    handleEditFunc(newData);
  };

  const handleDeleteBtn = () => {
    let newFilterData = userData?.experience.filter(
      (item) => item._id !== updateExperience?.data?._id
    );
    let newData = { ...userData, experience: newFilterData };
    handleEditFunc(newData);
  };
  const handleOnSave = async () => {
    if (updateExperience?.clicked) {
      return updateExpSave();
    } else if (
      !data.designation.trim() ||
      !data.company_name.trim() ||
      !data.duration.trim() ||
      !data.location.trim()
    ) {
      alert("Please fill all fields before saving.");
      return;
    }
    const expArr = [...(userData?.experience || []), data];
    const newData = { ...userData, experience: expArr };
    handleEditFunc(newData);
  };

  return (
    <div className="mt-8 w-full h-[350px]">
      {/* Role Section */}
      <div className="w-full mb-4">
        <label>Designation / Role</label>
        <br />
        <input
          value={data.designation}
          onChange={(e) => onChangeHandle(e, "designation")}
          type="text"
          className="p-2 mt-1 w-full border-1 rounded-md"
          placeholder="Enter your designation"
        />
      </div>

      {/* Company Section */}
      <div className="w-full mb-4">
        <label>Company Name</label>
        <br />
        <input
          value={data.company_name}
          onChange={(e) => onChangeHandle(e, "company_name")}
          type="text"
          className="p-2 mt-1 w-full border-1 rounded-md"
          placeholder="Enter company name"
        />
      </div>

      {/* Duration Section */}
      <div className="w-full mb-4">
        <label>Duration</label>
        <br />
        <input
          value={data.duration}
          onChange={(e) => onChangeHandle(e, "duration")}
          type="text"
          className="p-2 mt-1 w-full border-1 rounded-md"
          placeholder="Enter duration (e.g., Jan 2023 - Dec 2024)"
        />
      </div>

      {/* Location Section */}
      <div className="w-full mb-4">
        <label>Location</label>
        <br />
        <input
          value={data.location}
          onChange={(e) => onChangeHandle(e, "location")}
          type="text"
          className="p-2 mt-1 w-full border-1 rounded-md"
          placeholder="Enter location"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-between">
        <button
          className="bg-blue-600 text-white w-fit py-1 px-3 cursor-pointer hover:bg-blue-950 rounded-2xl"
          onClick={handleOnSave}
        >
          Save
        </button>
        {updateExperience?.clicked && (
          <button
            className="bg-blue-600 text-white w-fit py-1 px-3 cursor-pointer hover:bg-blue-950 rounded-2xl"
            onClick={handleDeleteBtn}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ExperienceModal;
