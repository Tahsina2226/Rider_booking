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
exports.getEarnings = exports.updateRideStatus = exports.acceptRide = exports.getAvailableRides = exports.setAvailability = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ride_model_1 = __importDefault(require("../ride/ride.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
// Driver er availability on/off update korar jonno
const setAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driverId = req.user.id;
        const { availabilityStatus } = req.body;
        const user = yield user_model_1.default.findById(driverId);
        if (!user)
            return res.status(404).json({ message: "Driver not found" });
        user.availabilityStatus = availabilityStatus;
        yield user.save();
        res.json({ message: "Availability status updated", availabilityStatus });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.setAvailability = setAvailability;
// Driver der jonno pending rides dekhano
const getAvailableRides = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rides = yield ride_model_1.default.find({ status: "requested" }).sort({
            requestedAt: 1,
        });
        res.json({ rides });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getAvailableRides = getAvailableRides;
// Ride accept korar
const acceptRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driverId = req.user.id;
        const rideId = req.params.id;
        const ride = yield ride_model_1.default.findById(rideId);
        if (!ride)
            return res.status(404).json({ message: "Ride not found" });
        if (ride.status !== "requested") {
            return res
                .status(400)
                .json({ message: "Ride already accepted or unavailable" });
        }
        const activeRide = yield ride_model_1.default.findOne({
            driver: driverId,
            status: { $in: ["accepted", "picked_up", "in_transit"] },
        });
        if (activeRide) {
            return res
                .status(400)
                .json({ message: "You already have an active ride" });
        }
        ride.status = "accepted";
        ride.driver = new mongoose_1.default.Types.ObjectId(driverId);
        ride.timestamps.acceptedAt = new Date();
        yield ride.save();
        res.json({ message: "Ride accepted", ride });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.acceptRide = acceptRide;
// Ride status update kora
const updateRideStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const driverId = req.user.id;
        const rideId = req.params.id;
        const { status } = req.body;
        const validStatuses = [
            "picked_up",
            "in_transit",
            "completed",
        ];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status update" });
        }
        const ride = yield ride_model_1.default.findById(rideId);
        if (!ride)
            return res.status(404).json({ message: "Ride not found" });
        if (((_a = ride.driver) === null || _a === void 0 ? void 0 : _a.toString()) !== driverId) {
            return res
                .status(403)
                .json({ message: "Unauthorized to update this ride" });
        }
        const statusOrder = [
            "requested",
            "accepted",
            "picked_up",
            "in_transit",
            "completed",
        ];
        if (statusOrder.indexOf(status) <= statusOrder.indexOf(ride.status)) {
            return res.status(400).json({ message: "Invalid status transition" });
        }
        ride.status = status;
        const statusMap = {
            picked_up: "pickedUpAt",
            in_transit: "inTransitAt",
            completed: "completedAt",
        };
        const timestampField = statusMap[status];
        ride.timestamps[timestampField] = new Date();
        yield ride.save();
        res.json({ message: "Ride status updated", ride });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.updateRideStatus = updateRideStatus;
// Driver  earning ber kora
const getEarnings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driverId = req.user.id;
        const rides = yield ride_model_1.default.find({
            driver: driverId,
            status: "completed",
        });
        const totalEarnings = rides.reduce((sum, ride) => sum + (ride.fare || 0), 0);
        res.json({ totalEarnings, rides });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getEarnings = getEarnings;
