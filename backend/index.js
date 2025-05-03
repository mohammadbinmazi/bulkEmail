// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");
// const { scheduleEmailsFromFile } = require("./utils/scheduler");
// const emailRoutes = require("./routes/emailRoutes");

// dotenv.config();
// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Routes
// app.use(emailRoutes);

// // Schedule checker
// setInterval(() => {
//   scheduleEmailsFromFile();
// }, 60 * 1000);

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });
const express = require("express");
const dotenv = require("dotenv");
const { scheduleEmailsFromFile } = require("./utils/scheduler");
const emailRoutes = require("./routes/emailRoutes");
const globalMiddleware = require("./middleware/globalMiddleware");

dotenv.config();
const app = express();
const PORT = 5000;

// Apply global middleware
globalMiddleware(app);

// Routes
app.use(emailRoutes);

// Schedule checker every minute
setInterval(scheduleEmailsFromFile, 60 * 1000);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
