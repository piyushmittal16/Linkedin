import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//for Showing error when user submit form without fill inputs
import { toast } from "react-toastify";
import axios from "axios";

const LogIn = (props) => {
  const navigate = useNavigate();
  const [loginField, setLoginField] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const onChangeInput = (event, key) => {
    setLoginField({ ...loginField, [key]: event.target.value });
  };

  //for Showing error when user submit form without fill inputs
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;

    if (
      loginField.email.trim().length === 0 ||
      loginField.password.trim().length === 0
    ) {
      return toast.error("Please fill all details..");
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      return toast.error(
        "Backend URL is missing! Please configure VITE_BACKEND_URL in your Vercel Environment Variables."
      );
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/auth/login`,
        loginField,
        { withCredentials: true }
      );

      toast.success("You have logged in successfully");
      props.changeLoginValue(true);
      localStorage.setItem("isLogin", "true");

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      }

      localStorage.setItem("userInfo", JSON.stringify(res.data.userExist));
      navigate("/feeds");
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (err?.message === "Network Error"
          ? "Network Error: Cannot reach server. If using Render free tier, server may be waking up (please wait ~50s). Also check VITE_BACKEND_URL."
          : err?.message) ||
        "Login failed. Please check your credentials and try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-[85%] md:w-[28%] shadow-xl rounded-sm box p-10 bg-white">
        <div className="text-3xl mb-4 font-semibold text-gray-800">Sign In</div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              required
              value={loginField.email}
              onChange={(e) => {
                onChangeInput(e, "email");
              }}
              className="w-full text-xl border-2 rounded-lg px-5 py-1"
              placeholder="Email"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              required
              value={loginField.password}
              onChange={(e) => {
                onChangeInput(e, "password");
              }}
              className="w-full text-xl border-2 rounded-lg px-5 py-1"
              placeholder="Password"
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
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
      <Link to={"/signup"} className="mt-4 mb-10 ">
        New to LinkedIn ? <span className="text-blue-800">Join Now</span>
      </Link>
    </div>
  );
};

export default LogIn;
