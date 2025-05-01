// services/api.js
import axios from "axios";

const BASE_URL = "http://localhost:5000"; // Replace with your backend URL

export const sendBulkEmail = async (emails, message) => {
  try {
    const response = await axios.post(`${BASE_URL}/send-emails`, {
      emails,
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending bulk email:", error);
    throw error;
  }
};
