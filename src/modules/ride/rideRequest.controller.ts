import { Request, Response } from "express";
import mongoose from "mongoose";
import Ride from "./ride.model";
import {
  getDistanceFromLatLonInKm,
  calculateFare,
} from "../../utils/fareCalculator";

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

    const distanceKm = getDistanceFromLatLonInKm(
      pickupLocation.lat,
      pickupLocation.lng,
      destinationLocation.lat,
      destinationLocation.lng
    );

    const fare = calculateFare(distanceKm);

    const newRide = new Ride({
      rider: riderId,
      pickupLocation,
      destinationLocation,
      status: "requested",
      timestamps: {},
      requestedAt: new Date(),
      fare,
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
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.rider.toString() !== riderId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to cancel this ride" });
    }

    if (ride.status !== "requested") {
      return res
        .status(400)
        .json({ message: "Ride cannot be cancelled after being accepted" });
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
