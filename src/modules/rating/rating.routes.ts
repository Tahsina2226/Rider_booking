import express from "express";
import { giveRating, getDriverRatings } from "./rating.controller";
import {
  authenticateJWT,
  authorizeRoles,
} from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticateJWT, authorizeRoles("rider"), giveRating);
router.get("/driver/:driverId", getDriverRatings);

export default router;
