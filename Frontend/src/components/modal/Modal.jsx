import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const Modal = (props) => {
  return (
    <div className="bg-black/60 fixed top-0 left-0 inset-0 z-40 flex justify-center items-center p-3 sm:p-4">
      <div className="w-full max-w-lg md:max-w-xl max-h-[90vh] bg-white rounded-2xl p-5 sm:p-8 shadow-2xl flex flex-col">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 shrink-0">
          <div className="flex gap-4 items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{props.title}</h2>
          </div>
          <button
            onClick={props.closeModal}
            className="cursor-pointer text-gray-500 hover:text-gray-800 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            title="Close"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 mt-3">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Modal;