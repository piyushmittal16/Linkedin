import React from "react";
import Card from "../card/Card";
import { Link } from "react-router-dom";

const ProfileCard = (props) => {
  return (
    <Card padding={0}>
      <div className="relative h-25">
        <Link
          to={`/profile/${props?.data?._id}`}
          className="relative w-full h-22 rounded-md"
        >
          <img
            src={props?.data?.cover_pic}
            className="rounded-t-md h-full w-full"
          />
        </Link>
        <Link
          to={`/profile/${props?.data?._id}`}
          className="absolute top-14 left-6 z-10"
        >
          <img
            src={props.data?.profile_pic}
            className="rounded-4xl border-2 h-16 w-16 border-white cursor-pointer"
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
