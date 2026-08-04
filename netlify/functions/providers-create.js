import pool from "../../shared/db.js";
import { requireAdmin } from "../../shared/auth.js";
import { success, failure } from "../../shared/response.js";
import { pool } from "../lib/db.js";

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return failure(405, "Method not allowed");
    }

    requireAdmin(event);

    const { name, logo_url, tracking_base_url } = JSON.parse(
      event.body || "{}",
    );

    if (!name || !logo_url || !tracking_base_url) {
      return failure(400, "All fields are required.");
    }

    const result = await pool.query(
      `
      INSERT INTO courier_providers
      (name, logo_url, tracking_base_url)
      VALUES ($1,$2,$3)
      RETURNING *;
      `,
      [name, logo_url, tracking_base_url],
    );

    return success(201, {
      success: true,
      message: "Provider created successfully.",
      provider: result.rows[0],
    });
  } catch (err) {
    if (err.message === "Access denied") {
      return failure(403, err.message);
    }

    if (err.code === "23505") {
      return failure(409, "Provider already exists.");
    }

    return failure(500, err.message);
  }
}
