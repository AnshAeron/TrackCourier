import { getUser } from "../../shared/auth.js";
import { pool } from "../lib/db.js";
import { success, failure } from "../../shared/response.js";

export async function handler(event) {
  try {
    if (event.httpMethod !== "GET") {
      return failure(405, "Method not allowed");
    }

    const user = getUser(event);

    return success(200, {
      success: true,
      user,
    });
  } catch (err) {
    return failure(401, err.message);
  }
}
