import express from "express";
import {
  getAllUsers,
  approveDriver,
  blockUser,
  getAllRides,
} from "./admin.controller";
import {
  authenticateJWT,
  authorizeRoles,
} from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/users", authenticateJWT, authorizeRoles("admin"), getAllUsers);

router.patch(
  "/drivers/approve/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  approveDriver
);

router.patch(
  "/users/block/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  blockUser
);

router.get("/rides", authenticateJWT, authorizeRoles("admin"), getAllRides);

export default router;
