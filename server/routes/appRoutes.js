const express = require("express");
const router = express.Router();
const carController = require("../controllers/appController");

router.get("/", carController.homepage);

router.get("/brands", carController.exploreBrands);
router.get("/brands/:id", carController.exploreBrandById);

router.get("/submit", carController.carSubmitGet);
router.post("/submit", carController.carSubmitPost);

router.get("/contact", carController.contactSubmitGet);
router.post("/contact", carController.contactSubmitPost);

router.get("/car", carController.exploreAllCars);
router.get("/car/:id", carController.exploreCarById);
router.post("/car/:id", carController.deleteCarById);

router.get("/random", carController.exploreRandom);
router.get("/about", carController.contactAbout);
router.post("/search", carController.carSearch);

module.exports = router;
