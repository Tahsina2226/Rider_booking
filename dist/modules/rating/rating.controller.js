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
exports.getDriverRatings = exports.giveRating = void 0;
const rating_model_1 = __importDefault(require("./rating.model"));
const giveRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { rideId, driverId, rating, comment } = req.body;
        const riderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!riderId) {
            return res.status(401).json({ message: "Unauthorized: rider not found" });
        }
        if (!rideId || !driverId || rating == null) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        if (rating < 1 || rating > 5) {
            return res
                .status(400)
                .json({ message: "Rating must be between 1 and 5" });
        }
        const newRating = new rating_model_1.default({
            ride: rideId,
            rider: riderId,
            driver: driverId,
            rating,
            comment,
        });
        yield newRating.save();
        res.status(201).json({ message: "Rating submitted", rating: newRating });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.giveRating = giveRating;
const getDriverRatings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { driverId } = req.params;
        if (!driverId) {
            return res.status(400).json({ message: "Driver ID is required" });
        }
        const ratings = yield rating_model_1.default.find({ driver: driverId });
        const avgRating = ratings.length > 0
            ? ratings.reduce((acc, cur) => acc + cur.rating, 0) / ratings.length
            : 0;
        res.json({ ratings, avgRating: avgRating.toFixed(2) });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getDriverRatings = getDriverRatings;
