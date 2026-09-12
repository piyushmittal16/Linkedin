import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

import { toast } from "react-toastify";

const GoogleLoginCompo = (props) => {
  const navigate = useNavigate();

  const handleOnSuccess = async (credResponse) => {
    try {
      const token = credResponse.credential;
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        return toast.error(
          "Backend URL is missing! Please configure VITE_BACKEND_URL in Vercel settings."
        );
      }
      const res = await axios.post(
        `${backendUrl}/api/auth/google`,
        { token },
        { withCredentials: true }
      );
      localStorage.setItem("isLogin", "true");
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      }
      localStorage.setItem("userInfo", JSON.stringify(res.data.userExist));
      props.changeLoginValue(true);
      navigate("/feeds");
    } catch (err) {
      console.error("Google login error:", err);
      toast.error(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Google Sign-In failed"
      );
    }
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          handleOnSuccess(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
};

export default GoogleLoginCompo;
