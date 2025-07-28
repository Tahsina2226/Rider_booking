import express from "express";
import { blockUser, unblockUser, getAllUsers } from "./user.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { checkRole } from "../../middlewares/roleMiddleware";

const router = express.Router();

router.use(authMiddleware);
router.get("/", checkRole("admin"), getAllUsers);
router.patch("/block/:id", checkRole("admin"), blockUser);
router.patch("/unblock/:id", checkRole("admin"), unblockUser);

export default router;
