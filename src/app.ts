import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/database";

import authRoutes from "./modules/auth/auth.routes";
import rideRoutes from "./modules/ride/ride.routes";
import driverRoutes from "./modules/driver/driver.routes";
import adminRoutes from "./modules/admin/admin.routes";
import ratingRoutes from "./modules/rating/rating.routes";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app: Application = express();

connectDB();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Ride Booking API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ratings", ratingRoutes);
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
