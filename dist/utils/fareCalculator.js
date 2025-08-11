"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFare = exports.RATE_PER_KM = void 0;
exports.deg2rad = deg2rad;
exports.getDistanceFromLatLonInKm = getDistanceFromLatLonInKm;
exports.RATE_PER_KM = 10;
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
    return distanceKm * exports.RATE_PER_KM;
};
exports.calculateFare = calculateFare;
