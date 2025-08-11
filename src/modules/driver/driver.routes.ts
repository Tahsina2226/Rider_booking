import express from "express";
import {
  setAvailability,
  getAvailableRides,
  acceptRide,
  updateRideStatus,
  getEarnings,
} from "./driver.controller";
import {
  authenticateJWT,
  authorizeRoles,
} from "../../middlewares/authMiddleware";

const authDriver = [authenticateJWT, authorizeRoles("driver")];

const router = express.Router();

router.get("/available", authDriver, getAvailableRides);
router.post("/accept/:id", authDriver, acceptRide);
router.patch("/status/:id", authDriver, updateRideStatus);
router.post("/availability", authDriver, setAvailability);
router.get("/earnings", authDriver, getEarnings);

export default router;
