const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const router = require("./router.js");

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
