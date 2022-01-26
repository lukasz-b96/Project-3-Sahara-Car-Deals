const mongoose = require("mongoose");
require("./brand");
require("./car");

mongoose
  .connect(process.env.MDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log("db auth error"));

mongoose.connection.on(
  "error",
  console.error.bind(console, "connection error")
);
mongoose.connection.once("open", () => {
  console.log("connected");
});
