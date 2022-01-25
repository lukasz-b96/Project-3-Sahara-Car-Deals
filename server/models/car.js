const mongoose = require("mongoose");
const models = [
  "DB11",
  "DBX",
  "Vantage",
  "Bentayga",
  "Continental GT",
  "Flying Spur",
  "XF",
  "F-Type",
  "F-Pace",
  "Defender",
  "Discovery",
  "Evoque",
  "Artura",
  "720S",
  "Senna",
];
const carSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      enum: ["Aston Martin", "Bentley", "Jaguar", "Land Rover", "McLaren"],
      required: "this field is requierd",
      text:true
    },
    model: {
      type: String,
      enum: models,
      required: "this field is requierd",
      text:true
    },
    description: {
      type: String,
      text:true
    },
    phone: {
      type: String,
      required: "this field is requierd",
    },
    image: {
      type: String,
      required: "this field is requierd",
    },
    price: {
      type: Number,
      required: "this field is requierd",
    },
    fixedPrice: {
      type: String,
      default: "",
    },
    year:{
      type: Number,
      required: "this field is requierd",
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Car", carSchema);
