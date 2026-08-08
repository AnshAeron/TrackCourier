import axios from "axios";
import { normalizeABCStar } from "../normalizers/abcstar.normalizer.js";

export const trackABCStar = async (trackingNo, trackingBaseUrl) => {
  try {
    const awb = String(trackingNo || "").trim();

    console.log("======================================");
    console.log("ABCStar Tracking Request");
    console.log("AWB:", `"${awb}"`);

    const response = await axios.post(
      "https://www.abcstar.in/api/track",
      {
        api_key: process.env.ABCSTAR_API_KEY,
        awb_no: awb,
      },
      {
        headers: {
          Authorization: `Basic ${process.env.ABCSTAR_AUTH}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("========== ABCSTAR RESPONSE ==========");
    console.log(JSON.stringify(response.data, null, 2));

    return normalizeABCStar(response.data, trackingBaseUrl);
  } catch (error) {
    console.error("========== ABCSTAR API ERROR ==========");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }

    throw error;
  }
};
