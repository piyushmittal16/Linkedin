const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    f_name: {
      type: String,
      default: "",
    },
    headline: {
      type: String,
      default: "I am Software Engineer",
    },
    curr_company: {
      type: String,
      default: "",
    },
    curr_location: {
      type: String,
      default: "",
    },
    profile_pic: {
      type: String,
      default:
        "https://e7.pngegg.com/pngimages/753/432/png-clipart-user-profile-2018-in-sight-user-conference-expo-business-default-business-angle-service-thumbnail.png",
    },
    cover_pic: {
      type: String,
      default:
        "https://img.freepik.com/free-photo/gradient-dark-blue-futuristic-digital-grid-background_53876-129728.jpg?semt=ais_hybrid&w=740",
    },
    about: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: [
      {
        designation: {
          type: String,
        },
        company_name: {
          type: String,
        },
        duration: {
          type: String,
        },
        location: {
          type: String,
        },
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    pending_friends: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      default: [], // ✅ This prevents undefined array access errors
    },

    resume: {
      type: String,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", UserSchema);
module.exports = userModel;
