import { Request, Response } from "express";
import mongoose from "mongoose";
import Ride from "../ride/ride.model";
import User from "../user/user.model";

export const getAvailableRides = async (req: Request, res: Response) => {
  try {
    const rides = await Ride.find({ status: "requested" }).sort({
      requestedAt: 1,
    });
    res.json({ rides });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const acceptRide = async (req: Request, res: Response) => {
  try {
    const driverId = req.user!.id;
    const rideId = req.params.id;

    const activeRide = await Ride.findOne({
      driver: driverId,
      status: { $in: ["accepted", "picked_up", "in_transit"] },
    });

    if (activeRide) {
      return res
        .status(400)
        .json({ message: "You already have an active ride" });
    }

    const ride = await Ride.findOneAndUpdate(
      { _id: rideId, status: "requested" },
      {
        status: "accepted",
        driver: new mongoose.Types.ObjectId(driverId),
        "timestamps.acceptedAt": new Date(),
      },
      { new: true }
    );

    if (!ride) {
      return res
        .status(400)
        .json({ message: "Ride already accepted or unavailable" });
    }

    res.json({ message: "Ride accepted", ride });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

type RideStatus = "picked_up" | "in_transit" | "completed";

export const updateRideStatus = async (req: Request, res: Response) => {
  try {
    const driverId = req.user!.id;
    const rideId = req.params.id;
    const { status }: { status: RideStatus } = req.body;

    const validStatuses: RideStatus[] = [
      "picked_up",
      "in_transit",
      "completed",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.driver?.toString() !== driverId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this ride" });
    }

    const validTransitions: Record<string, RideStatus> = {
      accepted: "picked_up",
      picked_up: "in_transit",
      in_transit: "completed",
    };

    if (validTransitions[ride.status] !== status) {
      return res.status(400).json({
        message: `Invalid status transition from "${ride.status}" to "${status}". Must follow: picked_up → in_transit → completed.`,
      });
    }

    ride.status = status;

    const statusMap = {
      picked_up: "pickedUpAt",
      in_transit: "inTransitAt",
      completed: "completedAt",
    } as const;

    ride.timestamps = ride.timestamps || {};
    const timestampField = statusMap[status];
    ride.timestamps[timestampField] = new Date();

    await ride.save();

    res.json({ message: "Ride status updated", ride });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const setAvailability = async (req: Request, res: Response) => {
  try {
    const driverId = req.user!.id;
    const { availabilityStatus } = req.body;

    const user = await User.findById(driverId);
    if (!user) return res.status(404).json({ message: "Driver not found" });

    user.availabilityStatus = availabilityStatus;
    await user.save();

    res.json({ message: "Availability status updated", availabilityStatus });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getEarnings = async (req: Request, res: Response) => {
  try {
    const driverId = req.user!.id;

    const rides = await Ride.find({
      driver: driverId,
      status: "completed",
    });

    const totalEarnings = rides.reduce(
      (sum, ride) => sum + (ride.fare || 0),
      0
    );

    res.json({ totalEarnings, rides });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
