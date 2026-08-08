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
    console.error("ABCStar API Error:", error.response?.data || error.message);

    // Invalid AWB — SkyNet jaisa error shipment return karo
    if (error.response?.status === 412) {
      const notFound = "AWB number not found";

      return {
        trackingId: notFound,
        awbNumber: notFound,

        trackingUrl:
          trackingBaseUrl && trackingBaseUrl.trim().toUpperCase() !== "NA"
            ? trackingBaseUrl
                .trim()
                .replace("{}", encodeURIComponent(notFound))
                .replace("[TRACKING_NO]", encodeURIComponent(notFound))
            : null,

        status: "",
        carrier: "ABCStar",
        service: "",

        consignor: "",
        consignee: "",
        destination: "",

        originCountry: "",
        destinationCountry: "",

        sender: {
          name: "",
          phone: "",
        },

        receiver: {
          name: "",
          address: [],
        },

        details: {
          serviceType: "",
          paymentType: "",
          contents: "",
          pickupDate: "",
          totalPieces: 0,
          declaredValue: "",
          weight: "",
        },

        travelHistory: [],

        confirmedAt: "",
        inTransitAt: "",
        deliveredAt: "",

        mapQuery: "",
      };
    }

    throw error;
  }
};
