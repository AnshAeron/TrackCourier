export const normalizeM5C = (data, trackingBaseUrl) => {
  try {
    const root = Array.isArray(data) ? data[0] : data;

    const details = root?.trackDetails?.[0];

    if (!details) {
      return null;
    }

    const events = Array.isArray(root?.Event) ? root.Event : [];

    const isDelivered =
      String(details.Status || "").toUpperCase() === "DELIVERED";

    const trackingUrl =
      trackingBaseUrl && trackingBaseUrl.trim().toUpperCase() !== "NA"
        ? trackingBaseUrl
            .trim()
            .replace("{}", encodeURIComponent(details.Awbno || ""))
            .replace("[TRACKING_NO]", encodeURIComponent(details.Awbno || ""))
        : "";

    const travelHistory = events.map((event) => ({
      date: event.EventDate ? String(event.EventDate).substring(0, 10) : "",
      time: event.EventTime || "",
      title: event.EventDescription || "",
      location: event.Location || "",
      state: "",
      hasLink: false,
    }));

    return {
      trackingId: details.Awbno || "",
      awbNumber: details.Awbno || "",

      trackingUrl,

      status: details.Status || "",
      carrier:  "M5C",
      service: "M5C",

      consignor: "",
      consignee: details.Consignee || "",
      destination: details.Destination || "",

      originCountry: "",
      destinationCountry: details.Destination || "",

      sender: {
        name: "",
        phone: "",
      },

      receiver: {
        name: details.ReceiverName || details.Consignee || "",
        address: [],
      },

      details: {
        serviceType: "",
        paymentType: "",
        contents: "",
        pickupDate: details.Shipdate
          ? String(details.Shipdate).substring(0, 10)
          : "",
        totalPieces: null,
        declaredValue: "",
        weight: "",
      },

      travelHistory,

      confirmedAt: details.Shipdate
        ? String(details.Shipdate).substring(0, 10)
        : "",

      inTransitAt: isDelivered
        ? ""
        : events.length > 0
          ? events[0]?.EventDate
            ? String(events[0].EventDate).substring(0, 10)
            : ""
          : "",

      deliveredAt: details.DeliveryDate || "",

      mapQuery: details.Destination || "",
    };
  } catch (error) {
    console.error("M5C normalization error:", error);
    return null;
  }
};
