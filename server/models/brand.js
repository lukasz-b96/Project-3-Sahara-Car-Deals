const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "this field is requierd",
  },
  image: {
    type: String,
    required: "this field is requierd",
  },
});
module.exports = mongoose.model("brand", brandSchema);
