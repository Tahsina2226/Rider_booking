"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateJWT);
router.get("/", (0, authMiddleware_1.authorizeRoles)("admin"), user_controller_1.getAllUsers);
router.patch("/block/:id", (0, authMiddleware_1.authorizeRoles)("admin"), user_controller_1.blockUser);
router.patch("/unblock/:id", (0, authMiddleware_1.authorizeRoles)("admin"), user_controller_1.unblockUser);
exports.default = router;
