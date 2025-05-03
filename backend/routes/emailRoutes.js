const express = require("express");
const {
  sendEmailsNow,
  scheduleEmails,
} = require("../controllers/emailControllers");

const router = express.Router();

router.post("/send-emails", sendEmailsNow);
router.post("/schedule-email", scheduleEmails);

module.exports = router;
