import React, { useState, useEffect } from "react";

const Conversation = ({ item, ownData, handleSelectedCon, activeConId }) => {
  const [memberData, setMemberData] = useState(null);
  useEffect(() => {
    let ownId = ownData?._id;
    let arr = item?.members?.filter((it) => it._id !== ownId);
    setMemberData(arr[0]);
  }, []);

  const handleClickFunc = async () => {
    handleSelectedCon(item?._id, memberData);
  };


  return (
    <div
      onClick={handleClickFunc}
      className={`flex items-center w-full cursor-pointer border-b-1 border-gray-300 gap-3 p-4 hover:bg-gray-200 ${
        activeConId === item?._id ? "bg-gray-200" : null
      }`}
    >
      <div className="shrink-0">
        <img
          src={memberData?.profile_pic}
          className="w-12 h-12 rounded-[100%] cursor-pointer"
        />
      </div>
      <div className="">
        <div className="text-md">{memberData?.f_name}</div>
        <div className="text-sm text-gray-500">{memberData?.headline}</div>
      </div>
    </div>
  );
};

export default Conversation;
