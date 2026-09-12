import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Advertisement from "../../components/advertisment/Advertisement";
import Card from "../../components/card/Card";
import EditIcon from "@mui/icons-material/Edit";
import Post from "../../components/post/Post";
import AddIcon from "@mui/icons-material/Add";
import Modal from "../../components/modal/Modal";
import ImageModal from "../../components/imageModal/ImageModal";
import EditModal from "../../components/editModal/EditModal";
import AboutModal from "../../components/aboutModal/AboutModal";
import ExperienceModal from "../../components/experienceModal/ExperienceModal";
import ArrowRightAltSharpIcon from "@mui/icons-material/ArrowRightAltSharp";
import MessageModal from "../../components/messageModal/MessageModal";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState([]);
  const [ownData, setOwnData] = useState(null);

  const [imageModal, setImageModal] = useState(false);
  const [circular, setCircular] = useState(true);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [experienceModal, setExperienceModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);

  const [updateExperience, setUpdateExperience] = useState({
    clicked: false,
    id: "",
    data: {},
  });

  // Profile data fetch karna
  useEffect(() => {
    if (id && id !== "undefined") {
      fetchDataOnLoad();
    }
  }, [id]);

  const fetchDataOnLoad = async () => {
    try {
      const [userDatas, postDatas, ownDatas] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user/${id}`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/post/getTop5posts/${id}`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/self`, {
          withCredentials: true,
        }),
      ]);

      setUserData(userDatas?.data?.user || null);
      setPostData(postDatas?.data?.posts || []);
      setOwnData(ownDatas?.data?.user || null);

      if (ownDatas?.data?.user) {
        localStorage.setItem("userInfo", JSON.stringify(ownDatas.data.user));
      }
    } catch (error) {
      console.log("Error loading profile:", error);
    }
  };

  const handleImageModalOpenClose = () => {
    setImageModal((prev) => !prev);
  };

  const handleEditCoverModal = () => {
    setImageModal(true);
    setCircular(false);
  };

  const handleCircularCoverModal = () => {
    if (userData?._id === ownData?._id) {
      setImageModal(true);
      setCircular(true);
    } else {
      setShowPhotoViewer(true);
    }
  };

  const handleInfoModal = () => {
    setInfoModal((prev) => !prev);
  };

  const handleAboutModal = () => {
    setAboutModal((prev) => !prev);
  };

  const handleExperienceModal = () => {
    if (experienceModal) {
      setUpdateExperience({ clicked: false, id: "", data: {} });
    }
    setExperienceModal((prev) => !prev);
  };

  const updateExperienceEdit = (id, data) => {
    setUpdateExperience({
      clicked: true,
      id: id,
      data: data,
    });
    setExperienceModal(true);
  };

  const handleMessageModal = () => {
    setMessageModal((prev) => !prev);
  };

  const handleEditFunc = async (data) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/update`,
        { user: data },
        { withCredentials: true }
      );
      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  // Friend status check functions
  const myFriend = () => {
    let arr = userData?.friends?.filter((item) => item === ownData?._id);
    return arr?.length > 0;
  };

  const userPendingListFriend = () => {
    let arr = userData?.pending_friends?.filter((item) => item === ownData?._id);
    return arr?.length > 0;
  };

  const myPendingList = () => {
    let arr = ownData?.pending_friends?.filter((item) => item === userData?._id);
    return arr?.length > 0;
  };

  const checkFriendStatus = () => {
    if (myFriend()) {
      return "Disconnect";
    } else if (userPendingListFriend()) {
      return "Request Sent";
    } else if (myPendingList()) {
      return "Accept Request";
    } else {
      return "Connect";
    }
  };

  const handleSendFriendRequest = async () => {
    const status = checkFriendStatus();
    if (status === "Request Sent" || requestLoading) return;

    setRequestLoading(true);
    try {
      if (status === "Connect") {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/sendfriendrequest`,
          { receiver: userData?._id },
          { withCredentials: true }
        );
        toast.success(res?.data?.message || "Request Sent");
        await fetchDataOnLoad();
      } else if (status === "Accept Request") {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/acceptfriendrequest`,
          { friendId: userData?._id },
          { withCredentials: true }
        );
        toast.success(res?.data?.message || "Request Accepted");
        await fetchDataOnLoad();
      } else if (status === "Disconnect") {
        const res = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/removefromfriendlist/${userData?._id}`,
          { withCredentials: true }
        );
        toast.success(res?.data?.message || "Disconnected");
        await fetchDataOnLoad();
      }
    } catch (error) {
      console.log(`Friend Request Error: ${error}`);
      toast.error(error?.response?.data?.error || "Action failed");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleShareBtn = async () => {
    try {
      const origin = window.location.origin;
      const string = `${origin}/profile/${id}`;
      await navigator.clipboard.writeText(string);
      toast.success("Profile URL copied to clipboard!");
    } catch (error) {
      console.log(error);
      toast.error("Could not copy URL");
    }
  };

  const handleLogoutBtn = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="w-full py-4 sm:py-6 px-2 sm:px-4 md:px-8 xl:px-24 flex justify-center bg-gray-100">
      <div className="flex flex-col lg:flex-row justify-between gap-5 w-full max-w-6xl">
        {/* Left Section */}
        <div className="w-full lg:w-[70%]">
          {/* User Section */}
          <div>
            <Card padding={0}>
              <div className="w-full h-fit">
                <div className="relative w-full h-[200px]">
                  {userData?._id === ownData?._id && (
                    <div
                      className="absolute cursor-pointer top-3 right-3 z-20 w-[35px] flex justify-center items-center h-[35px] rounded-full p-3 bg-white hover:bg-gray-100"
                      onClick={handleEditCoverModal}
                    >
                      <EditIcon />
                    </div>
                  )}
                  <img
                    src={userData?.cover_pic}
                    className="w-full h-[200px] rounded-tr-lg rounded-tl-lg object-cover"
                    alt="cover"
                  />
                  <div
                    onClick={handleCircularCoverModal}
                    className="absolute object-cover top-24 left-6 z-10"
                  >
                    <img
                      src={userData?.profile_pic}
                      className="w-35 h-35 border-2 cursor-pointer border-white rounded-full object-cover"
                      alt="profile"
                    />
                  </div>
                </div>

                <div className="mt-10 relative px-8 py-2">
                  {userData?._id === ownData?._id && (
                    <div
                      className="absolute cursor-pointer top-3 right-3 z-20 w-[35px] flex justify-center items-center h-[35px] rounded-full p-3 bg-white hover:bg-gray-100"
                      onClick={handleInfoModal}
                    >
                      <EditIcon />
                    </div>
                  )}
                  <div className="w-full">
                    <div className="text-2xl font-bold">{userData?.f_name}</div>
                    <div className="text-gray-700">{userData?.headline}</div>
                    <div className="text-gray-500 text-sm">
                      {userData?.curr_location}
                    </div>
                    <div className="text-md text-blue-800 w-fit cursor-pointer hover:underline font-medium my-1">
                      {userData?.friends?.length || 0} Connections
                    </div>

                    {/* Buttons */}
                    <div className="md:flex w-full justify-between items-center">
                      <div className="my-5 gap-3 flex flex-wrap">
                        <div className="cursor-pointer p-2 border rounded-lg bg-blue-800 text-white font-semibold hover:bg-blue-900">
                          Open to
                        </div>
                        <div
                          className="cursor-pointer p-2 border rounded-lg bg-blue-800 text-white font-semibold hover:bg-blue-900"
                          onClick={handleShareBtn}
                        >
                          Share
                        </div>
                        {userData?._id === ownData?._id && (
                          <div
                            className="cursor-pointer p-2 border rounded-lg bg-red-700 text-white font-semibold hover:bg-red-800"
                            onClick={handleLogoutBtn}
                          >
                            Logout
                          </div>
                        )}
                      </div>

                      <div className="my-5 gap-3 flex flex-wrap">
                        {myFriend() && (
                          <div
                            onClick={handleMessageModal}
                            className="cursor-pointer p-2 border rounded-lg bg-blue-800 text-white font-semibold hover:bg-blue-900"
                          >
                            Message
                          </div>
                        )}
                        {userData?._id !== ownData?._id && (
                          <button
                            type="button"
                            onClick={handleSendFriendRequest}
                            disabled={requestLoading || checkFriendStatus() === "Request Sent"}
                            className={`p-2 px-4 border rounded-lg bg-blue-800 text-white font-semibold flex items-center gap-2 transition-all ${
                              requestLoading || checkFriendStatus() === "Request Sent"
                                ? "opacity-60 cursor-not-allowed"
                                : "hover:bg-blue-900 cursor-pointer"
                            }`}
                          >
                            {requestLoading ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                <span>Processing...</span>
                              </>
                            ) : (
                              checkFriendStatus()
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* About Section */}
          <div className="my-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold">About</div>
                {userData?._id === ownData?._id && (
                  <div onClick={handleAboutModal} className="cursor-pointer">
                    <EditIcon />
                  </div>
                )}
              </div>
              <div className="text-gray-700 text-md w-[80%] mt-2">
                {userData?.about || "No about information added."}
              </div>
            </Card>
          </div>

          {/* Skill Section */}
          <div className="my-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold">Skills</div>
              </div>
              <div className="my-5 gap-3 flex flex-wrap">
                {userData?.skills && userData?.skills?.length > 0 ? (
                  userData?.skills?.map((item, index) => (
                    <div
                      key={index}
                      className="cursor-pointer p-2 border rounded-lg bg-blue-800 text-white font-semibold"
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">No skills added yet</div>
                )}
              </div>
            </Card>
          </div>

          {/* Activity Section */}
          <div className="mt-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold">Activities</div>
              </div>

              <div className="cursor-pointer px-3 py-1 w-fit border rounded-full bg-green-800 text-white font-semibold my-2">
                Posts
              </div>

              <div className="overflow-x-auto my-2 flex gap-3 overflow-y-hidden w-full">
                {postData.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/profile/${id}/activities/${item?._id}`)}
                    className="shrink-0 cursor-pointer w-[350px] h-[560px]"
                  >
                    <Post profile={1} item={item} personalData={ownData} />
                  </div>
                ))}
              </div>

              {postData.length > 0 ? (
                <div className="w-full mt-3 flex justify-center items-center">
                  <Link
                    to={`/profile/${id}/activities`}
                    className="p-2 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-300 flex items-center gap-1 font-semibold"
                  >
                    Show All Posts <ArrowRightAltSharpIcon />
                  </Link>
                </div>
              ) : (
                <div className="flex justify-center text-gray-400 py-3">
                  No Activities
                </div>
              )}
            </Card>
          </div>

          {/* Experience Section */}
          <div className="mt-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold">Experience</div>
                {userData?._id === ownData?._id && (
                  <div onClick={handleExperienceModal} className="cursor-pointer">
                    <AddIcon />
                  </div>
                )}
              </div>

              {userData?.experience && userData?.experience?.length > 0 ? (
                <div className="mt-5">
                  {userData?.experience?.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 border-t border-gray-300 flex justify-between"
                    >
                      <div>
                        <div className="text-lg font-semibold">{item.designation}</div>
                        <div className="text-sm text-gray-700">{item.company_name}</div>
                        <div className="text-sm text-gray-500">{item.duration}</div>
                        <div className="text-sm text-gray-500">{item.location}</div>
                      </div>
                      {userData?._id === ownData?._id && (
                        <div
                          onClick={() => updateExperienceEdit(item._id, item)}
                          className="cursor-pointer"
                        >
                          <EditIcon />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center text-gray-400 py-3">
                  No Experience mentioned
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex lg:w-[28%]">
          <div className="sticky top-19">
            <Advertisement />
          </div>
        </div>
      </div>

      {/* Modals */}
      {imageModal && (
        <Modal title={circular ? "Update Profile Picture" : "Update Cover Photo"} closeModal={handleImageModalOpenClose}>
          <ImageModal
            handleEditFunc={handleEditFunc}
            isCircular={circular}
            userData={ownData}
            closeModal={handleImageModalOpenClose}
          />
        </Modal>
      )}

      {/* 👁️ Full photo preview for other user profile */}
      {showPhotoViewer && (
        <Modal
          title={userData?.f_name ? `${userData.f_name}'s Photo` : "Profile Photo"}
          closeModal={() => setShowPhotoViewer(false)}
        >
          <div className="p-6 flex flex-col items-center justify-center">
            <img
              src={userData?.profile_pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Profile"
              className="w-56 h-56 sm:w-64 sm:h-64 rounded-full object-cover border-4 border-white shadow-2xl bg-gray-100"
            />
          </div>
        </Modal>
      )}

      {infoModal && (
        <Modal title="Edit Profile" closeModal={handleInfoModal}>
          <EditModal handleEditFunc={handleEditFunc} userData={ownData} />
        </Modal>
      )}

      {aboutModal && (
        <Modal title="Edit About" closeModal={handleAboutModal}>
          <AboutModal handleEditFunc={handleEditFunc} userData={ownData} />
        </Modal>
      )}

      {experienceModal && (
        <Modal title="Edit Experience" closeModal={handleExperienceModal}>
          <ExperienceModal
            handleEditFunc={handleEditFunc}
            userData={ownData}
            updateExperience={updateExperience}
            updateExperienceEdit={updateExperienceEdit}
          />
        </Modal>
      )}

      {messageModal && (
        <Modal title="Message" closeModal={handleMessageModal}>
          <MessageModal selfData={ownData} userData={userData} closeModal={handleMessageModal} />
        </Modal>
      )}
    </div>
  );
};

export default Profile;
