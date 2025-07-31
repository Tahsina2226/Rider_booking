import express from "express";
import {
  requestRide,
  cancelRide,
  getRideHistory,
  getNearbyDrivers,
  calculateFareHandler,
} from "./ride.controller";
import {
  authenticateJWT,
  authorizeRoles,
} from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/request", authenticateJWT, authorizeRoles("rider"), requestRide);

router.patch(
  "/cancel/:id",
  authenticateJWT,
  authorizeRoles("rider"),
  cancelRide
);

router.get("/me", authenticateJWT, authorizeRoles("rider"), getRideHistory);
router.post(
  "/nearby-drivers",
  authenticateJWT,
  authorizeRoles("rider"),
  getNearbyDrivers
);
router.post(
  "/fare/calculate",
  authenticateJWT,
  authorizeRoles("rider"),
  calculateFareHandler
);

export default router;
