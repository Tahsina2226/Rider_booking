"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rating_controller_1 = require("./rating.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authenticateJWT, (0, authMiddleware_1.authorizeRoles)("rider"), rating_controller_1.giveRating);
router.get("/driver/:driverId", rating_controller_1.getDriverRatings);
exports.default = router;
