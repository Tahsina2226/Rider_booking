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

const router = express.Router();

router.patch(
  "/availability",
  authenticateJWT,
  authorizeRoles("driver"),
  setAvailability
);

router.get(
  "/rides/available",
  authenticateJWT,
  authorizeRoles("driver"),
  getAvailableRides
);

router.patch(
  "/rides/accept/:id",
  authenticateJWT,
  authorizeRoles("driver"),
  acceptRide
);

router.patch(
  "/rides/status/:id",
  authenticateJWT,
  authorizeRoles("driver"),
  updateRideStatus
);

router.get("/earnings", authenticateJWT, authorizeRoles("driver"), getEarnings);

export default router;
