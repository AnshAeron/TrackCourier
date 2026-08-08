import axios from "axios";
import { normalizeSkyNet } from "../normalizers/skynet.normalizer.js";

export const trackSkyNet = async (trackingNo, trackingBaseUrl) => {
  try {
    const awb = String(trackingNo).trim();

    console.log("======================================");
    console.log("SkyNet Tracking Request");
    console.log("AWB:", `"${awb}"`);
    console.log("Length:", awb.length);

    const url =
      "https://admin.skylink.skynetww.com/api/tracking_api/get_tracking_data";

    console.log(
      "Request URL:",
      `${url}?customer_code=A052&tracking_no=${encodeURIComponent(awb)}`,
    );

    const response = await axios.get(url, {
      params: {
        customer_code: "A052",
        tracking_no: awb,
      },
      headers: {
        Accept: "application/json",
      },
    });

    console.log("========== SKYNET RESPONSE ==========");
    console.log(JSON.stringify(response.data, null, 2));

    if (
      Array.isArray(response.data) &&
      response.data.length > 0 &&
      response.data[0]?.errors
    ) {
      console.error("❌ SkyNet Error:", response.data[0].tracking_no);
    }
const normalized = normalizeSkyNet(response.data, trackingBaseUrl);
if(!normalized) {
  throw new Error("SkyNet tracking data unavailable");
}
    return normalized;
  } catch (error) {
    console.error("========== SKYNET API ERROR ==========");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }

    throw error;
  }
};
