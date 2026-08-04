import pool from "../../shared/db.js";
import bcrypt from "bcrypt";
import { requireAdmin } from "../../shared/auth.js";
import { success, failure } from "../../shared/response.js";
import { pool } from "../lib/db.js";

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return failure(405, "Method not allowed");
    }

    requireAdmin(event);

    const { username, password, role } = JSON.parse(event.body || "{}");

    if (!username || !password || !role) {
      return failure(400, "All fields are required.");
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users
      (username,password_hash,role)
      VALUES($1,$2,$3)
      RETURNING
      id,
      username,
      role,
      created_at;
      `,
      [username, hash, role],
    );

    return success(201, {
      success: true,
      message: "User created successfully.",
      user: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      return failure(409, "Username already exists.");
    }

    return failure(500, err.message);
  }
}
