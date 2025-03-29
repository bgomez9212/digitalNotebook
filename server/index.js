const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use("/*", (req, res) => {
  try {
    axios({
      method: req.method,
      url: `http://localhost:3000/api${req._parsedUrl.pathname}`,
      params: req.query,
      data: req.body,
    })
      .then((response) => res.json(response.data))
      .catch((err) =>
        res.status(err.response.status).json(err.response.data.error)
      );
  } catch (err) {
    console.error(err);
    res.status(500).json("An internal error has occured");
  }
});

app.listen(port, () => {
  console.log("server listening");
});
