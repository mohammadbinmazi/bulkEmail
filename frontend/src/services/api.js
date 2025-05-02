// services/api.js
import axios from "axios";

const BASE_URL = "http://localhost:5000"; // Replace with your backend URL

export const sendBulkEmail = async (emails, subject, message) => {
  try {
    const response = await axios.post(`${BASE_URL}/send-emails`, {
      emails,
      subject,
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending bulk email:", error);
    throw error;
  }
};
