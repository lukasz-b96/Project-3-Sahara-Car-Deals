const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");

router.get("/", carController.homepage);

router.get("/brands", carController.exploreBrands);
router.get("/brands/:id", carController.exploreBrandById);
router.get("/car/:id", carController.exploreCarById);
router.post("/search", carController.carSearch)
router.get('/random', carController.exploreRandom);
router.get('/submit', carController.carSubmitGet);
router.post('/submit', carController.carSubmitPost);
router.get('/contact', carController.contactSubmitGet);
router.post('/contact', carController.contactSubmitPost);
router.get('/about', carController.contactAbout );
router.get("/car", carController.exploreAllCars);
module.exports = router;
