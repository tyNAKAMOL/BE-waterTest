const axios = require("axios");
// const cheerio = require("cheerio");

const url = "http://wq-prachin-bangpakong.rid.go.th/Home/StationDatawaterTotal";

const result = [];

const params = {
  fromdate: "-",
  todate: "-",
};
const getStatusByColor = (color) => {
  if (color.search("black")) {
    return "ปกติ";
  } else if (color.search("orange")) {
    return "สูงกว่าเกณฑ์เฝ้าระวัง";
  } else {
    return "สูงกว่าเกณฑ์มาตรฐาน";
  }
};

const getStatusChange = (onChange) => {
  if (onChange=="Up") {
    return "เพิ่มขึ้น";
  } else if (onChange=="Down") {
    return "ลดลง";
  } else {
    return "เท่าเดิม";
  }
};
// const checkValue = (value) => {
//   if(value == "N/A"){
//     return false ,"อยู่ระหว่างบำรุงรักษา" 
//   }
//   else if(value == "-"){
//     return false ,"ไม่มีการติดตั้งอุปกรณ์"
//   }
//   return true

// }
const scrape = async (req, res) => {
  try {
    const { data } = await axios.post(url, params);
    for (const element of data) {
      console.log(element);
      let temp = {
        StationName: element.stationName,
        On_Date: element.On_Date,
        On_time: element.On_time,
        Entrance: element.Entrance,
        Salinity: {
          value: element.Salinity,
          statusChange: getStatusChange(element.StatusSalinityChage),
          status: getStatusByColor(element.colorSal),
        },
        DataConductivity: {
          value: element.DataConductivity,
          statusChange: getStatusChange(element.StatusConductivityChage),
          status: getStatusByColor(element.colorDO),
        },
        DataDo: {
          value: element.DataDo,
          statusChange: getStatusChange(element.StatusDoChage),
          status: getStatusByColor(element.colorDO),
        },
        pH: {
          value: element.pH,
          statusChange: getStatusChange(element.StatuspHChage),
          status: getStatusByColor(element.colorpH),
        },
        TDS:{
          value: element.TDS,
          status: getStatusByColor(element.colorTDS),
        },
        Temp: {
          value: element.Temp,
          statusChange: getStatusChange(element.StatusTempChage),
          status: getStatusByColor(element.colorTemp),
        },
        Level_water: {
          value: element.Level_water,
          statusChange: getStatusChange(element.StatusLevelWaterChage),
        },
        Flow: {
          value: element.Flow,
          statusChange: getStatusChange(element.StatusFlowChage),
        },
        velocity : element.velocity
      };
      result.push(temp);
    }
    // const $ = cheerio.load(data);
    res.json({ status: "200OK", result: result });
  } catch (error) {
    res.json({ status: "200ER", error: error });
  }
};

module.exports = {
  scrape,
};
