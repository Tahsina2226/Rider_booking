import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "rider" | "driver";
  isApproved?: boolean;
  availabilityStatus?: boolean;
  vehicleInfo?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
