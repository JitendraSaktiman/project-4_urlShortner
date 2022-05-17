const mongoose = require("mongoose");
const URLModel = new mongoose.Schema(
  {

  longUrl: {
      type: String,
      required: true,
      trim: true,

    },

    shortUrl: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    urlCode: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,

    },


  },
  { timestamps: true }
);


module.exports = mongoose.model("URL", URLModel);