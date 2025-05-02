import React, { useState } from "react";
import { sendBulkEmail, scheduleBulkEmail } from "../services/api";

const Form = () => {
  const [singleEmail, setSingleEmail] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [sendOption, setSendOption] = useState("now"); // "now" or "schedule"
  const [sendAt, setSendAt] = useState(""); // ISO datetime string

  const handleAddEmail = () => {
    if (singleEmail && /\S+@\S+\.\S+/.test(singleEmail)) {
      setEmailList([...emailList, singleEmail]);
      setSingleEmail("");
    } else {
      setStatus("❌ Invalid email format");
    }
  };

  const removeEmail = (index) => {
    const newList = [...emailList];
    newList.splice(index, 1);
    setEmailList(newList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    if (emailList.length === 0) {
      setStatus("⚠️ No emails added!");
      return;
    }
    if (!subject.trim()) {
      setStatus("⚠️ Subject can't be empty!");
      return;
    }
    if (!message.trim()) {
      setStatus("⚠️ Message can't be empty!");
      return;
    }

    if (sendOption === "schedule" && !sendAt) {
      setStatus("⚠️ Please choose a date and time to schedule the email.");
      return;
    }

    try {
      let result;

      if (sendOption === "now") {
        result = await sendBulkEmail(emailList, subject, message);
      } else {
        result = await scheduleBulkEmail(emailList, subject, message, sendAt);
      }

      if (result.success) {
        setStatus(
          `✅ Emails ${
            sendOption === "now" ? "sent" : "scheduled"
          } successfully!`
        );
        setEmailList([]);
        setSubject("");
        setMessage("");
        setSendAt("");
      } else {
        setStatus("❌ Operation failed.");
      }
    } catch (error) {
      setStatus("⚠️ Something went wrong.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Email Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="email"
          placeholder="Enter a single email"
          value={singleEmail}
          onChange={(e) => setSingleEmail(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="button"
          onClick={handleAddEmail}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          ➕ Add
        </button>
      </div>

      {/* Email List */}
      {emailList.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">📬 Emails to Send:</h4>
          <ul className="space-y-1 max-h-32 overflow-y-auto border p-2 rounded-md bg-gray-50">
            {emailList.map((email, index) => (
              <li
                key={index}
                className="flex justify-between items-center text-sm bg-white px-3 py-1 border rounded"
              >
                <span>{email}</span>
                <button
                  type="button"
                  onClick={() => removeEmail(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Send Options */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">📅 Send Option:</label>
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              value="now"
              checked={sendOption === "now"}
              onChange={() => setSendOption("now")}
              className="mr-2"
            />
            Send Now
          </label>
          <label>
            <input
              type="radio"
              value="schedule"
              checked={sendOption === "schedule"}
              onChange={() => setSendOption("schedule")}
              className="mr-2"
            />
            Schedule
          </label>
        </div>
      </div>

      {/* Schedule Time Input */}
      {sendOption === "schedule" && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">⏰ Schedule Time:</label>
          <input
            type="datetime-local"
            value={sendAt}
            onChange={(e) => setSendAt(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter email subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          🚀 {sendOption === "now" ? "Send" : "Schedule"} Email to{" "}
          {emailList.length} Recipient(s)
        </button>
      </form>

      {status && (
        <p className="mt-4 text-center font-medium text-gray-700">{status}</p>
      )}
    </div>
  );
};

export default Form;
