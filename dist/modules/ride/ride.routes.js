"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ride_controller_1 = require("./ride.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/request", authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)("rider"), ride_controller_1.requestRide);
router.patch("/cancel/:id", authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)("rider"), ride_controller_1.cancelRide);
router.get("/me", authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)("rider"), ride_controller_1.getRideHistory);
router.post("/nearby-drivers", authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)("rider"), ride_controller_1.getNearbyDrivers);
router.post("/fare/calculate", authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)("rider"), ride_controller_1.calculateFareHandler);
exports.default = router;
