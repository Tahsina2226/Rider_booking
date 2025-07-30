"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const driver_controller_1 = require("./driver.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.patch("/availability", authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)("driver"), driver_controller_1.setAvailability);
router.get("/rides/available", authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)("driver"), driver_controller_1.getAvailableRides);
router.patch("/rides/accept/:id", authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)("driver"), driver_controller_1.acceptRide);
router.patch("/rides/status/:id", authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)("driver"), driver_controller_1.updateRideStatus);
router.get("/earnings", authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)("driver"), driver_controller_1.getEarnings);
exports.default = router;
