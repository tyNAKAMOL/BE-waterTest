const mongoose = require("mongoose");

const waterSchema = new mongoose.Schema({
  Date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  Temperature: {
    type: String,
    required: true,
    default: "",
  },
  pH: {
    type: String,
    required: true,
    default: "",
  },
  EC: {
    type: String,
    required: true,
    default: "",
  },
  place: {
    type: String,
    required: true,
    default: "",
  },

});
const place1 = mongoose.model(
  "water",
  waterSchema,
  "WatKhlongKhuan"
);
const place2 = mongoose.model(
  "water",
  waterSchema,
  "President_of_Community_Enterprise_House"
);
module.exports = { place1, place2 };
