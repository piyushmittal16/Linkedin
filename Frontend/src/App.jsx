import { useState, useEffect } from "react";
import NavbarV1 from "./components/navbarv1/NavbarV1.jsx";
import "./App.css";
import LandingPage from "./pages/landingPage/LandingPage.jsx";
import Footer from "./components/footer/Footer.jsx";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import SignUp from "./pages/signUp/SignUp.jsx";
import LogIn from "./pages/logIn/LogIn.jsx";
import NavbarV2 from "./components/navbarV2/NavbarV2.jsx";
import Feeds from "./pages/feeds/Feeds.jsx";
import MyNetwork from "./pages/myNetwork/MyNetwork.jsx";
import Resume from "./pages/resume/Resume.jsx";
import Message from "./pages/message/Message.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Activities from "./pages/activities/Activities.jsx";
import SingleActivity from "./pages/singleActivity/SingleActivity.jsx";
import Notify from "./pages/notify/Notify.jsx";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true; // ✅ globally enables cookie sending

function App() {
  const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin"));
  const changeLoginValue = (val) => {
    setIsLogin(val); 
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between box-border">
      {isLogin ? <NavbarV2 /> : <NavbarV1 />}
      <main className="flex-1 w-full flex flex-col pt-13">
        <Routes>
          <Route
            path="/"
            element={
              isLogin ? (
                <Navigate to={"/feeds"} />
              ) : (
                <LandingPage changeLoginValue={changeLoginValue} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isLogin ? (
                <Navigate to={"/feeds"} />
              ) : (
                <SignUp changeLoginValue={changeLoginValue} />
              )
            }
          />
          <Route
            path="/login"
            element={
              isLogin ? (
                <Navigate to={"/feeds"} />
              ) : (
                <LogIn changeLoginValue={changeLoginValue} />
              )
            }
          />
          <Route
            path="/feeds"
            element={isLogin ? <Feeds /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/mynetwork"
            element={isLogin ? <MyNetwork /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/resume"
            element={isLogin ? <Resume /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/message"
            element={isLogin ? <Message /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/profile/:id"
            element={isLogin ? <Profile /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/profile/:id/activities"
            element={isLogin ? <Activities /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/profile/:id/activities/:postId"
            element={isLogin ? <SingleActivity /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/Notification"
            element={isLogin ? <Notify /> : <Navigate to={"/login"} />}
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="light"
        style={{ zIndex: 99999 }}
      />
    </div>
  );
}

export default App;

