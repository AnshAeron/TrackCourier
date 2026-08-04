import pool from "../../shared/db.js";

export async function handler() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      type: typeof pool,
      keys: Object.keys(pool || {}),
      constructor: pool?.constructor?.name,
      hasQuery: typeof pool?.query,
    }),
  };
}
