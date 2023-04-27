const express = require("express");
const cors = require("cors");
var fs = require("fs");
require("./src/db/MongoDB");

// Router
const userRouter = require("./src/router/user.router");

// Create Server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: true, credentials: true }));

// Use Router
app.use(userRouter);

// Default Route
app.get("/", (req, res) => {
  res.writeHead(200);
  fs.readFile("./src/pages/index.html", function (error, contents) {
    res.write(contents);
    res.end();
  });
});

// server port define
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
