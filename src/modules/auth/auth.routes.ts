import express from "express";
import {
  register,
  login,
  updateProfile,
  changePassword,
} from "./auth.controller";
import { authenticateJWT } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.put("/update-profile", authenticateJWT, updateProfile);
router.put("/change-password", authenticateJWT, changePassword);

export default router;
