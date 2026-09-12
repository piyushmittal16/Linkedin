import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";

const LogIn = (props) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loginField, setLoginField] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔑 Forgot / Reset Password state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const onChangeInput = (event, key) => {
    setLoginField({ ...loginField, [key]: event.target.value });
  };

  // 🚪 Handle Login Submission
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

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      }

      localStorage.setItem("isLogin", "true");
      if (res.data?.userExist) {
        login(res.data.userExist);
      }

      props.changeLoginValue(true);
      navigate("/feeds");
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (err?.message === "Network Error"
          ? "Network Error: Cannot reach server. If using Render free tier, server may be waking up (please wait ~50s)."
          : err?.message) ||
        "Login failed. Please check your credentials and try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Handle Password Reset
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    if (resetLoading) return;

    if (!resetEmail || !newPassword) {
      return toast.error("Please provide both email and new password.");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    setResetLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email: resetEmail,
        newPassword,
      });
      toast.success(res.data?.message || "Password reset successfully!");
      setShowResetModal(false);
      setResetEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Reset error:", err);
      toast.error(
        err?.response?.data?.error || "Password reset failed. Check your email."
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-4">
      <div className="w-[90%] sm:w-[450px] shadow-xl rounded-xl box p-8 sm:p-10 bg-white border border-gray-100">
        <div className="text-3xl mb-6 font-bold text-gray-800">Sign In</div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              required
              id="email"
              value={loginField.email}
              onChange={(e) => onChangeInput(e, "email")}
              className="w-full text-base border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                required
                id="password"
                value={loginField.password}
                onChange={(e) => onChangeInput(e, "password")}
                className="w-full text-base border border-gray-300 rounded-lg px-4 py-2.5 pr-11 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <VisibilityOffIcon fontSize="small" />
                ) : (
                  <VisibilityIcon fontSize="small" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setResetEmail(loginField.email || "");
                setShowResetModal(true);
              }}
              className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-700 text-white py-3 px-4 rounded-xl text-center text-lg font-semibold transition-all ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-blue-800 cursor-pointer shadow-sm hover:shadow"
            } my-1 flex items-center justify-center gap-2`}
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

      <Link to={"/signup"} className="mt-5 text-gray-600 hover:text-gray-900">
        New to LinkedIn ? <span className="text-blue-700 font-semibold">Join Now</span>
      </Link>

      {/* 🔐 Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Reset Your Password</h3>
              <button
                onClick={() => setShowResetModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  New Password (min 6 chars)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-all flex items-center gap-2"
                >
                  {resetLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogIn;
