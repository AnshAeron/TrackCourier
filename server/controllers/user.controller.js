import pool from "../db/database.js";
import bcrypt from "bcrypt";

// Get All Users
export const getUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        username,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC;
    `);

    return res.status(200).json({
      success: true,
      users: result.rows,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create User
export const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users
      (username, password_hash, role)
      VALUES ($1, $2, $3)
      RETURNING id, username, role, created_at;
      `,
      [username, hashedPassword, role],
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Create User Error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Username already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Update User
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role } = req.body;

    const result = await pool.query(
      `
      UPDATE users
      SET
        username = $1,
        role = $2
      WHERE id = $3
      RETURNING id, username, role, created_at;
      `,
      [username, role, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      message: "User updated successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Update User Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id = $1;
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};