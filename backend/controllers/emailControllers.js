const fs = require("fs");
const path = require("path");
const transporter = require("../config/Transporter");

const scheduleFilePath = path.join(__dirname, "../data/scheduledEmails.json");

// Controller: Send emails immediately
const sendEmailsNow = async (req, res) => {
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
          subject,
          text: message,
        })
      )
    );
    res.json({ success: true, details: info.map((i) => i.accepted[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send emails" });
  }
};

// Controller: Schedule emails
const scheduleEmails = (req, res) => {
  const { emails, subject, message, sendAt } = req.body;

  if (!emails || !Array.isArray(emails) || !subject || !message || !sendAt) {
    return res
      .status(400)
      .json({ error: "Missing or invalid required fields" });
  }

  let scheduledEmails = [];
  try {
    if (fs.existsSync(scheduleFilePath)) {
      const data = fs.readFileSync(scheduleFilePath, "utf8");
      scheduledEmails = data ? JSON.parse(data) : [];
    }
  } catch (err) {
    return res.status(500).json({ error: "Error reading schedule file" });
  }

  emails.forEach((email) => {
    scheduledEmails.push({ email, subject, message, sendAt, sent: false });
  });

  try {
    fs.writeFileSync(
      scheduleFilePath,
      JSON.stringify(scheduledEmails, null, 2)
    );
    res.json({ success: true, message: "Emails scheduled successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error writing to schedule file" });
  }
};

module.exports = { sendEmailsNow, scheduleEmails };
