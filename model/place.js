const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  orderSeq: {
    type: String,
    required: true,
    default: "",
  },
  place: {
    type: String,
    required: true,
    default: "",
  },
  latitude: {
    type: String,
    required: true,
    default: "",
  },
  longitude: {
    type: String,
    required: true,
    default: "",
  },
  lang: {
    type: String,
    required: true,
    default: "",
  },
  fishFlag: {
    type: String,
    required: true,
    default: "",
  },
  activeFlag: {
    type: String,
    required: true,
    default: "",
  },
});

const place = mongoose.model("place", placeSchema, "Place");

module.exports = { place };
