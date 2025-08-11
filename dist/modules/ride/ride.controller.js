"use strict";
// import { Request, Response } from "express";
// import mongoose from "mongoose";
// import Ride from "./ride.model";
// import User from "../user/user.model";
// const RATE_PER_KM = 10;
// function deg2rad(deg: number): number {
//   return deg * (Math.PI / 180);
// }
// function getDistanceFromLatLonInKm(
//   lat1: number,
//   lng1: number,
//   lat2: number,
//   lng2: number
// ): number {
//   const R = 6371;
//   const dLat = deg2rad(lat2 - lat1);
//   const dLng = deg2rad(lng2 - lng1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(lat1)) *
//       Math.cos(deg2rad(lat2)) *
//       Math.sin(dLng / 2) *
//       Math.sin(dLng / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }
// export const calculateFare = (distanceKm: number): number => {
//   return distanceKm * RATE_PER_KM;
// };
// export const calculateFareHandler = (req: Request, res: Response) => {
//   const { pickupLocation, destinationLocation } = req.body;
//   if (
//     !pickupLocation?.lat ||
//     !pickupLocation?.lng ||
//     !destinationLocation?.lat ||
//     !destinationLocation?.lng
//   ) {
//     return res.status(400).json({
//       message:
//         "Pickup and destination locations must be provided with lat and lng",
//     });
//   }
//   const distanceKm = getDistanceFromLatLonInKm(
//     pickupLocation.lat,
//     pickupLocation.lng,
//     destinationLocation.lat,
//     destinationLocation.lng
//   );
//   const fare = calculateFare(distanceKm);
//   return res.status(200).json({ distanceKm, fare });
// };
// A;
// export const requestRide = async (req: Request, res: Response) => {
//   try {
//     const riderId = req.user!.id;
//     const { pickupLocation, destinationLocation } = req.body;
//     const activeRide = await Ride.findOne({
//       rider: riderId,
//       status: { $in: ["requested", "accepted", "picked_up", "in_transit"] },
//     });
//     if (activeRide) {
//       return res
//         .status(409)
//         .json({ message: "You already have an active ride" });
//     }
//     if (
//       !pickupLocation?.lat ||
//       !pickupLocation?.lng ||
//       !destinationLocation?.lat ||
//       !destinationLocation?.lng
//     ) {
//       return res.status(400).json({
//         message:
//           "Pickup and destination locations are required and must include lat and lng",
//       });
//     }
//     const distanceKm = getDistanceFromLatLonInKm(
//       pickupLocation.lat,
//       pickupLocation.lng,
//       destinationLocation.lat,
//       destinationLocation.lng
//     );
//     const fare = calculateFare(distanceKm);
//     const newRide = new Ride({
//       rider: riderId,
//       pickupLocation,
//       destinationLocation,
//       status: "requested",
//       timestamps: {},
//       requestedAt: new Date(),
//       fare,
//     });
//     await newRide.save();
//     return res
//       .status(201)
//       .json({ message: "Ride requested successfully", ride: newRide });
//   } catch (error) {
//     console.error("Error requesting ride:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// export const cancelRide = async (req: Request, res: Response) => {
//   try {
//     const riderId = req.user!.id;
//     const rideId = req.params.id;
//     const ride = await Ride.findById(rideId);
//     if (!ride) return res.status(404).json({ message: "Ride not found" });
//     if (ride.rider.toString() !== riderId) {
//       return res
//         .status(403)
//         .json({ message: "You are not authorized to cancel this ride" });
//     }
//     if (ride.status !== "requested") {
//       return res
//         .status(400)
//         .json({ message: "Ride cannot be cancelled after being accepted" });
//     }
//     ride.status = "cancelled";
//     if (!ride.timestamps) ride.timestamps = {};
//     ride.timestamps.cancelledAt = new Date();
//     await ride.save();
//     return res.status(200).json({ message: "Ride cancelled successfully" });
//   } catch (error) {
//     console.error("Error cancelling ride:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// export const getRideHistory = async (req: Request, res: Response) => {
//   try {
//     const riderId = req.user!.id;
//     const rides = await Ride.find({ rider: riderId }).sort({ requestedAt: -1 });
//     return res.status(200).json({ rides });
//   } catch (error) {
//     console.error("Error fetching ride history:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// export const setAvailability = async (req: Request, res: Response) => {
//   try {
//     const driverId = req.user!.id;
//     const { availabilityStatus } = req.body;
//     const user = await User.findById(driverId);
//     if (!user) return res.status(404).json({ message: "Driver not found" });
//     user.availabilityStatus = availabilityStatus;
//     await user.save();
//     res.json({ message: "Availability status updated", availabilityStatus });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
// export const getAvailableRides = async (req: Request, res: Response) => {
//   try {
//     const rides = await Ride.find({ status: "requested" }).sort({
//       requestedAt: 1,
//     });
//     res.json({ rides });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
// export const acceptRide = async (req: Request, res: Response) => {
//   try {
//     const driverId = req.user!.id;
//     const rideId = req.params.id;
//     const ride = await Ride.findById(rideId);
//     if (!ride) return res.status(404).json({ message: "Ride not found" });
//     if (ride.status !== "requested") {
//       return res
//         .status(400)
//         .json({ message: "Ride already accepted or unavailable" });
//     }
//     const activeRide = await Ride.findOne({
//       driver: driverId,
//       status: { $in: ["accepted", "picked_up", "in_transit"] },
//     });
//     if (activeRide) {
//       return res
//         .status(400)
//         .json({ message: "You already have an active ride" });
//     }
//     ride.status = "accepted";
//     ride.driver = new mongoose.Types.ObjectId(driverId);
//     ride.timestamps.acceptedAt = new Date();
//     await ride.save();
//     res.json({ message: "Ride accepted", ride });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
// type RideStatus =
//   | "requested"
//   | "accepted"
//   | "picked_up"
//   | "in_transit"
//   | "completed"
//   | "cancelled";
// const statusOrder: RideStatus[] = [
//   "requested",
//   "accepted",
//   "picked_up",
//   "in_transit",
//   "completed",
//   "cancelled",
// ];
// function isValidStatusTransition(
//   currentStatus: RideStatus,
//   newStatus: RideStatus
// ): boolean {
//   const currentIndex = statusOrder.indexOf(currentStatus);
//   const newIndex = statusOrder.indexOf(newStatus);
//   if (newStatus === "cancelled") {
//     return currentStatus === "requested" || currentStatus === "accepted";
//   }
//   return newIndex === currentIndex + 1;
// }
// export const updateRideStatus = async (req: Request, res: Response) => {
//   try {
//     const driverId = req.user!.id;
//     const rideId = req.params.id;
//     const { status }: { status: RideStatus } = req.body;
//     if (!statusOrder.includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }
//     const ride = await Ride.findById(rideId);
//     if (!ride) return res.status(404).json({ message: "Ride not found" });
//     if (ride.driver?.toString() !== driverId) {
//       return res
//         .status(403)
//         .json({ message: "Unauthorized to update this ride" });
//     }
//     if (!isValidStatusTransition(ride.status as RideStatus, status)) {
//       return res.status(400).json({ message: "Invalid status transition" });
//     }
//     ride.status = status;
//     if (!ride.timestamps) ride.timestamps = {};
//     const now = new Date();
//     switch (status) {
//       case "accepted":
//         ride.timestamps.acceptedAt = now;
//         break;
//       case "picked_up":
//         ride.timestamps.pickedUpAt = now;
//         break;
//       case "in_transit":
//         ride.timestamps.inTransitAt = now;
//         break;
//       case "completed":
//         ride.timestamps.completedAt = now;
//         break;
//       case "cancelled":
//         ride.timestamps.cancelledAt = now;
//         break;
//     }
//     await ride.save();
//     return res.json({ message: "Ride status updated", ride });
//   } catch (error) {
//     console.error("Error updating ride status:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// export const getEarnings = async (req: Request, res: Response) => {
//   try {
//     const driverId = req.user!.id;
//     const rides = await Ride.find({
//       driver: driverId,
//       status: "completed",
//     });
//     const totalEarnings = rides.reduce(
//       (sum, ride) => sum + (ride.fare || 0),
//       0
//     );
//     res.json({ totalEarnings, rides });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
// export const getNearbyDrivers = async (req: Request, res: Response) => {
//   try {
//     const { lat, lng } = req.body;
//     if (
//       typeof lat !== "number" ||
//       typeof lng !== "number" ||
//       isNaN(lat) ||
//       isNaN(lng)
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Valid latitude and longitude are required" });
//     }
//     const nearbyDrivers = await User.find({
//       role: "driver",
//       availabilityStatus: true,
//       location: {
//         $near: {
//           $geometry: { type: "Point", coordinates: [lng, lat] },
//           $maxDistance: 5000,
//         },
//       },
//     }).select("-password");
//     return res.status(200).json({ drivers: nearbyDrivers });
//   } catch (error) {
//     console.error("Error fetching nearby drivers:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
