import express from "express";
import cors from "cors";

import testRoutes from "./routes/test.routes.js";
import authRoutes from "./routes/auth.routes.js";
import providerRoutes from "./routes/provider.routes.js";
import userRoutes from "./routes/user.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import cookieParser from "cookie-parser";
import dashboardRoutes from "./routes/dashboard.routes.js";
import trackingRoutes from "./routes/tracking.routes.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://YOUR-SITE.netlify.app"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());



app.use("/api", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/track", trackingRoutes);

app.get("/", (req, res) => {
  res.send("TrackMyCourier Backend Running 🚀");
});



export default app;
