import React from "react";
import Card from "../card/Card";
import { Link } from "react-router-dom";

const ProfileCard = (props) => {
  return (
    <Card padding={0}>
      <div className="relative h-25">
        <Link
          to={props?.data?._id ? `/profile/${props.data._id}` : "#"}
          className="relative w-full h-22 rounded-md"
        >
          <img
            src={
              props?.data?.cover_pic ||
              "https://img.freepik.com/free-photo/gradient-dark-blue-futuristic-digital-grid-background_53876-129728.jpg"
            }
            className="rounded-t-md h-full w-full object-cover"
            alt="cover"
            onError={(e) => {
              e.target.src =
                "https://img.freepik.com/free-photo/gradient-dark-blue-futuristic-digital-grid-background_53876-129728.jpg";
            }}
          />
        </Link>
        <Link
          to={props?.data?._id ? `/profile/${props.data._id}` : "#"}
          className="absolute top-14 left-6 z-10"
        >
          <img
            src={
              props.data?.profile_pic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            className="rounded-4xl border-2 h-16 w-16 border-white cursor-pointer object-cover"
            alt="profile"
            onError={(e) => {
              e.target.src =
                "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            }}
          />
        </Link>
      </div>
      <div className="p-5">
        <div className="text-xl">{props?.data?.f_name}</div>
        <div className="text-sm my-1">{props?.data?.headline}</div>
        <div className="text-sm my-1">{props?.data?.curr_location}</div>
        <div className="text-sm my-1">{props?.data?.curr_company}</div>
      </div>
    </Card>
  );
};

export default ProfileCard;
