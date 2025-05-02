const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/*", (req, res) => {
  try {
    axios({
      method: req.method,
      url: `${process.env.API_URL}${req._parsedUrl.pathname}`,
      params: { ...req.query, apiKey: process.env.API_KEY },
      data: req.body,
    })
      .then((response) => res.json(response.data))
      .catch((err) => {
        console.error(err);
        if (err.response) {
          res
            .status(err.response.status || 500)
            .json(err.response.data?.error || "API error");
        } else if (err.request) {
          console.error("No response received:", err.request);
          res.status(503).json("Service unavailable");
        } else {
          console.error("Request setup error:", err.message);
          res.status(500).json("Request configuration error");
        }
      });
  } catch (err) {
    console.error("Proxy server error:", err);
    res.status(500).json("An internal error has occurred");
  }
});

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("server listening");
});
