import pool from "../db/database.js";

// =========================
// Create Provider
// =========================
export const createProvider = async (req, res) => {
  try {
    console.log("========== CREATE PROVIDER ==========");
    console.log("Request Body:", req.body);

    const { name, logo_url, tracking_base_url } = req.body;

    // Validation
    if (!name || !logo_url || !tracking_base_url) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO courier_providers
      (name, logo_url, tracking_base_url)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [name, logo_url, tracking_base_url],
    );

    console.log("Inserted Provider:", result.rows[0]);

    return res.status(201).json({
      success: true,
      message: "Provider created successfully.",
      provider: result.rows[0],
    });
  } catch (error) {
    console.error("========== CREATE PROVIDER ERROR ==========");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Detail:", error.detail);
    console.error("Stack:", error.stack);

    // Duplicate Key
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Provider already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
      code: error.code,
      detail: error.detail,
    });
  }
};

// =========================
// Get All Providers
// =========================
export const getProviders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM courier_providers
      ORDER BY created_at DESC;
    `);

    return res.status(200).json({
      success: true,
      providers: result.rows,
    });
  } catch (error) {
    console.error("========== GET PROVIDERS ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =========================
// Update Provider
// =========================
export const updateProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo_url, tracking_base_url } = req.body;

    if (!name || !logo_url || !tracking_base_url) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE courier_providers
      SET
        name = $1,
        logo_url = $2,
        tracking_base_url = $3
      WHERE id = $4
      RETURNING *;
      `,
      [name, logo_url, tracking_base_url, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Provider not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Provider updated successfully.",
      provider: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE PROVIDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Delete Provider
// =========================
export const deleteProvider = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM courier_providers
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Provider not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Provider deleted successfully.",
    });
  } catch (error) {
   console.error("========== DELETE PROVIDER ERROR ==========");
   console.error("Message:", error.message);
   console.error("Code:", error.code);
   console.error("Detail:", error.detail);
   console.error("Constraint:", error.constraint);
   console.error("Stack:", error.stack);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};