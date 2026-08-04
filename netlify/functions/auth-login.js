import bcrypt from "bcrypt";
import { pool } from "../lib/db.js";


import { generateToken } from "../../shared/jwt.js";
import { success, failure } from "../../shared/response.js";

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return failure(405, "Method not allowed");
    }

    const { username, password } = JSON.parse(event.body || "{}");

    if (!username || !password) {
      return failure(400, "Username and password are required.");
    }

    const result = await pool.query(
      `
      SELECT
        id,
        username,
        password_hash,
        role
      FROM users
      WHERE username = $1
      `,
      [username],
    );

    if (result.rowCount === 0) {
      return failure(401, "Invalid username or password");
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return failure(401, "Invalid username or password");
    }

    const token = generateToken(user);

    return success(200, {
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return failure(500, err.message);
  }
}
