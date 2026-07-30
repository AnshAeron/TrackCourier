import axios from "axios";
import { normalizeABCStar } from "../normalizers/abcstar.normalizer.js";

export const trackABCStar = async (trackingNo, trackingBaseUrl) => {
  try {
    const response = await axios.post(
      "https://www.abcstar.in/api/track",
      {
        api_key: process.env.ABCSTAR_API_KEY,
        awb_no: trackingNo,
      },
      {
        headers: {
          Authorization: `Basic ${process.env.ABCSTAR_AUTH}`,
          "Content-Type": "application/json",
        },
      },
    );

    return normalizeABCStar(response.data, trackingBaseUrl);
  } catch (error) {
    console.error("ABCStar API Error:", error.response?.data || error.message);
    throw error;
  }
};
