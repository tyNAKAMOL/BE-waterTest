const mongoose = require("mongoose");

const waterSchema_s = new mongoose.Schema({
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
const place = [
  mongoose.model("WatBangKhang", waterSchema_s,"WatBangKhang"),
  mongoose.model("WatMunLek", waterSchema_s,"WatMunLek"),
  mongoose.model("SaPhaNayoThaKa", waterSchema_s,"SaPhaNayoThaKa"),
  mongoose.model("WatBangTaen", waterSchema_s,"WatBangTaen"),
  mongoose.model("WatPakKhlongBangKhanak", waterSchema_s,"WatPakKhlongBangKhanak"),
  mongoose.model("BangKraChet", waterSchema_s,"BangKraChet"),
  mongoose.model("WatMaiBangKhla", waterSchema_s,"WatMaiBangKhla"),
  mongoose.model("KhueanBangPakong", waterSchema_s,"KhueanBangPakong"),
  mongoose.model("MueangChachoengsao", waterSchema_s,"MueangChachoengsao"),
  mongoose.model("ChonlaprathanChachoengsao", waterSchema_s,"ChonlaprathanChachoengsao"),
];

module.exports = {
  place,
};
