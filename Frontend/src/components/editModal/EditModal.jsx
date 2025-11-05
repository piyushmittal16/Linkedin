import React, { useState } from "react";

const EditModal = ({ handleEditFunc, userData }) => {
  const [data, setData] = useState({
    f_name: userData?.f_name,
    headline: userData?.headline,
    curr_company: userData?.curr_company,
    curr_location: userData?.curr_location,
  });
  const onChangeHandle = async (event, key) => {
    setData({ ...data, [key]: event.target.value });
  };

  const handleSubmitBtn = () => {
    const newData = { ...userData, ...data };
    handleEditFunc(newData);
  };
  return (
    <div className="mt-8 w-full h-[350px] overflow-auto">
      {/*Name Section */}
      <div className="w-full mb-4">
        <label>Full Name</label>
        <br />
        <input
          value={data.f_name}
          onChange={(e) => {
            onChangeHandle(e, "f_name");
          }}
          type="text"
          className="p-2 mt-1 w-full border-1 rounded-md "
          placeholder="Enter Full Name"
        />
      </div>

      {/*Headline Section */}

      <div className="w-full mb-4">
        <label>Headline</label>
        <br />
        <textarea
          value={data.headline}
          onChange={(e) => {
            onChangeHandle(e, "headline");
          }}
          className="p-2 mt-1 w-full border-1 rounded-md "
          cols={10}
          rows={3}
        ></textarea>
      </div>

      {/*Current Company Section */}

      <div className="w-full mb-4">
        <label>Current Company</label>
        <br />
        <input
          value={data.curr_company}
          onChange={(e) => {
            onChangeHandle(e, "curr_company");
          }}
          type="text"
          className="p-2 mt-1 w-full border-1 rounded-md "
          placeholder="Current Company"
        />
      </div>

      {/*Current Location Section */}

      <div className="w-full mb-4">
        <label>Current Location</label>
        <br />
        <input
          value={data.curr_location}
          onChange={(e) => {
            onChangeHandle(e, "curr_location");
          }}
          type="text"
          className="p-2 mt-1 w-full border-1 rounded-md "
          placeholder="Current Location"
        />
      </div>

      {/*Save Button */}
      <button
        className="bg-blue-600 text-white w-fit py-1 px-3 cursor-pointer hover:bg-blue-950 rounded-2xl"
        onClick={handleSubmitBtn}
      >
        Save
      </button>
    </div>
  );
};

export default EditModal;
