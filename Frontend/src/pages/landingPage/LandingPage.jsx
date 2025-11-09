import React from "react";
import { Link } from "react-router-dom";

// ✅ import the image as default
import landingImage from "../../assets/landingImage.png";

const LandingPage = (props) => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 py-10 md:py-20 bg-white">
      {/* --- Left Section --- */}
      <div className="w-full md:w-[45%] text-center md:text-left space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-700 leading-snug">
          Welcome To Your Professional Community
        </h1>

        <Link
          to="/login"
          className="flex mx-auto md:mx-0 py-2 px-3 bg-white gap-2 rounded-3xl items-center w-[80%] md:w-[70%] justify-center text-black hover:bg-gray-100 border-2 cursor-pointer transition-all"
        >
          Sign in with Email
        </Link>

        <p className="mx-auto md:mx-0 text-sm w-[85%] md:w-[70%] text-gray-600 leading-relaxed">
          By clicking Continue to join or sign in, you agree to{" "}
          <span className="text-blue-800 cursor-pointer hover:underline">
            LinkedIn's User Agreement
          </span>
          ,{" "}
          <span className="text-blue-800 cursor-pointer hover:underline">
            Privacy Policy
          </span>
          , and{" "}
          <span className="text-blue-800 cursor-pointer hover:underline">
            Cookie Policy
          </span>
          .
        </p>

        <Link
          to="/signup"
          className="text-center md:text-left text-lg w-full md:w-[70%] mt-4"
        >
          New to LinkedIn?{" "}
          <span className="text-blue-800 cursor-pointer hover:underline">
            Join now
          </span>
        </Link>
      </div>

      {/* --- Right Section (Image) --- */}
      <div className="w-full md:w-[50%] mb-8 md:mb-0 flex justify-center">
        <img
          src={landingImage}
          alt="Landing illustration"
          className="w-[90%] sm:w-[80%] md:w-[70%] h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default LandingPage;
