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
    const brands = await Brand.find({}).limit(5);
    var latest = await Car.find({})
      .sort({
        _id: -1,
      })
      .limit(7);

    let cars = fixedPrice(latest);

    res.render("index", {
      title: "Sahara Car Deals - Home",
      brands,
      cars,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "error occur",
    });
  }
};

// GET /
// Brands

exports.exploreBrands = async (req, res) => {
  try {
    const limit = 10;
    const brands = await Brand.find({}).limit(limit);

    res.render("brands", {
      title: "Sahara Car Deals  - Brands",
      brands,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "error occur",
    });
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
    let cars = await Car.find({
      brand: id,
    });

    cars = fixedPrice(cars);

    res.render("cars", {
      title: "Sahara Car Deals - " + id,
      brand: id,
      cars,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "error occur",
    });
  }
};

exports.exploreCarById = async (req, res) => {
  try {
    const infoErrorsObj = req.flash("infoErrors");
    const infoSubmitObj = req.flash("infoSubmit");
    let id = req.params.id;

    let car = await Car.findOne({
      _id: id,
    });
    var newval = car.price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
    car.fixedPrice = newval;

    res.render("car", {
      title: "Sahara Car Deals  - Deal",
      car,
      infoErrorsObj,
      infoSubmitObj,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "error occur",
    });
  }
};
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Car.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let car = await Car.findOne().skip(random).exec();
    res.redirect("/car/" + car._id);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error Occured",
    });
  }
};

exports.carSearch = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const re = new RegExp(searchTerm, "i");

    let cars = await Car.find().or([
      {
        brand: {
          $regex: re,
        },
      },
      {
        model: {
          $regex: re,
        },
      },
      {
        description: {
          $regex: re,
        },
      },
    ]);

    cars = fixedPrice(cars);

    console.log(cars);
    res.render("search", {
      title: "Sahara Car Deals - Search",
      cars,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error Occured",
    });
  }
};

exports.carSubmitGet = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit", {
    title: "Sahara Car Deals - Submit",
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
    var d = new Date(Date.now() + 60 * 60 * 1000);
    const newCar = new Car({
      brand: req.body.brand,
      model: req.body.model,
      description: req.body.description,
      phone: req.body.phone,
      image: newImageName,
      price: req.body.price,
      year: req.body.year,
      password: req.body.password,
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
    title: "Sahara Car Deals - Contact",
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
  res.render("about", {
    title: "Sahara Car Deals - About",
  });
};

exports.exploreAllCars = async (req, res) => {
  try {
    var all = await Car.find({});

    let cars = fixedPrice(all);

    res.render("all", {
      title: "Sahara Car Deals - Home",
      cars,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "error occur",
    });
  }
};

exports.deleteCarById = async (req, res) => {
  console.log(req.params.id);
  console.log(req.body.password);
  try {
    let id = req.params.id;
    let car = await Car.findOne({
      _id: id,
    });
    if (car.password != req.body.password) {
      req.flash("infoErrors", "Passwords do not match");
      return res.redirect("/car/" + id);
    }
    await Car.deleteOne({
      _id: id,
    });
    res.redirect("/");
  } catch (error) {
    req.flash("infoErrors", error);
    res.redirect("/car/" + id);
  }
};
