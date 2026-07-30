import axios from "axios";
import { normalizeSkyNet } from "../normalizers/skynet.normalizer.js";

export const trackSkyNet = async (trackingNo, trackingBaseUrl) => {
  try {
    const response = await axios.get(
      "https://admin.skylink.skynetww.com/api/tracking_api/get_tracking_data",
      {
        params: {
          customer_code: "A052",
          tracking_no: trackingNo,
        },
      },
    );

    return normalizeSkyNet(response.data, trackingBaseUrl);
  } catch (error) {
    console.error("SkyNet API Error:", error.response?.data || error.message);
    throw error;
  }
};
