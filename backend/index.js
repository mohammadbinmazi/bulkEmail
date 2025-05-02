const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// express app is created

const app = express();
// the server will running on the port 5000

const PORT = 5000;

// app is also run cross origin

app.use(cors());
app.use(bodyParser.json());

// setting the transporter using the gmail services

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// now creating the request and response of post method of app using the transporter of nodemail

app.post("/send-emails", async (req, res) => {
  const { emails, subject, message } = req.body;

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: "No emails provided" });
  }
  // adding the all details by using transporter of nodemailer
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

    // if all the condtion is true all data is accurate it will send succes message
    res.json({ success: true, details: info.map((i) => i.accepted[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send emails" });
  }
});

//  the backend will listen on the port 5000 local server will run on this port

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
