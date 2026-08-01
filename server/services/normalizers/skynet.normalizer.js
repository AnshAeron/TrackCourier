export const normalizeSkyNet = (raw, tracking_base_url) => {
  console.log("========== NORMALIZER CALLED ==========");
  console.log("RAW RESPONSE:", JSON.stringify(raw, null, 2));

 const shipment = Array.isArray(raw) ? raw[0] : raw.booking?.[0];

  console.log("SHIPMENT:", shipment);

  if (!shipment) {
    console.log("❌ Shipment not found inside raw.booking");
    return null;
  }

  const info = Object.fromEntries(shipment.docket_info || []);

  const normalized = {
    trackingId: shipment.tracking_no,
    awbNumber: shipment.tracking_no,
    trackingUrl: tracking_base_url
      ? tracking_base_url.replace(
          "{}",
          encodeURIComponent(shipment.tracking_no),
        )
      : null,
    status: info["Status"] || "",

    carrier: "SkyNet",
    service: info["Service Name"] || "",

    consignor: info["Shipper Name"] || "",
    consignee: info["Consignee Name"] || "",
    destination: info["Destination"] || "",

    originCountry: info["Origin"] || "",
    destinationCountry: info["Consignee Country"] || "",

    sender: {
      name: info["Shipper Name"] || "",
      phone: "",
    },

    receiver: {
      name: info["Consignee Name"] || "",
      address: [
        info["Consignee City"] || "",
        info["Consignee State"] || "",
        info["Consignee Country"] || "",
      ].filter(Boolean),
    },

    details: {
      serviceType: info["Service Name"] || "",
      paymentType: "",
      contents: shipment.item_data || "",
      pickupDate: info["Booking Date"] || "",
      totalPieces: Number(shipment.pcs || 0),
      declaredValue: "",
    },

    travelHistory: (shipment.docket_events || []).map((e, index, arr) => {
      const isDelivered = info["Status"]?.toUpperCase() === "DELIVERED";

      return {
        date: e.event_at?.split(" ")[0] || "",
        time: e.event_at?.split(" ")[1] || "",
        title: e.event_description || "",
        location: e.event_location || "",
        state: isDelivered ? "done" : index === 0 ? "current" : "done",
        hasLink: false,
      };
    }),

    confirmedAt: info["Booking Date"] || "",
    inTransitAt: shipment.expected_datetime || "",
    deliveredAt: info["Delivery Date and Time"] || "",

    mapQuery: `${info["Consignee City"] || ""}, ${info["Consignee Country"] || ""}`,
  };

  console.log("✅ NORMALIZED RESPONSE:");
  console.log(JSON.stringify(normalized, null, 2));
  console.log(JSON.stringify(shipment, null, 2));

  return normalized;
  
};
