import { Request, Response } from "express";
import Rating from "./rating.model";

export const giveRating = async (req: Request, res: Response) => {
  try {
    const { rideId, driverId, rating, comment } = req.body;
    const riderId = req.user?.id;

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

    const newRating = new Rating({
      ride: rideId,
      rider: riderId,
      driver: driverId,
      rating,
      comment,
    });

    await newRating.save();

    res.status(201).json({ message: "Rating submitted", rating: newRating });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getDriverRatings = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;

    if (!driverId) {
      return res.status(400).json({ message: "Driver ID is required" });
    }

    const ratings = await Rating.find({ driver: driverId });

    const avgRating =
      ratings.length > 0
        ? ratings.reduce((acc, cur) => acc + cur.rating, 0) / ratings.length
        : 0;

    res.json({ ratings, avgRating: avgRating.toFixed(2) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
