export const normalizeABCStar = (raw, trackingBaseUrl) => {
  console.log("========== ABCSTAR RAW RESPONSE ==========");
  console.log(JSON.stringify(raw, null, 2));

  const shipment = raw?.data;

  if (!shipment) {
    return null;
  }

  // Sort history (Newest -> Oldest)
  const history = [...(shipment.tracking_details || [])].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );

  const apiStatus = (shipment.status || "").toLowerCase();

  const latestEvent = history[0];

  // Decide shipment status
  const isDelivered =
    apiStatus === "delivered" ||
    latestEvent?.message?.toLowerCase().includes("clearance completed") ||
    latestEvent?.message?.toLowerCase().includes("delivered");

  const status = isDelivered ? "Delivered" : "In Transit";

  const inTransitEvent = history.find((e) =>
    e.message?.toLowerCase().includes("transit"),
  );

  const deliveredEvent = isDelivered
    ? latestEvent
    : history.find((e) => e.message?.toLowerCase().includes("delivered"));

  console.log("Latest Event:", latestEvent);
  console.log("Transit Event:", inTransitEvent);
  console.log("Delivered Event:", deliveredEvent);

  return {
    trackingId: shipment.tracking_code,
    awbNumber: shipment.tracking_code,

    trackingUrl:
      trackingBaseUrl &&
      trackingBaseUrl.trim() &&
      trackingBaseUrl.trim().toUpperCase() !== "NA"
        ? trackingBaseUrl
            .trim()
            .replace("{}", encodeURIComponent(shipment.tracking_code))
            .replace(
              "[TRACKING_NO]",
              encodeURIComponent(shipment.tracking_code),
            )
        : null,

    status,

    carrier: "ABCStar",

    service: "",

    consignor: "",
    consignee: shipment.co_full_name || "",

    destination: shipment.destination || "",

    originCountry: "",
    destinationCountry: shipment.destination || "",

    sender: {
      name: "",
      phone: "",
    },

    receiver: {
      name: shipment.co_full_name || "",
      address: [shipment.destination].filter(Boolean),
    },

    details: {
      serviceType: "",
      paymentType: "",
      contents: "",
      pickupDate: shipment.created_at || "",
      totalPieces: Number(shipment.number_of_box || 0),
      declaredValue: "",
      weight: shipment.weight || "",
    },

    travelHistory: history.map((event) => ({
      date: event.timestamp?.split(" ")[0] || "",
      time: event.timestamp?.split(" ")[1] || "",
      title: event.message,
      location: event.location,
      state: isDelivered
        ? "done"
        : event.message?.toLowerCase().includes("transit")
          ? "current"
          : "done",
      hasLink: false,
    })),

    confirmedAt: shipment.created_at || "",

    inTransitAt: inTransitEvent?.timestamp || "",

    deliveredAt: deliveredEvent?.timestamp || "",

    mapQuery: shipment.destination || "",
  };
};
