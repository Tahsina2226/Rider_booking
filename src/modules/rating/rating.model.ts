import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRating extends Document {
  ride: Types.ObjectId;
  rider: Types.ObjectId;
  driver: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

const RatingSchema = new Schema<IRating>({
  ride: { type: Schema.Types.ObjectId, ref: "Ride", required: true },
  rider: { type: Schema.Types.ObjectId, ref: "User", required: true },
  driver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IRating>("Rating", RatingSchema);
