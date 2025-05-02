const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone"); // Added for time zone handling

const scheduleFile = path.join(__dirname, "scheduledEmails.json");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to read and process scheduled emails from the file
const scheduleEmailsFromFile = () => {
  if (fs.existsSync(scheduleFile)) {
    let scheduledEmails = [];

    try {
      const data = fs.readFileSync(scheduleFile, "utf8");
      scheduledEmails = data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading or parsing scheduledEmails.json:", error);
    }

    // Process each scheduled email (send them at the specified time)
    scheduledEmails.forEach((emailData, index) => {
      const { email, subject, message, sendAt, sent } = emailData;

      // If the email has already been sent, skip it
      if (sent) return;

      // Convert the sendAt time to IST (Indian Standard Time)
      const sendAtIST = moment.tz(sendAt, "Asia/Kolkata").toDate(); //

      // Convert scheduled time to IST
      const scheduledTimeIST = moment.tz(sendAt, "Asia/Kolkata");
      const nowIST = moment().tz("Asia/Kolkata");
      const delay = scheduledTimeIST.diff(nowIST);

      console.log(`Scheduled time for ${email}: ${sendAtIST}`);

      if (delay <= 0) {
        console.log(`Sending email to ${email} immediately...`);
        sendScheduledEmail(email, subject, message, index); // Pass index to remove email after sending
      } else {
        console.log(
          `Email to ${email} will be sent after ${delay} milliseconds.`
        );
        setTimeout(() => {
          sendScheduledEmail(email, subject, message, index); // Pass index to remove email after sending
        }, delay);
      }
    });
  } else {
    console.log("scheduledEmails.json file doesn't exist.");
  }
};

const sendScheduledEmail = (email, subject, message, index) => {
  transporter.sendMail(
    {
      from: `"Mohammad bin mazi" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: message,
    },
    (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.accepted);

        // After sending the email, mark it as sent by updating the file
        markEmailAsSent(index);
      }
    }
  );
};

// Mark the email as sent by updating the scheduled emails file
const markEmailAsSent = (index) => {
  if (fs.existsSync(scheduleFile)) {
    let scheduledEmails = [];

    try {
      const data = fs.readFileSync(scheduleFile, "utf8");
      scheduledEmails = data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading or parsing scheduledEmails.json:", error);
    }

    // Mark the email at the specified index as sent
    if (scheduledEmails[index]) {
      scheduledEmails[index].sent = true;

      try {
        // Update the scheduledEmails.json file with the modified data
        fs.writeFileSync(
          scheduleFile,
          JSON.stringify(scheduledEmails, null, 2)
        );
        console.log(`Marked email ${scheduledEmails[index].email} as sent.`);
      } catch (err) {
        console.error("Error updating scheduledEmails.json:", err);
      }
    }
  } else {
    console.log("scheduledEmails.json file doesn't exist.");
  }
};

// Export the function to be used in other files (like your server.js)
module.exports = { scheduleEmailsFromFile };
