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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        📤 Send Bulk Emails
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter emails (comma separated)"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          rows="6"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          🚀 Send Email
        </button>
      </form>
      {status && (
        <p className="mt-4 text-center font-medium text-gray-700">{status}</p>
      )}
    </div>
  );
};

export default Form;
