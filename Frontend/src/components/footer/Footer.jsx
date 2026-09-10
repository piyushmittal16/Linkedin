import React from 'react'

const Footer = () => {
  return (
    <div className="w-[100%] bg-gray-200 flex justify-center">
      <div className="md:p-3 w-[100%] flex flex-col items-center py-4">
        <div className="flex gap-1 items-center cursor-pointer">
          <h3 className="text-blue-800 font-bold text-xl ">Linked</h3>
          <img
            src={
              "https://freelogopng.com/images/all_img/1656994981linkedin-icon-png.png"
            }
            alt="LinkedInLogo"
            className="w-4.5 h-4.5"
          />
              </div>
              <div className='text-sm'>@Copyright 2025</div>
      </div>
    </div>
  );
}

export default Footer