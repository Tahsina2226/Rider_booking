"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFareHandler = void 0;
const fareCalculator_1 = require("../../utils/fareCalculator");
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
    const distanceKm = (0, fareCalculator_1.getDistanceFromLatLonInKm)(pickupLocation.lat, pickupLocation.lng, destinationLocation.lat, destinationLocation.lng);
    const fare = (0, fareCalculator_1.calculateFare)(distanceKm);
    return res.status(200).json({ distanceKm, fare });
};
exports.calculateFareHandler = calculateFareHandler;
