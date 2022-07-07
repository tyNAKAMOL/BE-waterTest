const express = require("express");
const { addPlaceDropdown } = require("../controllers/placeController");
const router = express.Router();


router.post("api/dropdown/place" ,addPlaceDropdown);

module.exports = {
    routes: router,
};