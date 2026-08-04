import pool from "../../shared/db.js";
import { requireStaffOrAdmin } from "../../shared/auth.js";
import { success, failure } from "../../shared/response.js";

export async function handler(event) {
  try {
    if (event.httpMethod !== "GET") {
      return failure(405, "Method not allowed");
    }

    requireStaffOrAdmin(event);

    const [users, providers, bookings] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users"),
      pool.query("SELECT COUNT(*) FROM courier_providers"),
      pool.query("SELECT COUNT(*) FROM bookings"),
    ]);

    return success(200, {
      success: true,
      stats: {
        users: Number(users.rows[0].count),
        providers: Number(providers.rows[0].count),
        bookings: Number(bookings.rows[0].count),
      },
    });
  } catch (err) {
    if (
      err.message === "Access denied" ||
      err.message === "No token provided"
    ) {
      return failure(401, err.message);
    }

    return failure(500, err.message);
  }
}
