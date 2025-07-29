import { Request, Response } from "express";
import mongoose from "mongoose";
import Ride from "./ride.model";

const statusOrder = [
  "requested",
  "accepted",
  "picked_up",
  "in_transit",
  "completed",
  "cancelled",
];

export const requestRide = async (req: Request, res: Response) => {
  try {
    const riderId = req.user!.id;
    const { pickupLocation, destinationLocation } = req.body;

    const activeRide = await Ride.findOne({
      rider: riderId,
      status: { $in: ["requested", "accepted", "picked_up", "in_transit"] },
    });

    if (activeRide) {
      return res
        .status(409)
        .json({ message: "You already have an active ride" });
    }

    if (
      !pickupLocation?.lat ||
      !pickupLocation?.lng ||
      !destinationLocation?.lat ||
      !destinationLocation?.lng
    ) {
      return res.status(400).json({
        message:
          "Pickup and destination locations are required and must include lat and lng",
      });
    }

    const newRide = new Ride({
      rider: riderId,
      pickupLocation,
      destinationLocation,
      status: "requested",
      timestamps: {},
      requestedAt: new Date(),
    });

    await newRide.save();

    return res
      .status(201)
      .json({ message: "Ride requested successfully", ride: newRide });
  } catch (error) {
    console.error("Error requesting ride:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelRide = async (req: Request, res: Response) => {
  try {
    const riderId = req.user!.id;
    const rideId = req.params.id;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

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
    if (!ride.timestamps) ride.timestamps = {};
    ride.timestamps.cancelledAt = new Date();

    await ride.save();

    return res.status(200).json({ message: "Ride cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling ride:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRideHistory = async (req: Request, res: Response) => {
  try {
    const riderId = req.user!.id;
    const rides = await Ride.find({ rider: riderId }).sort({ requestedAt: -1 });

    return res.status(200).json({ rides });
  } catch (error) {
    console.error("Error fetching ride history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRideStatus = async (req: Request, res: Response) => {
  try {
    const driverId = req.user!.id;
    const { rideId, status } = req.body;

    if (!statusOrder.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (status !== "cancelled") {
      const currentIndex = statusOrder.indexOf(ride.status);
      const newIndex = statusOrder.indexOf(status);

      if (newIndex !== currentIndex + 1) {
        return res.status(400).json({ message: "Invalid status transition" });
      }
    } else {
      if (!["requested", "accepted"].includes(ride.status)) {
        return res
          .status(400)
          .json({ message: "Ride cannot be cancelled at this stage" });
      }
    }

    ride.status = status;

    if (!ride.timestamps) ride.timestamps = {};
    const now = new Date();

    switch (status) {
      case "accepted":
        ride.timestamps.acceptedAt = now;
        ride.driver = new mongoose.Types.ObjectId(driverId);
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

    await ride.save();

    return res.json({ message: "Ride status updated", ride });
  } catch (error) {
    console.error("Error updating ride status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
