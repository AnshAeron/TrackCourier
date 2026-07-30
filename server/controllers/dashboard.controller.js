import pool from "../db/database.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [users, providers, bookings] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users"),
      pool.query("SELECT COUNT(*) FROM courier_providers"),
      pool.query("SELECT COUNT(*) FROM bookings"),
    ]);

    res.json({
      success: true,
      stats: {
        users: Number(users.rows[0].count),
        providers: Number(providers.rows[0].count),
        bookings: Number(bookings.rows[0].count),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
