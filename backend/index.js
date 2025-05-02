// const express = require("express");
// const nodemailer = require("nodemailer");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// require("dotenv").config();

// // express app is created

// const app = express();
// // the server will running on the port 5000

// const PORT = 5000;

// // app is also run cross origin

// app.use(cors());
// app.use(bodyParser.json());

// // setting the transporter using the gmail services

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // now creating the request and response of post method of app using the transporter of nodemail

// app.post("/send-emails", async (req, res) => {
//   const { emails, subject, message } = req.body;

//   if (!emails || !Array.isArray(emails) || emails.length === 0) {
//     return res.status(400).json({ error: "No emails provided" });
//   }
//   // adding the all details by using transporter of nodemailer
//   try {
//     const info = await Promise.all(
//       emails.map((email) =>
//         transporter.sendMail({
//           from: `"Mohammad bin mazi" <${process.env.EMAIL_USER}>`,
//           to: email,
//           subject: subject,
//           text: message,
//         })
//       )
//     );

//     // if all the condtion is true all data is accurate it will send succes message
//     res.json({ success: true, details: info.map((i) => i.accepted[0]) });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to send emails" });
//   }
// });

// //  the backend will listen on the port 5000 local server will run on this port

// app.listen(PORT, () => {
//   console.log(`server running on http://localhost:${PORT}`);
// });
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 5000;
const scheduleFilePath = path.join(__dirname, "scheduledEmails.json");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Import the scheduler and pass the transporter
const { scheduleEmailsFromFile } = require("./scheduler");

// Immediate email send route
app.post("/send-emails", async (req, res) => {
  const { emails, subject, message } = req.body;

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: "No emails provided" });
  }

  try {
    const info = await Promise.all(
      emails.map((email) =>
        transporter.sendMail({
          from: `"Mohammad bin mazi" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: subject,
          text: message,
        })
      )
    );
    res.json({ success: true, details: info.map((i) => i.accepted[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send emails" });
  }
});

// Schedule email route
// POST route for scheduling an email
app.post("/schedule-email", async (req, res) => {
  const { emails, subject, message, sendAt } = req.body;

  if (
    !emails ||
    !Array.isArray(emails) ||
    emails.length === 0 ||
    !subject ||
    !message ||
    !sendAt
  ) {
    return res
      .status(400)
      .json({ error: "Missing or invalid required fields" });
  }

  const scheduleFilePath = "./scheduledEmails.json";

  // Read existing scheduled emails
  let scheduledEmails = [];
  try {
    if (fs.existsSync(scheduleFilePath)) {
      const data = fs.readFileSync(scheduleFilePath, "utf8");
      scheduledEmails = data ? JSON.parse(data) : [];
    }
  } catch (error) {
    return res.status(500).json({ error: "Error reading schedule file" });
  }

  // Add each email to the schedule with sent: false
  emails.forEach((email) => {
    scheduledEmails.push({ email, subject, message, sendAt, sent: false });
  });

  // Save updated file
  try {
    fs.writeFileSync(
      scheduleFilePath,
      JSON.stringify(scheduledEmails, null, 2)
    );
    res.json({ success: true, message: "Emails scheduled successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error writing to schedule file" });
  }
});

// Start scheduled email checking every minute
setInterval(() => {
  scheduleEmailsFromFile(transporter);
}, 60 * 1000);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
