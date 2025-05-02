// services/api.js
import axios from "axios";

const BASE_URL = "http://localhost:5000"; // our backend url

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
export const scheduleBulkEmail = async (emails, subject, message, sendAt) => {
  try {
    const response = await axios.post(`${BASE_URL}/schedule-email`, {
      emails,
      subject,
      message,
      sendAt,
    });
    return response.data;
  } catch (error) {
    console.error("error sending schedulebulkEmail:", error);
    throw error;
  }
};
