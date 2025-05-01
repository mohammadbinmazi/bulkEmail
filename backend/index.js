const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Setup transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send-emails", async (req, res) => {
  const { emails, message } = req.body;

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: "No emails provided" });
  }

  try {
    const info = await Promise.all(
      emails.map((email) =>
        transporter.sendMail({
          from: `"Mohammad bin mazi" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Founder Mohammad Bin mazi",
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
