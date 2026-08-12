import axios from "axios";
import { normalizeM5C } from "../normalizers/m5c.normalizer.js";

export const trackM5C = async (trackingNo, trackingBaseUrl) => {
  try {
    const awb = String(trackingNo || "").trim();

    console.log("======================================");
    console.log("M5C Tracking Request");
    console.log("AWB:", `"${awb}"`);

    const response = await axios.post(
      "http://apiv2.m5clogs.com/api/Track/GetTrackings",
      {
        ValidateAccount: [
          {
            AccountCode: process.env.M5C_ACCOUNT_CODE,
            Username: process.env.M5C_USERNAME,
            Password: process.env.M5C_PASSWORD,
            AccessKey: process.env.M5C_ACCESS_KEY,
          },
        ],
        Awbno: awb,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("========== M5C RESPONSE ==========");
    console.log(JSON.stringify(response.data, null, 2));

    const normalized = normalizeM5C(response.data, trackingBaseUrl);

    if (!normalized) {
      throw new Error("M5C tracking data unavailable");
    }

    return normalized;
  } catch (error) {
    console.error("========== M5C API ERROR ==========");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }

    throw error;
  }
};
