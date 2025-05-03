const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");
const transporter = require("../config/Transporter");

const scheduleFile = path.join(__dirname, "../data/scheduledEmails.json");

const scheduleEmailsFromFile = () => {
  if (!fs.existsSync(scheduleFile)) return;

  let scheduledEmails = [];
  try {
    const data = fs.readFileSync(scheduleFile, "utf8");
    scheduledEmails = data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading schedule file:", err);
    return;
  }

  scheduledEmails.forEach((emailData, index) => {
    const { email, subject, message, sendAt, sent } = emailData;
    if (sent) return;

    const scheduledTime = moment.tz(sendAt, "Asia/Kolkata");
    const now = moment().tz("Asia/Kolkata");
    const delay = scheduledTime.diff(now);

    if (delay <= 0) {
      sendScheduledEmail(email, subject, message, index);
    } else {
      setTimeout(
        () => sendScheduledEmail(email, subject, message, index),
        delay
      );
    }
  });
};

const sendScheduledEmail = (email, subject, message, index) => {
  transporter.sendMail(
    {
      from: `"Mohammad bin mazi" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: message,
    },
    (err, info) => {
      if (err) return console.error("Error sending scheduled email:", err);
      console.log(`✅ Email sent to ${email}`);
      markEmailAsSent(index);
    }
  );
};

const markEmailAsSent = (index) => {
  if (!fs.existsSync(scheduleFile)) return;

  let emails = [];
  try {
    const data = fs.readFileSync(scheduleFile, "utf8");
    emails = data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to read schedule file while marking as sent:", err);
  }

  if (emails[index]) {
    emails[index].sent = true;
    try {
      fs.writeFileSync(scheduleFile, JSON.stringify(emails, null, 2));
      console.log(`📬 Marked ${emails[index].email} as sent.`);
    } catch (err) {
      console.error("Failed to update schedule file:", err);
    }
  }
};

module.exports = { scheduleEmailsFromFile };
