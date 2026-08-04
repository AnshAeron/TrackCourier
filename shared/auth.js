import { verifyToken } from "./jwt.js";

export function getUser(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];

  return verifyToken(token);
}

export function requireAdmin(event) {
  const user = getUser(event);

  if (user.role !== "ADMIN") {
    throw new Error("Access denied");
  }

  return user;
}

export function requireStaffOrAdmin(event) {
  const user = getUser(event);

  if (!["ADMIN", "STAFF"].includes(user.role)) {
    throw new Error("Access denied");
  }

  return user;
}
