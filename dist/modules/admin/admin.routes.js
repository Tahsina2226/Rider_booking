"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/users", authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)("admin"), admin_controller_1.getAllUsers);
router.patch("/drivers/approve/:id", authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)("admin"), admin_controller_1.approveDriver);
router.patch("/users/block/:id", authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)("admin"), admin_controller_1.blockUser);
router.get("/rides", authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)("admin"), admin_controller_1.getAllRides);
exports.default = router;
