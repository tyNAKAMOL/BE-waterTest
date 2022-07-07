const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");

const path = require("path");
const moment = require("moment");
const waterModel = require("./model/water");
const waterModel_Scraper = require("./model/scraperWater");

require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("./config/database").connect();
const waterRoutes = require("./routes/water-routes");
const placeRoutes = require("./routes/placeRoutes");

const { PORT } = process.env;
const auth = "Bearer WaU5IremgQ6LahhWKoFsbgmVSdbkz7ZUmX9EumiatGP";

setInterval(function () {
  axios
    .get(
      "https://magellan.ais.co.th/pullmessageapis/api/listen/thing/9FFB16BDD38B7F2BE9674BF88FE48D15"
    )
    .then(async function (res) {
      console.log("respone : ", res.status, res.statusText);
      if (res.status == 200 && res.statusText == "OK") {
        console.log(res.status);
        waterModel.place1.create({
          Date: new Date(),
          Temperature: res.data.Sensor.temperature
            ? res.data.Sensor.temperature
            : null,
          pH: res.data.Sensor.pH ? res.data.Sensor.pH : null,
          EC: res.data.Sensor.EC ? res.data.Sensor.EC : null,
          place: "WatKhlongKhuan",
        });
      }
    })
    .catch(function (error) {
      console.log("error is : " + error);
    });
}, 3600000);

setInterval(function () {
  let name = [
    "WatBangKhang",
    "WatMunLek",
    "SaPhaNayoThaKa",
    "WatBangTaen",
    "WatPakKhlongBangKhanak",
    "BangKraChet",
    "WatMaiBangKhla",
    "KhueanBangPakong",
    "MueangChachoengsao",
    "ChonlaprathanChachoengsao",
  ];
  const params = {
    fromdate: "-",
    todate: "-",
  };

  axios
    .post(
      "http://wq-prachin-bangpakong.rid.go.th/Home/StationDatawaterTotal",
      params
    )
    .then(async function (res) {
      if (res.status == 200 && res.statusText == "OK") {
        for (let i = 0; i < res.data.length; i++) {
          waterModel_Scraper.place[i].create({
            Date: new Date(),
            Temperature: res.data[i].Temp,
            pH: res.data[i].pH,
            EC: res.data[i].DataConductivity,
            place: name[i],
          });
        }
      }
    })
    .catch(function (error) {
      console.log("error is : " + error);
    });
}, 3600000);

// setInterval(function () {
//   axios
//     .get(
//       "https://magellan.ais.co.th/pullmessageapis/api/listen/thing/9FFB16BDD38B7F2BE9674BF88FE48D15"
//     )
//     .then(async function (res) {
//       const message =
//         "ส่งข้อมูลจากวัดคลองเขื่อน (tested by Ty)\n" +
//         "วันที่ " +
//         moment(new Date()).format("DD/MM/YYYY") +
//         "\n" +
//         "เวลา " +
//         moment(new Date()).format("HH:mm") +
//         "\n" +
//         "อุณหภูมิ: " +
//         res.data.Sensor.temperature +
//         " " +
//         "องศาเซลเซียล" +
//         "\n" +
//         "พีเอช: " +
//         res.data.Sensor.pH +
//         "\n" +
//         "ความเค็ม: " +
//         ((res.data.Sensor.EC * 0.64) / 1000).toFixed(2) +
//         "(" +
//         res.data.Sensor.EC +
//         ")" +
//         "มิลลิกรัม/ลิตร";

//       const headers = {
//         "Content-Type": "application/x-www-form-urlencoded",
//         Authorization: auth,
//       };
//       const payload = {
//         message: message,
//       };

//       let formBody = [];
//       for (const property in payload) {
//         let key = encodeURIComponent(property);
//         let value = encodeURIComponent(payload[property]);
//         formBody.push(`${key}=${value}`);
//       }
//       formBody = formBody.join("&");

//       axios
//         .post("https://notify-api.line.me/api/notify", formBody, {
//           headers: headers,
//         })
//         .then(function (response) {
//           console.log("res : " + response);
//         })
//         .catch(function (error) {
//           console.log("error : " + error);
//         });
//     });
// }, 900000);

app.use(express.json());
app.use(cors());
app.use("/api", waterRoutes);
// app.use(placeRoutes.routes);

app.listen(PORT, () => {
  console.log(`server start at port ${PORT}...`);
});
