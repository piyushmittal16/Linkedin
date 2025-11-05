import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Advertisement from "../../components/advertisment/Advertisement";
import { useParams } from "react-router-dom";
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
import { ToastContainer, toast } from "react-toastify";
// import { AuthContext } from "../../context/AuthContext";
const Profile = () => {
  //Calling All Activity Id
  const { id } = useParams();
  // const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState([]);
  const [ownData, setOwnData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchDataOnLoad();
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
      setUserData(userDatas.data.user);
      setPostData(postDatas.data.posts);
      setOwnData(ownDatas.data.user);

      localStorage.setItem("userInfo", JSON.stringify(ownDatas.data.user));
    } catch (error) {
      console.log(error);
      alert("Something Went wrong");
    }
  };

  const [updateExperience, setUpdateExperience] = useState({
    clicked: "",
    id: "",
    data: {},
  });
  const updateExperienceEdit = (id, data) => {
    setUpdateExperience({
      ...updateExperience,
      clicked: true,
      id: id,
      data: data,
    });
    setExperienceModal((prev) => !prev);
  };

  //Calling All Activity Id
  //   const { postId } = useParams();

  //for overall
  const [imageModal, setImageModal] = useState(false);
  const handleImageModalOpenClose = () => {
    setImageModal((prev) => !prev);
  };
  //---------------------------------------------------
  //For Cover & Profile image Modal
  const [circular, setCircular] = useState(true);
  //for Cover Image
  const handleEditCoverModal = () => {
    setImageModal(true);
    setCircular(false);
  };
  //for Profile Image
  const handleCircularCoverModal = () => {
    setImageModal(true);
    setCircular(true);
  };
  //---------------------------------------------------
  //For Profile About Modal
  const [infoModal, setInfoModal] = useState(false);
  //for Profile About Image
  const handleInfoModal = () => {
    setInfoModal((prev) => !prev);
  };
  //---------------------------------------------------
  //For About Modal
  const [aboutModal, setAboutModal] = useState(false);
  const handleAboutModal = () => {
    setAboutModal((prev) => !prev);
  };

  //For Experience Modal
  const [experienceModal, setExperienceModal] = useState(false);
  const handleExperienceModal = () => {
    if (experienceModal) {
      setUpdateExperience({ clicked: "" });
    }
    setExperienceModal((prev) => !prev);
  };

  //For Message Modal
  const [messageModal, setMessageModal] = useState(false);
  const handleMessageModal = () => {
    setMessageModal((prev) => !prev);
  };

  const handleEditFunc = async (data) => {
    await axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/update`,
        { user: data },
        { withCredentials: true }
      )
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        alert("Something Went Wrong");
      });
  };

  //for check we are friends or not
  const myFriend = () => {
    let arr = userData?.friends?.filter((item) => {
      return item === ownData?._id;
    });
    return arr?.length;
  };

  const userPendingListFriend = () => {
    let arr = userData?.pending_friends?.filter((item) => {
      return item === ownData?._id;
    });
    return arr?.length;
  };

  const myPendingList = () => {
    let arr = ownData?.pending_friends?.filter((item) => {
      return item === userData?._id;
    });
    return arr?.length;
  };

  const checkFriendStatus = () => {
    if (myFriend()) {
      return "Disconnect";
    } else if (userPendingListFriend()) {
      return "Request Sent ";
    } else if (myPendingList()) {
      return "Accept Request";
    } else {
      return "Connect";
    }
  };

  const handleSendFriendRequest = async () => {
    if (checkFriendStatus() === "Request Sent") return;
    else if (checkFriendStatus() === "Connect") {
      await axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/sendfriendrequest`,
          { receiver: userData?._id },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success(res?.data?.message);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch((error) => {
          console.log(`Friend Request Sending error :${error}`);
          toast.error(error?.response?.data?.error);
        });
    } else if (checkFriendStatus() === "Accept Request") {
      await axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/acceptfriendrequest`,
          { friendId: userData?._id },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success(res?.data?.message);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch((error) => {
          console.log(`request accepting error : ${error}`);
          toast.error(error?.response?.data?.error);
        });
    } else if (checkFriendStatus() === "Disconnect") {
      await axios
        .delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/removefromfriendlist/${userData?._id}`,
          { withCredentials: true }
        )
        .then((res) => {
          toast.success(res?.data?.message);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch((error) => {
          console.log(`user disconnect error : ${error}`);
          toast.error(error?.response?.data?.error);
        });
    }
  };
  //Handle Share Button
  const handleShareBtn = async () => {
    try {
      let string = `${import.meta.env.VITE_FRONTEND_URL}/profile/${id}`;
      await navigator.clipboard.writeText(string);
      toast.success("Url Copied");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    }
  };
  //Handle Logout Button
  const handleLogoutBtn = async () => {
    await axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        localStorage.clear();
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.error);
      });
  };

  return (
    <div className="px-5 xl:px-50 py-5 flex-col pt-12 flex gap-5 w-full mt-5 bg-gray-100">
      <div className="flex justify-between">
        {/*Left-Section */}

        <div className="w-full md:w-[70%]">
          {/*User-Section */}
          <div>
            <Card padding={0}>
              <div className="w-full h-fit">
                <div className="relative w-full h-[200px]">
                  {userData?._id == ownData?._id && (
                    <div
                      className="absolute cursor-pointer top-3 right-3 z-20 w-[35px] flex justify-center items-center h-[35px] rounded-full p-3 bg-white"
                      onClick={handleEditCoverModal}
                    >
                      <EditIcon />
                    </div>
                  )}
                  <img
                    src={userData?.cover_pic}
                    className="w-full h-[200px] rounded-tr-lg rounded-tl-lg"
                  />
                  <div
                    onClick={handleCircularCoverModal}
                    className="absolute object-cover top-24 left-6 z-10"
                  >
                    <img
                      src={userData?.profile_pic}
                      className="w-35 h-35 border-2 cursor-pointer border-white rounded-full"
                    />
                  </div>
                </div>

                <div className="mt-10 relative px-8 py-2">
                  {userData?._id == ownData?._id && (
                    <div
                      className="absolute cursor-pointer top-3 right-3 z-20 w-[35px] flex justify-center items-center h-[35px] rounded-full p-3 bg-white"
                      onClick={handleInfoModal}
                    >
                      <EditIcon />
                    </div>
                  )}
                  <div className="w-full">
                    <div className="text-2xl">{userData?.f_name}</div>
                    <div className="text-gray-700">{userData?.headline}</div>
                    <div className="text-gray-500 text-sm">
                      {userData?.curr_location}
                    </div>
                    <div className="text-md text-blue-800 w-fit cursor-pointer hover:underline">
                      {userData?.friends?.length} Connections
                    </div>

                    {/*Button */}

                    <div className="md:flex w-full justify-between">
                      <div className="my-5 gap-5 flex">
                        <div className="cursor-pointer p-2 border-1 rounded-lg bg-blue-800 text-white font-semibold">
                          Open to
                        </div>
                        <div
                          className="cursor-pointer p-2 border-1 rounded-lg bg-blue-800 text-white font-semibold"
                          onClick={handleShareBtn}
                        >
                          Share
                        </div>
                        {userData?._id === ownData?._id && (
                          <div
                            className="cursor-pointer p-2 border-1 rounded-lg bg-blue-800 text-white font-semibold"
                            onClick={handleLogoutBtn}
                          >
                            Logout
                          </div>
                        )}
                      </div>

                      <div className="my-5 gap-5 flex">
                        {myFriend() ? (
                          <div
                            onClick={handleMessageModal}
                            className="cursor-pointer p-2 border-1 rounded-lg bg-blue-800 text-white font-semibold"
                          >
                            Message
                          </div>
                        ) : null}
                        {userData?._id !== ownData?._id ? (
                          <div
                            onClick={handleSendFriendRequest}
                            className="cursor-pointer p-2 border-1 rounded-lg bg-blue-800 text-white font-semibold"
                          >
                            {checkFriendStatus()}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/*About-Section */}
          <div className="my-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl">About</div>
                {userData?._id === ownData?._id && (
                  <div onClick={handleAboutModal} className="cursor-pointer">
                    <EditIcon />
                  </div>
                )}
              </div>
              <div className="text-gray-700 text-md w-[80%]">
                {userData?.about}
              </div>
            </Card>
          </div>

          {/*Skill-Section */}
          <div className="my-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl">Skill</div>
              </div>
              <div className="my-5 gap-5 flex flex-wrap">
                {userData?.skills?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="cursor-pointer p-2 border-1 rounded-lg gap-3 bg-blue-800 text-white font-semibold"
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/*Activity-Section */}
          <div className="mt-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl">Activities</div>
              </div>

              <div className="cursor-pointer px-3 py-1 w-fit border-1 rounded-4xl bg-green-800 text-white font-semibold">
                Posts
              </div>

              {/*Activity-Section-{Parent Div for Scroll Activity Post} */}

              <div className="overflow-x-auto my-2 flex gap-3 overflow-y-hidden w-full">
                {postData.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() =>
                        navigate(`/profile/${id}/activities/${item?._id}`)
                      }
                      className="shrink-0 cursor-pointer w-[350px] h-[560px]"
                    >
                      <Post profile={1} item={item} personalData={ownData} />
                    </div>
                  );
                })}
              </div>
              {postData.length > 0 ? (
                <div className="w-full mt-3 flex justify-center items-center">
                  <Link
                    to={`/profile/${id}/activities`}
                    className="p-2 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-300"
                  >
                    Show All Posts <ArrowRightAltSharpIcon />
                  </Link>
                </div>
              ) : (
                <div className="flex justify-center text-gray-400">
                  No Activities
                </div>
              )}
            </Card>
          </div>

          {/*Experience-Section */}
          <div className="mt-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl">Experience</div>
                {userData?._id === ownData?._id && (
                  <div
                    onClick={handleExperienceModal}
                    className="cursor-pointer"
                  >
                    <AddIcon />
                  </div>
                )}
              </div>
              {/*Experience-Section-{Writing Section} */}
              {userData?.experience.length > 0 ? (
                <div className="mt-5">
                  {userData?.experience?.map((item, index) => {
                    return (
                      <div className="p-2 border-t-1 border-gray-300 flex justify-between">
                        <div>
                          <div className="text-lg">
                            {item.designation ? item.designation : null}
                          </div>
                          <div className="text-sm">
                            {item.company_name ? item.company_name : null}
                          </div>
                          <div className="text-sm">
                            {item.duration ? item.duration : null}
                          </div>
                          <div className="text-sm">
                            {item.location ? item.location : null}
                          </div>
                        </div>
                        {userData?._id === ownData?._id && (
                          <div
                            onClick={() => {
                              updateExperienceEdit(item._id, item);
                            }}
                            className="cursor-pointer"
                          >
                            <EditIcon />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex justify-center text-gray-400">
                  No Experience mention
                </div>
              )}
            </Card>
          </div>
        </div>

        {/*Right-Section */}

        <div className="hidden md:flex md:w-[28%]">
          <div className="sticky top-19">
            <Advertisement />
          </div>
        </div>
      </div>

      {imageModal && (
        <Modal title="Upload image" closeModal={handleImageModalOpenClose}>
          <ImageModal
            handleEditFunc={handleEditFunc}
            isCircular={circular}
            userData={ownData}
          />
        </Modal>
      )}

      {infoModal && (
        <Modal title="Edit" closeModal={handleInfoModal}>
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
        <Modal title="Edit Experience" closeModal={handleMessageModal}>
          <MessageModal selfData={ownData} userData={userData} />
        </Modal>
      )}
      <ToastContainer />
    </div>
  );
};

export default Profile;
