import React, { useState } from "react";
import { sendBulkEmail } from "../services/api";

const Form = () => {
  const [singleEmail, setSingleEmail] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

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
    if (emailList.length === 0) {
      setStatus("⚠️ No emails added!");
      return;
    }
    if (!message.trim()) {
      setStatus("⚠️ Message can't be empty!");
      return;
    }

    try {
      const result = await sendBulkEmail(emailList, message);
      if (result.success) {
        setStatus("✅ Emails sent successfully!");
        setEmailList([]);
        setMessage("");
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

      <form onSubmit={handleSubmit} className="space-y-4">
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
          🚀 Send Email to {emailList.length} Recipients
        </button>
      </form>

      {status && (
        <p className="mt-4 text-center font-medium text-gray-700">{status}</p>
      )}
    </div>
  );
};

export default Form;
