import { getTrackingDetails } from "../../server/services/tracking.service.js";
import { success, failure } from "../../shared/response.js";
import { pool } from "../lib/db.js";

export async function handler(event) {
  try {
    if (event.httpMethod !== "GET") {
      return failure(405, "Method not allowed");
    }

    const consignmentA = event.path.split("/").pop();

    const booking = await getTrackingDetails(consignmentA);

    if (!booking) {
      return failure(404, "Tracking number not found.");
    }

    return success(200, {
      success: true,
      booking,
    });
  } catch (err) {
    console.error(err);
    return failure(500, err.message);
  }
}
