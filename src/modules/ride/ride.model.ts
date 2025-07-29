import mongoose, { Schema, Document, Types } from "mongoose";
import { IRide } from "./ride.interface";

const LocationSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String },
  },
  { _id: false }
);

const RideSchema = new Schema<IRide>(
  {
    rider: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: Schema.Types.ObjectId, ref: "User" },

    pickupLocation: { type: LocationSchema, required: true },
    destinationLocation: { type: LocationSchema, required: true },

    status: {
      type: String,
      enum: [
        "requested",
        "accepted",
        "picked_up",
        "in_transit",
        "completed",
        "cancelled",
      ],
      default: "requested",
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    timestamps: {
      acceptedAt: { type: Date },
      pickedUpAt: { type: Date },
      inTransitAt: { type: Date },
      completedAt: { type: Date },
      cancelledAt: { type: Date },
    },

    fare: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Ride = mongoose.model<IRide>("Ride", RideSchema);
export default Ride;
