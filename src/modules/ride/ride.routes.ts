import express from "express";
import { requestRide, cancelRide, getRideHistory } from "./ride.controller";
import {
  authenticateJWT,
  authorizeRoles,
} from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/request", authenticateJWT, authorizeRoles("rider"), requestRide);

//  cancel
router.patch(
  "/cancel/:id",
  authenticateJWT,
  authorizeRoles("rider"),
  cancelRide
);

//
router.get("/me", authenticateJWT, authorizeRoles("rider"), getRideHistory);

export default router;
