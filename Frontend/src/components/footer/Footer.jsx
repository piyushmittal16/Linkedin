import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-4 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-1.5 font-semibold text-gray-700">
          <span className="text-blue-700 font-bold text-base tracking-tight">Linked</span>
          <span className="bg-blue-700 text-white font-bold text-xs px-1.5 py-0.5 rounded">in</span>
          <span className="ml-2 text-gray-500 font-normal">Corporation © {new Date().getFullYear()}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-gray-500 font-medium">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">About</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Accessibility</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Help Center</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Privacy & Terms</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Ad Choices</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;