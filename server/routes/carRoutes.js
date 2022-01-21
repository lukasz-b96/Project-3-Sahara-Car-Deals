const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");

router.get("/", carController.homepage);

module.exports = router;
