const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./router.js");
const dotenv = require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server running`);
});
