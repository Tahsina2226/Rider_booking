import { Request, Response } from "express";
import {
  getDistanceFromLatLonInKm,
  calculateFare,
} from "../../utils/fareCalculator";

export const calculateFareHandler = (req: Request, res: Response) => {
  const { pickupLocation, destinationLocation } = req.body;

  if (
    !pickupLocation?.lat ||
    !pickupLocation?.lng ||
    !destinationLocation?.lat ||
    !destinationLocation?.lng
  ) {
    return res.status(400).json({
      message:
        "Pickup and destination locations must be provided with lat and lng",
    });
  }

  const distanceKm = getDistanceFromLatLonInKm(
    pickupLocation.lat,
    pickupLocation.lng,
    destinationLocation.lat,
    destinationLocation.lng
  );

  const fare = calculateFare(distanceKm);

  return res.status(200).json({ distanceKm, fare });
};
