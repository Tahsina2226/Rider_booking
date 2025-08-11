"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const driver_controller_1 = require("./driver.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const authDriver = [authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)("driver")];
const router = express_1.default.Router();
router.get("/available", authDriver, driver_controller_1.getAvailableRides);
router.post("/accept/:id", authDriver, driver_controller_1.acceptRide);
router.patch("/status/:id", authDriver, driver_controller_1.updateRideStatus);
router.post("/availability", authDriver, driver_controller_1.setAvailability);
router.get("/earnings", authDriver, driver_controller_1.getEarnings);
exports.default = router;
