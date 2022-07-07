const express = require("express");
const { getWaterData,getHistoryWaterTable ,getHistoryWaterTableFilterByPlaceOrDate,getRealtimeWaterGraph} = require("../controllers/waterController");
const { scrape } = require("../controllers/Scraper");
const { addPlaceDropdown ,updatePlaceDropdown,getPlaceDropdown} = require("../controllers/placeController");
// const { app } = require("../controllers/Scraper");

const router = express.Router();

router.get("/water/:place", getWaterData);
router.get("/history/water/:place",getHistoryWaterTable);
router.get("/dropdown/:place/place/:lang",getPlaceDropdown);
router.get("/realtime/water/oneGraph/:place",getRealtimeWaterGraph);

router.post("/waterTest",scrape);
router.post("/water/:place", getWaterData);
router.post("/dropdown/place" ,addPlaceDropdown);
router.post("/history/water" ,getHistoryWaterTableFilterByPlaceOrDate);

router.put("/dropdown/place" ,updatePlaceDropdown);

module.exports =  router
