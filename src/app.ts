import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/database";
import authRoutes from "./modules/auth/auth.routes";
import riderRoutes from "./modules/ride/ride.routes";

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
app.use("/api/rides", riderRoutes);

export default app;
