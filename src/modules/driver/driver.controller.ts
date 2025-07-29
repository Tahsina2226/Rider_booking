import { Request, Response } from "express";
import mongoose from "mongoose";
import Ride from "../ride/ride.model";
import User from "../user/user.model";

type RideStatus = "picked_up" | "in_transit" | "completed";

// Driver er availability on/off update korar jonno
export const setAvailability = async (req: Request, res: Response) => {
  try {
    const driverId = req.user!.id;
    const { availabilityStatus } = req.body;

    const user = await User.findById(driverId);
    if (!user) return res.status(404).json({ message: "Driver not found" });

    user.availabilityStatus = availabilityStatus;
    await user.save();

    res.json({ message: "Availability status updated", availabilityStatus });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Driver der jonno pending rides dekhano
export const getAvailableRides = async (req: Request, res: Response) => {
  try {
    const rides = await Ride.find({ status: "requested" }).sort({
      requestedAt: 1,
    });
    res.json({ rides });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Ride accept korar
export const acceptRide = async (req: Request, res: Response) => {
  try {
    const driverId = req.user!.id;
    const rideId = req.params.id;

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.status !== "requested") {
      return res
        .status(400)
        .json({ message: "Ride already accepted or unavailable" });
    }

    const activeRide = await Ride.findOne({
      driver: driverId,
      status: { $in: ["accepted", "picked_up", "in_transit"] },
    });

    if (activeRide) {
      return res
        .status(400)
        .json({ message: "You already have an active ride" });
    }

    ride.status = "accepted";
    ride.driver = new mongoose.Types.ObjectId(driverId);
    ride.timestamps.acceptedAt = new Date();

    await ride.save();

    res.json({ message: "Ride accepted", ride });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Ride status update kora
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

    const statusOrder = [
      "requested",
      "accepted",
      "picked_up",
      "in_transit",
      "completed",
    ];
    if (statusOrder.indexOf(status) <= statusOrder.indexOf(ride.status)) {
      return res.status(400).json({ message: "Invalid status transition" });
    }

    ride.status = status;

    const statusMap = {
      picked_up: "pickedUpAt",
      in_transit: "inTransitAt",
      completed: "completedAt",
    } as const;

    const timestampField = statusMap[status];
    ride.timestamps[timestampField] = new Date();

    await ride.save();

    res.json({ message: "Ride status updated", ride });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Driver  earning ber kora
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
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
