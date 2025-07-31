import { Document, Types } from "mongoose";

export type RideStatus =
  | "requested"
  | "accepted"
  | "picked_up"
  | "in_transit"
  | "completed"
  | "cancelled";

// Location
export interface ILocation {
  lat: number;
  lng: number;
  address?: string;
}

// ride lifecycle
export interface IRideTimestamps {
  acceptedAt?: Date;
  pickedUpAt?: Date;
  inTransitAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
}

export interface IRide extends Document {
  rider: Types.ObjectId;
  driver?: Types.ObjectId;
  pickupLocation: ILocation;
  destinationLocation: ILocation;
  status: RideStatus;
  requestedAt: Date;
  timestamps: IRideTimestamps;
  fare?: number;
}
