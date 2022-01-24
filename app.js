const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const port = process.env.PORT || 3001;

require("dotenv").config();

// middlewares

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);

app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

const routes = require("./server/routes/carRoutes.js");
app.use("/", routes);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
