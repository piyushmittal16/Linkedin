import React, { useState, useEffect, useContext } from "react";
import Advertisement from "../../components/advertisment/Advertisement";
import { AuthContext } from "../../context/AuthContext";

const Resume = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100">
      {user?.resume ? (
        <div className="w-[100%] py-5 sm:w-[74%]">
          <img src={user?.resume} className="w-full h-full rounded-lg" />
        </div>
      ) : (
        <div className="w-[80%] h-full flex justify-center pt-40 ">
          No resume posted
        </div>
      )}
      <div className="w-[26%] py-5 hidden md:block">
        <div className="sticky top-19">
          <Advertisement />
        </div>
      </div>
    </div>
  );
};

export default Resume;
