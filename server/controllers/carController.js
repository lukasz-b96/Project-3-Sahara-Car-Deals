require("../models/database");
const Brand = require("../models/brand");

// GET /
// HomePage

exports.homepage = async (req, res) => {
  try {
    const limit = 5;
    const brands = await Brand.find({}).limit(limit);

    res.render("index", { title: "CarDeals - Home", brands });
  } catch (error) {
    res.status(500).send({ message: error.message || "error occur" });
  }
};

// async function insertDummyCategoryData() {
//   try {
//     await Category.insertMany([
//       {
//         name: "Pagani",
//         image: "Pagani.png",
//       },
//       {
//         name: "Bentley",
//         image: "Bentley.png",
//       },
//       {
//         name: "Jaguar",
//         image: "Jaguar.png",
//       },
//       {
//         name: "Land Rover",
//         image: "LandRover.png",
//       },
//       {
//         name: "McLaren",
//         image: "McLaren.png",
//       },
//     ]);
//   } catch (error) {
//     console.log(error);
//   }
// }

// insertDummyCategoryData();
