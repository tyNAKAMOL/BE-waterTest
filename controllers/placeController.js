const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("../config/database").connect();
const placeModel = require("../model/place");

const validateMethod = (vd) => {
  let errMsg = "";
  for (const [key, value] of Object.entries(vd)) {
    if (value == null || value == "" || value == []) {
      errMsg += key + " ";
    }
  }
  return errMsg;
};

const addPlaceDropdown = async (req, res) => {
  try {
    let validateData = {
      place: req.body.place,
      orderSeq: req.body.orderSeq,
      latitude: req.body.coordinates.latitude,
      longitude: req.body.coordinates.longitude,
      lang: req.body.lang,
      fishFlag: req.body.fishFlag,
      activeFlag: req.body.activeFlag,
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
      let addPlaceDate = await placeModel.place.create({
        orderSeq: req.body.orderSeq,
        place: req.body.place,
        latitude: req.body.coordinates.latitude,
        longitude: req.body.coordinates.longitude,
        lang: req.body.lang,
        fishFlag: req.body.fishFlag,
        activeFlag: req.body.activeFlag,
      });
      console.log(addPlaceDate);
      if (addPlaceDate) {
        res.json({
          statusCode: "2000",
          statusMessage: "Success",
          message: "add Dropdown Success",
        });
      } else {
        res.json({
          statusCode: "2001",
          statusMessage: "Failed",
          message: "can't add Dropdown Success",
        });
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

const updatePlaceDropdown = async (req, res) => {
  try {
    let validateData = {
      place: req.body.place,
      orderSeq: req.body.orderSeq,
      latitude: req.body.coordinates.latitude,
      longitude: req.body.coordinates.longitude,
      lang: req.body.lang,
      fishFlag: req.body.fishFlag,
      activeFlag: req.body.activeFlag,
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
      let addPlaceDate = await placeModel.place.findOneAndUpdate(_id, {
        orderSeq: req.body.orderSeq,
        place: req.body.place,
        latitude: req.body.coordinates.latitude,
        longitude: req.body.coordinates.longitude,
        lang: req.body.lang,
        fishFlag: req.body.fishFlag,
        activeFlag: req.body.activeFlag,
      });
      console.log(addPlaceDate);
      if (addPlaceDate) {
        res.json({
          statusCode: "2000",
          statusMessage: "Success",
          message: "update Dropdown Success",
        });
      } else {
        res.json({
          statusCode: "2001",
          statusMessage: "Failed",
          message: "can't update Dropdown Success",
        });
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

const getPlaceDropdown = async (req, res) => {
  try {
    if (req.params.place == "water" || req.params.place == "fish") {
      let FishFlag = req.params.place == "fish" ? "Y" : "N";
      let lang = req.params.lang == "en" ? "EN" : "TH";
      let data = await placeModel.place.find({
        fishFlag: FishFlag,
        activeFlag: "Y",
        lang : lang
      });
      let dataList = [];
      for (const element of data) {
        let temp = {
          orderSeq: element.orderSeq,
          place: element.place,
          coordinates: {
            latitude: element.latitude,
            longitude: element.longitude,
          },
        };
        dataList.push(temp);
      }
      // console.log(FishFlag);
      res.json({
        statusCode: "2000",
        statusMessage: "Success",
        responseDataList: dataList,
      });
    } else {
      res.json({
        statusCode: "4003",
        statusMessage: "Failed",
        message: "Missing or Invalid Parameter is not water or fish",
      });
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
  addPlaceDropdown,
  updatePlaceDropdown,
  getPlaceDropdown,
};
