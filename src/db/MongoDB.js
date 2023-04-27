const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://localhost:27017/CardanoNFT", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"))
  .catch((err) => {
    console.log(err);
    console.log("Error connecting DB!");
  });

module.exports = mongoose;
