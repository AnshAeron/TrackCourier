import pool from "../db/database.js";
import { trackSkyNet } from "./providers/skynet.service.js";
import { trackABCStar } from "./providers/abcstar.service.js";

export const getTrackingDetails = async (consignmentA) => {
  const result = await pool.query(
    `
    SELECT
  b.id,
  b.consignment_a,
  b.consignment_b,
  cp.name AS provider_name,
  cp.tracking_base_url
FROM bookings b
JOIN courier_providers cp
  ON cp.id = b.provider_id
WHERE b.consignment_a = $1;
    `,
    [consignmentA],
  );

  const booking = result.rows[0];
  console.log("Consignment Received:", consignmentA);
  console.log("Booking Found:", booking);

  if (!booking) {
    return null;
  }

  console.log("Provider Name:", JSON.stringify(booking.provider_name));
  // Abhi sirf SkyNet support kar rahe hain
  
switch (booking.provider_name.trim()) {
  case "SkyNet":
    console.log("SkyNet Selected");
    return await trackSkyNet(booking.consignment_b, booking.tracking_base_url);

  case "ABCStar":
    console.log("ABCStar Selected");
    return await trackABCStar(booking.consignment_b, booking.tracking_base_url);

  default:
    return {
      trackingId: booking.consignment_b,
      trackingUrl:
        booking.tracking_base_url &&
        booking.tracking_base_url.trim().toUpperCase() !== "NA"
          ? booking.tracking_base_url.trim() + booking.consignment_b
          : null,
      carrier: booking.provider_name.trim(),
      redirectOnly: true,
    };
}
};
