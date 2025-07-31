"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = exports.getAllRides = exports.blockUser = exports.approveDriver = exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("../user/user.model"));
const ride_model_1 = __importDefault(require("../ride/ride.model"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find().select("-password").sort({ createdAt: -1 });
        res.json({ users });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getAllUsers = getAllUsers;
const approveDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driverId = req.params.id;
        const { approve } = req.body;
        const driver = yield user_model_1.default.findById(driverId);
        if (!driver || driver.role !== "driver")
            return res.status(404).json({ message: "Driver not found" });
        driver.isApproved = approve;
        yield driver.save();
        res.json({ message: `Driver ${approve ? "approved" : "suspended"}` });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.approveDriver = approveDriver;
const blockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const { block } = req.body;
        const user = yield user_model_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        user.blocked = block;
        yield user.save();
        res.json({ message: `User ${block ? "blocked" : "unblocked"}` });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.blockUser = blockUser;
const getAllRides = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rides = yield ride_model_1.default.find()
            .populate("rider", "name email")
            .populate("driver", "name email")
            .sort({ requestedAt: -1 });
        res.json({ rides });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getAllRides = getAllRides;
const getAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const totalRides = yield ride_model_1.default.countDocuments();
        const completedRides = yield ride_model_1.default.countDocuments({ status: "completed" });
        const activeDrivers = yield user_model_1.default.countDocuments({
            role: "driver",
            availabilityStatus: true,
        });
        const totalEarningsData = yield ride_model_1.default.aggregate([
            { $match: { status: "completed" } },
            { $group: { _id: null, totalFare: { $sum: "$fare" } } },
        ]);
        const totalEarnings = ((_a = totalEarningsData[0]) === null || _a === void 0 ? void 0 : _a.totalFare) || 0;
        res.json({
            totalRides,
            completedRides,
            activeDrivers,
            totalEarnings,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getAnalytics = getAnalytics;
