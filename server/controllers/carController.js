// GET /
// HomePage

exports.homepage = async (req, res) => {
  res.render("index", { title: "CarDeals - Home" });
};
