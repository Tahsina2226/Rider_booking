import express from "express";
import { blockUser, unblockUser, getAllUsers } from "./user.controller";
import {
  authenticateJWT,
  authorizeRoles,
} from "../../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticateJWT);
router.get("/", authorizeRoles("admin"), getAllUsers);
router.patch("/block/:id", authorizeRoles("admin"), blockUser);
router.patch("/unblock/:id", authorizeRoles("admin"), unblockUser);

export default router;
