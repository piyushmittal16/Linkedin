import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function NavbarV1() {
  return (
    <nav className="w-full bg-gray-100 flex justify-between items-center px-4 sm:px-8 md:px-16 py-3 shadow-sm box-border">
      {/* --- Left Section: Logo --- */}
      <Link
        to="/"
        className="flex items-center gap-1 sm:gap-2 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <h3 className="text-blue-800 font-bold text-2xl sm:text-3xl">Linked</h3>
        <img src={logo} alt="LinkedIn Logo" className="w-6 h-6 sm:w-7 sm:h-7" />
      </Link>

      {/* --- Right Section: Buttons --- */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          to="/signup"
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-black rounded-3xl hover:bg-gray-200 cursor-pointer transition-all"
        >
          Join Now
        </Link>
        <Link
          to="/login"
          className="px-3 sm:px-4 py-1.5 sm:py-2 border border-blue-800 text-blue-800 text-sm sm:text-base rounded-3xl hover:bg-blue-50 cursor-pointer transition-all"
        >
          Sign in
        </Link>
      </div>
    </nav>
  );
}
