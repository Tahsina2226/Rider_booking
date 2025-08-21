import { Request, Response } from "express";
import Ride from "./ride.model";
import User from "../user/user.model";

export const getRideHistory = async (req: Request, res: Response) => {
  try {
    const riderId = req.user!.id;
    const rides = await Ride.find({ rider: riderId })
      .sort({ requestedAt: -1 })
      .populate("driver", "-password");

    return res.status(200).json({ rides });
  } catch (error) {
    console.error("Error fetching ride history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRideById = async (req: Request, res: Response) => {
  try {
    const rideId = req.params.id;
    const riderId = req.user!.id;

    const ride = await Ride.findOne({ _id: rideId, rider: riderId }).populate(
      "driver",
      "-password"
    );

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    return res.status(200).json({ ride });
  } catch (error) {
    console.error("Error fetching ride details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getNearbyDrivers = async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.body;

    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      isNaN(lat) ||
      isNaN(lng)
    ) {
      return res
        .status(400)
        .json({ message: "Valid latitude and longitude are required" });
    }

    const nearbyDrivers = await User.find({
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
  } catch (error) {
    console.error("Error fetching nearby drivers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
