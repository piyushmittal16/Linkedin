import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleLoginCompo = (props) => {
  const navigate = useNavigate();

  const handleOnSuccess = async (credResponse) => {
    const token = credResponse.credential;
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
      { token },
      { withCredentials: true }
    );
    localStorage.setItem("isLogin", true);
    localStorage.setItem("userInfo", JSON.stringify(res.data.userExist));
props.changeLoginValue(true)
    navigate('/feeds')
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          handleOnSuccess(credentialResponse);
        }}
        onError={() => {
          // console.log("Login Failed");
        }}
      />
    </div>
  );
};

export default GoogleLoginCompo;
