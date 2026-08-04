import { pool } from "../lib/db.js";
import { requireStaffOrAdmin } from "../../shared/auth.js";
import { success, failure } from "../../shared/response.js";


export async function handler(event) {
  try {
    if (event.httpMethod !== "GET") {
      return failure(405, "Method not allowed");
    }

    requireStaffOrAdmin(event);

    const limit = Number(event.queryStringParameters?.limit || 50);
    const offset = Number(event.queryStringParameters?.offset || 0);

    const tracking = event.queryStringParameters?.tracking || "";
    const provider = event.queryStringParameters?.provider || "";
    const awb = event.queryStringParameters?.awb || "";
    const from = event.queryStringParameters?.from || "";
    const to = event.queryStringParameters?.to || "";

    let query = `
      SELECT
        b.id,
        b.consignment_a,
        b.consignment_b,
        b.created_at,
        p.id AS provider_id,
        p.name AS provider_name
      FROM bookings b
      JOIN courier_providers p
      ON b.provider_id = p.id
      WHERE 1=1
    `;

    const values = [];
    let index = 1;

    if (tracking) {
      query += ` AND b.consignment_a ILIKE $${index}`;
      values.push(`%${tracking}%`);
      index++;
    }

    if (provider) {
      query += ` AND b.provider_id = $${index}`;
      values.push(provider);
      index++;
    }

    if (awb) {
      query += ` AND b.consignment_b ILIKE $${index}`;
      values.push(`%${awb}%`);
      index++;
    }

    if (from) {
      query += ` AND DATE(b.created_at) >= $${index}`;
      values.push(from);
      index++;
    }

    if (to) {
      query += ` AND DATE(b.created_at) <= $${index}`;
      values.push(to);
      index++;
    }

    query += `
      ORDER BY b.created_at DESC
      LIMIT $${index}
      OFFSET $${index + 1}
    `;

    values.push(limit);
    values.push(offset);

    const result = await pool.query(query, values);

    return success(200, {
      success: true,
      bookings: result.rows,
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
