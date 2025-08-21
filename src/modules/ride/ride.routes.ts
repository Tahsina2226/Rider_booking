import express from "express";
import * as rideRequestController from "./rideRequest.controller";
import * as rideHistoryController from "./rideHistory.controller";
import * as fareController from "./fare.controller";
import {
  authenticateJWT,
  authorizeRoles,
} from "../../middlewares/authMiddleware";

const router = express.Router();

const authRider = [authenticateJWT, authorizeRoles("rider")];
const authDriver = [authenticateJWT, authorizeRoles("driver")];

router.post("/request", authRider, rideRequestController.requestRide);
router.post("/cancel/:id", authRider, rideRequestController.cancelRide);
router.get("/history", authRider, rideHistoryController.getRideHistory);
router.get("/history/:id", authRider, rideHistoryController.getRideById);
router.post(
  "/nearby-drivers",
  authRider,
  rideHistoryController.getNearbyDrivers
);
router.post("/calculate", fareController.calculateFareHandler);

export default router;
