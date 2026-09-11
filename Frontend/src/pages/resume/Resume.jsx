import React, { useContext } from "react";
import Advertisement from "../../components/advertisment/Advertisement";
import { AuthContext } from "../../context/AuthContext";

const Resume = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="w-full py-4 sm:py-6 px-2 sm:px-4 md:px-8 xl:px-24 flex justify-center bg-gray-100">
      <div className="flex justify-between gap-5 w-full max-w-6xl">
        <div className="w-full md:w-[72%]">
          {user?.resume ? (
            <img src={user?.resume} alt="Resume" className="w-full h-auto rounded-lg shadow-sm" />
          ) : (
            <div className="w-full bg-white p-12 rounded-xl shadow-xs text-center text-gray-500 font-medium">
              📄 No resume uploaded yet. Visit your profile to upload one!
            </div>
          )}
        </div>
        <div className="w-[26%] hidden md:block">
          <div className="sticky top-18">
            <Advertisement />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
