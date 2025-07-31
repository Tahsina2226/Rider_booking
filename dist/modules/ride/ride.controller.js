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
exports.getNearbyDrivers = exports.updateRideStatus = exports.getRideHistory = exports.cancelRide = exports.requestRide = exports.calculateFareHandler = exports.calculateFare = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ride_model_1 = __importDefault(require("./ride.model"));
const RATE_PER_KM = 10;
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLng = deg2rad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
const calculateFare = (distanceKm) => {
    return distanceKm * RATE_PER_KM;
};
exports.calculateFare = calculateFare;
const calculateFareHandler = (req, res) => {
    const { pickupLocation, destinationLocation } = req.body;
    if (!(pickupLocation === null || pickupLocation === void 0 ? void 0 : pickupLocation.lat) ||
        !(pickupLocation === null || pickupLocation === void 0 ? void 0 : pickupLocation.lng) ||
        !(destinationLocation === null || destinationLocation === void 0 ? void 0 : destinationLocation.lat) ||
        !(destinationLocation === null || destinationLocation === void 0 ? void 0 : destinationLocation.lng)) {
        return res.status(400).json({
            message: "Pickup and destination locations must be provided with lat and lng",
        });
    }
    const distanceKm = getDistanceFromLatLonInKm(pickupLocation.lat, pickupLocation.lng, destinationLocation.lat, destinationLocation.lng);
    const fare = (0, exports.calculateFare)(distanceKm);
    return res.status(200).json({ distanceKm, fare });
};
exports.calculateFareHandler = calculateFareHandler;
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
        const distanceKm = getDistanceFromLatLonInKm(pickupLocation.lat, pickupLocation.lng, destinationLocation.lat, destinationLocation.lng);
        const fare = (0, exports.calculateFare)(distanceKm);
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
        if (!["requested", "accepted"].includes(ride.status)) {
            return res
                .status(400)
                .json({ message: "Ride cannot be cancelled at this stage" });
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
const getRideHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const riderId = req.user.id;
        const rides = yield ride_model_1.default.find({ rider: riderId }).sort({ requestedAt: -1 });
        return res.status(200).json({ rides });
    }
    catch (error) {
        console.error("Error fetching ride history:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getRideHistory = getRideHistory;
const updateRideStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const driverId = req.user.id;
        const { rideId, status } = req.body;
        const statusOrder = [
            "requested",
            "accepted",
            "picked_up",
            "in_transit",
            "completed",
            "cancelled",
        ];
        if (!statusOrder.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        const ride = yield ride_model_1.default.findById(rideId);
        if (!ride)
            return res.status(404).json({ message: "Ride not found" });
        if (((_a = ride.driver) === null || _a === void 0 ? void 0 : _a.toString()) !== driverId) {
            return res
                .status(403)
                .json({ message: "Unauthorized to update this ride" });
        }
        if (status !== "cancelled") {
            const currentIndex = statusOrder.indexOf(ride.status);
            const newIndex = statusOrder.indexOf(status);
            if (newIndex !== currentIndex + 1) {
                return res.status(400).json({ message: "Invalid status transition" });
            }
        }
        else {
            if (!["requested", "accepted"].includes(ride.status)) {
                return res
                    .status(400)
                    .json({ message: "Ride cannot be cancelled at this stage" });
            }
        }
        ride.status = status;
        if (!ride.timestamps)
            ride.timestamps = {};
        const now = new Date();
        switch (status) {
            case "accepted":
                ride.timestamps.acceptedAt = now;
                ride.driver = new mongoose_1.default.Types.ObjectId(driverId);
                break;
            case "picked_up":
                ride.timestamps.pickedUpAt = now;
                break;
            case "in_transit":
                ride.timestamps.inTransitAt = now;
                break;
            case "completed":
                ride.timestamps.completedAt = now;
                break;
            case "cancelled":
                ride.timestamps.cancelledAt = now;
                break;
        }
        yield ride.save();
        return res.json({ message: "Ride status updated", ride });
    }
    catch (error) {
        console.error("Error updating ride status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateRideStatus = updateRideStatus;
const getNearbyDrivers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lat, lng } = req.body;
        if (typeof lat !== "number" ||
            typeof lng !== "number" ||
            isNaN(lat) ||
            isNaN(lng)) {
            return res
                .status(400)
                .json({ message: "Valid latitude and longitude are required" });
        }
        const nearbyDrivers = yield mongoose_1.default
            .model("User")
            .find({
            role: "driver",
            availabilityStatus: true,
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [lng, lat] },
                    $maxDistance: 5000,
                },
            },
        })
            .select("-password");
        return res.status(200).json({ drivers: nearbyDrivers });
    }
    catch (error) {
        console.error("Error fetching nearby drivers:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getNearbyDrivers = getNearbyDrivers;
