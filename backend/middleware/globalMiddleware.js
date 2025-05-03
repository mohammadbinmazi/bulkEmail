// middlewares/globalMiddleware.js
const cors = require("cors");
const bodyParser = require("body-parser");

const globalMiddleware = (app) => {
  app.use(cors());
  app.use(bodyParser.json());
};

module.exports = globalMiddleware;
