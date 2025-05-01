// components/EmailForm.js
import React, { useState } from "react";
import { sendBulkEmail } from "../services/api";

const Form = () => {
  const [emails, setEmails] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailArray = emails.split(",").map((email) => email.trim());

    try {
      const result = await sendBulkEmail(emailArray, message);
      if (result.success) {
        setStatus("✅ Emails sent successfully!");
      } else {
        setStatus("❌ Email send failed.");
      }
    } catch (error) {
      setStatus("⚠️ Something went wrong while sending emails.");
    }
  };

  return (
    <div>
      <h2>Send Emails</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter emails (comma separated)"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
        />
        <textarea
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button type="submit">Send</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default Form;
