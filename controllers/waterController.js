"use strict";
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("../config/database").connect();
const waterModel = require("../model/water");
const waterModelSP = require("../model/scraperWater");
const moment = require("moment");

const validateMethod = (vd) => {
  let errMsg = "";
  for (const [key, value] of Object.entries(vd)) {
    if (value == null || value == "" || value == []) {
      errMsg += key + " ";
    }
  }
  return errMsg;
};

const checkPlace = (place) => {
  let checkPlace_ = false;
  let index_ = -1;
  for (let i = 0; i < waterModelSP.place.length; i++) {
    if (place == waterModelSP.place[i].collection.collectionName) {
      index_ = i;
      checkPlace_ = true;
      break;
    }
  }
  return [checkPlace_, index_];
};
const getWaterData = async (req, res, next) => {
  try {
    const param = req.params.place;
    const body = req.body;
    const waterDataArray = [];
    let haveBodyReq = Object.keys(body).length == 0 ? false : true;
    let responseData = {};
    let waterData;
    if (param === "WatKhlongKhuan") {
      if (haveBodyReq) {
        waterData = await waterModel.place1
          .find({
            $and: [
              { Date: { $gte: new Date(body.startDate) } },
              { Date: { $lte: new Date(body.endDate) } },
            ],
          })
          .sort({ Date: "desc" });
      } else {
        waterData = await waterModel.place1.find({}).sort({ Date: "desc" });
      }
      let data = waterData.length == 0 ? false : true;
      if (data) {
        waterData.forEach((doc) => {
          const watKhlongKhuan = {
            Date: moment(doc.Date).format("DD-MM-YYYY HH:mm"),
            Temperature: doc.Temperature,
            pH: doc.pH,
            EC: doc.EC,
            place: doc.place,
          };
          waterDataArray.push(watKhlongKhuan);
        });
        responseData = {
          statusCode: "20000",
          statusMessage: "Success",
          rowCount: String(waterDataArray.length),
          ResponseData: waterDataArray,
        };
      } else {
        responseData = {
          statusCode: "40400",
          statusMessage: "No Data at WatKhlongKhuan record found",
        };
      }
    } else if (param === "President_of_Community_Enterprise_House") {
      if (haveBodyReq) {
        waterData = await waterModel.place2
          .find({
            $and: [
              { Date: { $gte: new Date(body.startDate) } },
              { Date: { $lte: new Date(body.endDate) } },
            ],
          })
          .sort({ Date: "desc" });
      } else {
        waterData = await waterModel.place2.find({}).sort({ Date: "desc" });
      }
      let data = waterData.length == 0 ? false : true;
      if (data) {
        waterData.forEach((doc) => {
          const presidentOfCommunityEnterpriseHouse = {
            Date: moment(doc.Date).format("DD-MM-YYYY HH:mm"),
            Temperature: doc.Temperature,
            pH: doc.pH,
            EC: doc.EC,
            place: doc.place,
          };
          waterDataArray.push(presidentOfCommunityEnterpriseHouse);
        });
        responseData = {
          statusCode: "20000",
          statusMessage: "Success",
          ResponseData: waterDataArray,
        };
      } else {
        responseData = {
          statusCode: "40300",
          statusMessage: "Missing or Invalid Parameter",
        };
      }
    }
    res.send(responseData);
  } catch (error) {
    res.json({
      statusCode: "4000",
      statusMessage: "Failed",
      message: error,
    });
  }
};

const getHistoryWaterTable = async (req, res) => {
  try {
    let validateData = {
      place: req.params.place,
    };
    const errMsg = validateMethod(validateData);
    if (errMsg.length > 0) {
      res.json({
        statusCode: "4003",
        statusMessage: "Failed",
        message: "Missing or Invalid Parameter : " + errMsg,
      });
      return;
    } else {
      // if (
      //   checkPlace(req.params.place)[0] &&
      //   checkPlace(req.params.place)[1] >= 0
      // ) {
        // let waterData = await waterModelSP.place[
        //   checkPlace(req.params.place)[1]
        // ].find({});
        let waterData = await waterModel.place1.find({});
        let responseDataList = [];
        for (const element of waterData) {
          let data = {
            date: moment(element.Date).format("YYYY-MM-DD HH:mm"),
            waterData: {
              temperature: element.Temperature,
              ph: element.pH,
              ec: element.EC,
              salinity: (Number.parseFloat(element.EC * 0.64) / 1000).toFixed(
                5
              ), // salinity = (ec*0.64)/1000
            },
            place: element.place,
          };
          responseDataList.push(data);
        }
        res.json({
          statusCode: "2000",
          statusMessage: "Succuss",
          responseDataList: responseDataList,
        });
      // } else {
      //   res.json({
      //     statusCode: "2001",
      //     statusMessage: "Failed",
      //     message: "Can't find this place",
      //   });
      // }
    }
  } catch (error) {
    res.json({
      statusCode: "4000",
      statusMessage: "Failed",
      message: error,
    });
  }
};

