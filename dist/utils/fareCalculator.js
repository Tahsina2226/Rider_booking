"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFare = void 0;
const calculateFare = (distanceKm) => {
    const ratePerKm = 10;
    return distanceKm * ratePerKm;
};
exports.calculateFare = calculateFare;
