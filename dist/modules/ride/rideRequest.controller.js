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
exports.cancelRide = exports.requestRide = void 0;
const ride_model_1 = __importDefault(require("./ride.model"));
const fareCalculator_1 = require("../../utils/fareCalculator");
const requestRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const riderId = req.user.id;
        const { pickupLocation, destinationLocation } = req.body;
        const activeRide = yield ride_model_1.default.findOne({
            rider: riderId,
            status: { $in: ["requested", "accepted", "picked_up", "in_transit"] },
        });
        if (activeRide) {
            return res
                .status(409)
                .json({ message: "You already have an active ride" });
        }
        if (!(pickupLocation === null || pickupLocation === void 0 ? void 0 : pickupLocation.lat) ||
            !(pickupLocation === null || pickupLocation === void 0 ? void 0 : pickupLocation.lng) ||
            !(destinationLocation === null || destinationLocation === void 0 ? void 0 : destinationLocation.lat) ||
            !(destinationLocation === null || destinationLocation === void 0 ? void 0 : destinationLocation.lng)) {
            return res.status(400).json({
                message: "Pickup and destination locations are required and must include lat and lng",
            });
        }
        const distanceKm = (0, fareCalculator_1.getDistanceFromLatLonInKm)(pickupLocation.lat, pickupLocation.lng, destinationLocation.lat, destinationLocation.lng);
        const fare = (0, fareCalculator_1.calculateFare)(distanceKm);
        const newRide = new ride_model_1.default({
            rider: riderId,
            pickupLocation,
            destinationLocation,
            status: "requested",
            timestamps: {},
            requestedAt: new Date(),
            fare,
        });
        yield newRide.save();
        return res
            .status(201)
            .json({ message: "Ride requested successfully", ride: newRide });
    }
    catch (error) {
        console.error("Error requesting ride:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.requestRide = requestRide;
const cancelRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const riderId = req.user.id;
        const rideId = req.params.id;
        const ride = yield ride_model_1.default.findById(rideId);
        if (!ride)
            return res.status(404).json({ message: "Ride not found" });
        if (ride.rider.toString() !== riderId) {
            return res
                .status(403)
                .json({ message: "You are not authorized to cancel this ride" });
        }
        if (ride.status !== "requested") {
            return res
                .status(400)
                .json({ message: "Ride cannot be cancelled after being accepted" });
        }
        ride.status = "cancelled";
        if (!ride.timestamps)
            ride.timestamps = {};
        ride.timestamps.cancelledAt = new Date();
        yield ride.save();
        return res.status(200).json({ message: "Ride cancelled successfully" });
    }
    catch (error) {
        console.error("Error cancelling ride:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.cancelRide = cancelRide;
