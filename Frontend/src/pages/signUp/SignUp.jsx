import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const SignUp = (props) => {
  const navigate = useNavigate();
  const [registerField, setRegisterField] = useState({
    email: "",
    password: "",
    f_name: "",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = (event, key) => {
    setRegisterField({ ...registerField, [key]: event.target.value });
  };

  //handle Register Button
  const handleRegisterBtn = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;

    if (
      registerField.email.trim().length === 0 ||
      registerField.password.trim().length === 0 ||
      registerField.f_name.trim().length === 0
    ) {
      return toast.error("Please fill all details.");
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      return toast.error(
        "Backend URL is missing! Please configure VITE_BACKEND_URL in your Vercel Environment Variables."
      );
    }

    setLoading(true);
    try {
      await axios.post(
        `${backendUrl}/api/auth/register`,
        registerField
      );
      toast.success("You have registered successfully! Please sign in.");
      setRegisterField({
        email: "",
        password: "",
        f_name: "",
      });
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      const errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (err?.message === "Network Error"
          ? "Network Error: Cannot reach server. If using Render free tier, server may be waking up (please wait ~50s). Also check VITE_BACKEND_URL."
          : err?.message) ||
        "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="text-4xl mb-5 text-center px-4">
        Make the most of your professional life
      </div>
      <div className="w-[85%] md:w-[28%] shadow-xl rounded-sm box p-10 bg-white">
        <form onSubmit={handleRegisterBtn} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email">Email</label>
            <input
              value={registerField.email}
              onChange={(e) => handleRegister(e, "email")}
              type="email"
              required
              className="w-full text-xl border-2 rounded-lg px-5 py-1"
              placeholder="Email"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              value={registerField.password}
              onChange={(e) => handleRegister(e, "password")}
              type="password"
              required
              className="w-full text-xl border-2 rounded-lg px-5 py-1"
              placeholder="Password"
            />
          </div>
          <div>
            <label htmlFor="f_name">Full Name</label>
            <input
              value={registerField.f_name}
              onChange={(e) => handleRegister(e, "f_name")}
              type="text"
              required
              className="w-full text-xl border-2 rounded-lg px-5 py-1"
              placeholder="Full Name"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-800 text-white py-3 px-4 rounded-xl text-center text-xl transition-all ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-900 cursor-pointer"
            } my-2 flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Registering...</span>
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
      <Link to={"/login"} className="mt-4 mb-10 ">
        Already on LinkedIn ? <span className="text-blue-800">Sign in</span>
      </Link>
    </div>
  );
};

export default SignUp;
