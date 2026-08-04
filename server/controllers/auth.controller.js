import pool from "../db/database.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }
   

    const result = await pool.query(
      `
      SELECT id, username, password_hash, role
      FROM users
      WHERE username = $1
      `,
      [username],
    );
   

    if (result.rowCount === 0) {
      console.log("❌ User not found:", username);

      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const user = result.rows[0];

    console.log("================================");
    console.log("🔹 Username Entered :", username);
    console.log("🔹 User Found       :", user.username);
    console.log("🔹 Password Entered :", password);
    console.log("🔹 Hash From DB     :", user.password_hash);

    const isMatch = await bcrypt.compare(password, user.password_hash);

    console.log("✅ Password Match :", isMatch);
    console.log("================================");

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
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
    console.error("🔥 Login Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const me = async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
};
