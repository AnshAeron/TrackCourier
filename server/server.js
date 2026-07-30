import dotenv from "dotenv";
dotenv.config();

console.log("Loading app...");

import app from "./app.js";

console.log("App imported:", typeof app);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.on("close", () => {
  console.log("❌ Server closed");
});

process.on("exit", (code) => {
  console.log("Process exited with code:", code);
});
