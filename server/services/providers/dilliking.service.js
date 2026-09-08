import axios from "axios";

export const trackDilliKing = async (trackingNo, trackingBaseUrl) => {
  const airwayBill = String(trackingNo || "").trim();

  if (!airwayBill) {
    throw new Error("Dilli King AWB is missing.");
  }

  const token = process.env.DILLIKING_API_TOKEN;

  if (!token) {
    throw new Error("DILLIKING_API_TOKEN is not configured.");
  }

  const response = await axios.post(
    "https://api.dilliking.com/tracking",
    null,
    {
      params: {
        airway_bill: airwayBill,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  console.log(
    "DILLI KING API RESPONSE:",
    JSON.stringify(response.data, null, 2),
  );

  if (response.data?.status !== 200 || !Array.isArray(response.data?.data)) {
    throw new Error(
      response.data?.message || "Invalid Dilli King API response.",
    );
  }

  const events = response.data.data;

  if (events.length === 0) {
    return {
      trackingId: airwayBill,
      awbNumber: airwayBill,
      carrier: "Dilli King",
      status: "Tracking Unavailable",
      service: "",
      trackingUrl: trackingBaseUrl
        ? trackingBaseUrl.replace("{}", encodeURIComponent(airwayBill))
        : "",
      travelHistory: [],
      confirmedAT: "",
      inTransitAT: "",
      deliveredAt: "",
    };
  }

  const formatDate = (date) => {
    if (!date || String(date).length !== 8) {
      return "";
    }

    const value = String(date);

    return `${value.substring(6, 8)}-${value.substring(
      4,
      6,
    )}-${value.substring(0, 4)}`;
  };

  const formatTime = (time) => {
    const value = String(time || "").padStart(4, "0");

    return `${value.substring(0, 2)}:${value.substring(2, 4)}`;
  };

  const travelHistory = events.map((event) => ({
    date: formatDate(event.event_date),
    time: formatTime(event.event_time),
    location: event.location || "",
    status: event.remark || "",
  }));

  const latestEvent = events[0];

  const latestStatus = latestEvent?.remark || "Tracking Unavailable";

  let deliveredAt = "";
  let confirmedAt = "";
  let inTransitAt = "";

  for (const event of events) {
    const remark = String(event.remark || "").toLowerCase();
    const date = formatDate(event.event_date);
    const time = formatTime(event.event_time);

    const dateTime = date && time ? `${date} ${time}` : date;

    if (!deliveredAt && remark.includes("delivered")) {
      deliveredAt = dateTime;
    }

    if (
      !confirmedAt &&
      (remark.includes("received") ||
        remark.includes("collected") ||
        remark.includes("shipment received"))
    ) {
      confirmedAt = dateTime;
    }

    if (
      !inTransitAt &&
      (remark.includes("in transit") ||
        remark.includes("handover") ||
        remark.includes("ready for dispatch") ||
        remark.includes("out for delivery"))
    ) {
      inTransitAt = dateTime;
    }
  }

  return {
    trackingId: airwayBill,
    awbNumber: airwayBill,
    carrier: "Dilli King",
    status: latestStatus,
    service: "",
    trackingUrl: trackingBaseUrl
  ? trackingBaseUrl.replace("{}", encodeURIComponent(airwayBill))
  : "",
    travelHistory,
    confirmedAt,
    inTransitAt,
    deliveredAt,
  };
};