const getHistoryWaterTableFilterByPlaceOrDate = async (req, res) => {
  try {
    let waterData;
    let responseDataList = [];
    let startDate =
      req.body.startDate != "" && req.body.startDate != null ? true : false;
    let endDate =
      req.body.endDate != "" && req.body.endDate != null ? true : false;
    let place = req.body.place != "" && req.body.place != null ? true : false;

    if (!startDate && !endDate && place) {
      // if (checkPlace(req.body.place)[0]) {
        waterData = await waterModel.place1.find({});
        for (const element of waterData) {
          let data = {
            date: moment(element.Date).format("YYYY-MM-DD HH:mm"),
            waterData: {
              temperature: element.Temperature,
              ph: element.pH,
              ec: element.EC,
              salinity: (Number.parseFloat(element.EC * 0.64) / 1000).toFixed(
                5
              ), //salinity = (ec*0.64)/1000
            },
            place: element.place,
          };
          responseDataList.push(data);
        }
        res.json({
          statusCode: "2000",
          statusMessage: "Succuss",
          responseDataList: responseDataList,
        });
      // } else {
      //   res.json({
      //     statusCode: "2001",
      //     statusMessage: "Failed",
      //     message: "Can't find this place",
      //   });
      // }
    } else if (startDate && endDate) {
      if (!place) {
        // let temp = [];
        // for (let i = 0; i < waterModelSP.place.length; i++) {
          waterData = await waterModel.place1
            .find({
              $and: [
                { Date: { $gte: new Date(req.body.startDate) } },
                { Date: { $lte: new Date(req.body.endDate) } },
              ],
            })
            .sort({ Date: "desc" });
          // temp = temp.concat(waterData);
        // }
        for (const element of waterData) {
          let data = {
            date: moment(element.Date).format("YYYY-MM-DD HH:mm"),
            waterData: {
              temperature: element.Temperature,
              ph: element.pH,
              ec: element.EC,
              salinity: (Number.parseFloat(element.EC * 0.64) / 1000).toFixed(
                5
              ), // salinity = (ec*0.64)/1000
            },
            place: element.place,
          };
          responseDataList.push(data);
        }
        res.json({
          statusCode: "2000",
          statusMessage: "Succuss",
          responseDataList: responseDataList,
        });
      } else {
        // if (checkPlace(req.body.place)[0]) {
          waterData = await waterModel.place1.find({
              $and: [
                { Date: { $gte: new Date(req.body.startDate) } },
                { Date: { $lte: new Date(req.body.endDate) } },
              ],
            })
            .sort({ Date: "desc" });
          for (const element of waterData) {
            let data = {
              date: moment(element.Date).format("YYYY-MM-DD HH:mm"),
              waterData: {
                temperature: element.Temperature,
                ph: element.pH,
                ec: element.EC,
                salinity: (Number.parseFloat(element.EC * 0.64) / 1000).toFixed(
                  5
                ), // salinity = (ec*0.64)/1000
              },
              place: element.place,
            };
            responseDataList.push(data);
          }
          res.json({
            statusCode: "2000",
            statusMessage: "Succuss",
            responseDataList: responseDataList,
          });
        // } else {
        //   res.json({
        //     statusCode: "2001",
        //     statusMessage: "Failed",
        //     message: "Can't find this place",
        //   });
        // }
      }
    }
  } catch (error) {
    res.json({
      statusCode: "4000",
      statusMessage: "Failed",
      message: error,
    });
  }
};

const getRealtimeWaterGraph = async (req, res) => {
  try {
    let validateData = {
      place: req.params.place,
    };
    const errMsg = validateMethod(validateData);
    if (errMsg.length > 0) {
      res.json({
        statusCode: "4003",
        statusMessage: "Failed",
        message: "Missing or Invalid Parameter : " + errMsg,
      });
      return;
    } else {
      // if (
      //   checkPlace(req.params.place)[0] &&
      //   checkPlace(req.params.place)[1] >= 0
      // ) {
          let waterData = await waterModel.place1
          
          .find({ $and: [
            { Date: { $gte: new Date(new Date().setHours(0,0,0,0)) } },
            { Date: { $lte: new Date() } },
          ],
        })
        .sort({ Date: "desc" });
          let responseDataList = [];
          for (const element of waterData) {
            let data = {
              date: moment(element.Date).format("YYYY-MM-DD HH:mm"),
              waterData: {
                temperature: element.Temperature,
                ph: element.pH,
                ec: element.EC,
                salinity: (Number.parseFloat(element.EC * 0.64) / 1000).toFixed(
                  5
                ), // salinity = (ec*0.64)/1000
              },
              place: element.place,
            };
            responseDataList.push(data);
      }
      res.json({
        statusCode: "2000",
        statusMessage: "Succuss",
        responseDataList: responseDataList,
      });
      // } else {
      //   res.json({
      //     statusCode: "2001",
      //     statusMessage: "Failed",
      //     message: "Can't find this place",
      //   });
      // }
    }
  } catch (error) {
    res.json({
      statusCode: "4000",
      statusMessage: "Failed",
      message: error,
    });
  }
};

module.exports = {
  getWaterData,
  getHistoryWaterTable,
  getHistoryWaterTableFilterByPlaceOrDate,
  getRealtimeWaterGraph,
};
