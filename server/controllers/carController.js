require("../models/database");
const Brand = require("../models/brand");
const Car = require("../models/car");
const nodemailer = require("nodemailer");

function fixedPrice(cars) {
  var newval = [];
  cars.map((x) => {
    newval.push(
      x.price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })
    );
  });
  for (const [index, element] of cars.entries()) {
    element.price = 0;
    element.fixedPrice = newval[index];
  }
  return cars;
}

exports.homepage = async (req, res) => {
  try {
    const limit = 5;
    const brands = await Brand.find({}).limit(5);
    var latest = await Car.find({}).sort({ _id: -1 }).limit(7);

    let cars = fixedPrice(latest);

    res.render("index", { title: "CarDeals - Home", brands, cars });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occur" });
  }
};

// GET /
// Brands

exports.exploreBrands = async (req, res) => {
  try {
    const limit = 10;
    const brands = await Brand.find({}).limit(limit);

    res.render("brands", { title: "CarDeals - Brands", brands });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occur" });
  }
};

exports.exploreBrandById = async (req, res) => {
  try {
    let id = req.params.id;
    if (id == "AstonMartin") {
      id = "Aston Martin";
    }
    if (id == "LandRover") {
      id = "Land Rover";
    }
    let cars = await Car.find({ brand: id });

    cars = fixedPrice(cars);

    res.render("cars", { title: "CarDeals - " + id, brand: id, cars });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occur" });
  }
};

exports.exploreCarById = async (req, res) => {
  try {
    let id = req.params.id;

    let car = await Car.findOne({ _id: id });
    var newval = car.price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
    car.fixedPrice = newval;

    res.render("car", { title: "CarDeals - Deal", car });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occur" });
  }
};
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Car.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let car = await Car.findOne().skip(random).exec();
    res.redirect("/car/" + car._id);
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.carSearch = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const re = new RegExp(searchTerm, "i");

    let cars = await Car.find().or([
      { brand: { $regex: re } },
      { model: { $regex: re } },
      { description: { $regex: re } },
    ]);

    cars = fixedPrice(cars);

    console.log(cars);
    res.render("search", { title: "CarDeals - Search", cars });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.carSubmitGet = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit", {
    title: "CarDeals - Submit",
    infoErrorsObj,
    infoSubmitObj,
  });
};

exports.carSubmitPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files where uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      });
    }

    const newCar = new Car({
      brand: req.body.brand,
      model: req.body.model,
      description: req.body.description,
      phone: req.body.phone,
      image: newImageName,
      price: req.body.price,
      year: req.body.year,
    });

    await newCar.save();

    req.flash("infoSubmit", "Car has been added.");
    res.redirect("/submit");
  } catch (error) {
    // res.json(error);
    req.flash("infoErrors", error);
    res.redirect("/submit");
  }
};
exports.contactSubmitGet = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("contact", {
    title: "CarDeals - Contact",
    infoErrorsObj,
    infoSubmitObj,
  });
};
exports.contactSubmitPost = async (req, res) => {
  console.log(process.env.USERNAME_MAIL);
  console.log(process.env.PASSWORD_MAIL);
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.USERNAME_MAIL,
        pass: process.env.PASSWORD_MAIL,
      },
    });

    // send email
    await transporter.sendMail({
      from: process.env.USERNAME_MAIL,
      to: req.body.email,
      subject: req.body.subject,
      text: req.body.description,
    });
    req.flash("infoSubmit", "E-mail has been sent.");
    res.redirect("/contact");
  } catch (error) {
    console.log(error);
    req.flash("infoErrors", error);
    res.redirect("/contact");
  }
};
exports.contactAbout = async (req, res) => {
  res.render("about", { title: "CarDeals - About" });
};

exports.exploreAllCars = async (req, res) => {
  try {
    var all = await Car.find({});

    let cars = fixedPrice(all);

    res.render("all", { title: "CarDeals - Home",  cars });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occur" });
  }
};

// insertDummyCategoryData();

// async function insertDummyCategoryData() {
//   try {
//     await Car.insertMany([
//       {
//         brand: "Aston Martin",
//         model: "DB11",
//         description: "",
//         phone: "123-456-678",
//         image: "1.jpg",
//         price: 208425,
//         year: 2022
//       },
//       {
//         brand: "Jaguar",
//         model: "F-Pace",
//         description: "Best Price !",
//         phone: "154-333-678",
//         image: "2.jpg",
//         price: 50900,
//         year: 2021
//       },
//       {
//         brand: "McLaren",
//         model: "Artura",
//         description: "The only one in Qatar",
//         phone: "843-456-678",
//         image: "3.jpg",
//         price: 1823500,
//         year: 2020
//       },
//       {
//         brand: "Bentley",
//         model: "Flying Spur",
//         description: "Nice car to have",
//         phone: "956-456-123",
//         image: "4.jpg",
//         price: 198725,
//         year: 2022
//       },
//       {
//         brand: "Bentley",
//         model: "Continental GT",
//         description: "With beatyful interior",
//         phone: "775-456-221",
//         image: "5.jpg",
//         price: 202500,
//         year: 2022
//       },
//       {
//         brand: "Jaguar",
//         model: "XF",
//         description: "Contact me!",
//         phone: "123-456-678",
//         image: "6.jpg",
//         price: 45300,
//         year: 2022,
//       },
//     ]);
//   } catch (error) {
//     console.log(error);
//   }
// }

//  insertDummyCategoryData();
