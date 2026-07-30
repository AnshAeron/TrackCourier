export const normalizeABCStar = (raw, trackingBaseUrl) => {
  console.log("========== ABCSTAR RAW RESPONSE ==========");
  console.log(JSON.stringify(raw, null, 2));

  console.log("Tracking Base URL:", trackingBaseUrl);

  const shipment = raw?.data;

  if (!shipment) {
    return null;
  }

  const history = shipment.tracking_details || [];

  return {
    trackingId: shipment.tracking_code,
    awbNumber: shipment.tracking_code,

    trackingUrl:
      trackingBaseUrl &&
      trackingBaseUrl.trim() &&
      trackingBaseUrl.trim().toUpperCase() !== "NA"
        ? trackingBaseUrl.trim() + shipment.tracking_code
        : null,

    status: shipment.status || "In Transit",

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

    travelHistory: history.map((event, index) => ({
      date: event.timestamp?.split(" ")[0] || "",
      time: event.timestamp?.split(" ")[1] || "",
      title: event.message,
      location: event.location,
      state: index === 0 ? "current" : "done",
      hasLink: false,
    })),

    confirmedAt: shipment.created_at || "",

    inTransitAt:
      history.find((e) => e.message.toLowerCase().includes("transit"))
        ?.timestamp || "",

    deliveredAt: "",

    mapQuery: shipment.destination || "",
  };
};
