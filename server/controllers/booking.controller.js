import pool from "../db/database.js";

// Get All Bookings
export const getBookings = async (req, res) => {
  try {
    const result = await pool.query(`
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
      ORDER BY b.created_at DESC;
    `);

    return res.status(200).json({
      success: true,
      bookings: result.rows,
    });
  } catch (error) {
    console.error("Get Bookings Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create Booking
export const createBooking = async (req, res) => {
  try {
    const { provider_id, consignment_a, consignment_b } = req.body;

    if (!provider_id || !consignment_a) {
      return res.status(400).json({
        success: false,
        message: "Provider and Consignment A are required.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO bookings
      (
        provider_id,
        consignment_a,
        consignment_b
      )
      VALUES ($1,$2,$3)
      RETURNING *;
      `,
      [provider_id, consignment_a, consignment_b || null],
    );

    return res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("Create Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =========================
// Update Booking
// =========================
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { provider_id, consignment_a, consignment_b } = req.body;

    if (!provider_id || !consignment_a) {
      return res.status(400).json({
        success: false,
        message: "Provider and Consignment A are required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE bookings
      SET
        provider_id = $1,
        consignment_a = $2,
        consignment_b = $3
      WHERE id = $4
      RETURNING *;
      `,
      [provider_id, consignment_a, consignment_b || null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully.",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("Update Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Delete Booking
// =========================
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM bookings
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};