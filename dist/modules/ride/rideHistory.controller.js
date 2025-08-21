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
exports.getNearbyDrivers = exports.getRideById = exports.getRideHistory = void 0;
const ride_model_1 = __importDefault(require("./ride.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const getRideHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const riderId = req.user.id;
        const rides = yield ride_model_1.default.find({ rider: riderId })
            .sort({ requestedAt: -1 })
            .populate("driver", "-password");
        return res.status(200).json({ rides });
    }
    catch (error) {
        console.error("Error fetching ride history:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getRideHistory = getRideHistory;
const getRideById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rideId = req.params.id;
        const riderId = req.user.id;
        const ride = yield ride_model_1.default.findOne({ _id: rideId, rider: riderId }).populate("driver", "-password");
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }
        return res.status(200).json({ ride });
    }
    catch (error) {
        console.error("Error fetching ride details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getRideById = getRideById;
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
        const nearbyDrivers = yield user_model_1.default.find({
            role: "driver",
            availabilityStatus: true,
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [lng, lat] },
                    $maxDistance: 5000,
                },
            },
        }).select("name phone car location");
        return res.status(200).json({ drivers: nearbyDrivers });
    }
    catch (error) {
        console.error("Error fetching nearby drivers:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getNearbyDrivers = getNearbyDrivers;
