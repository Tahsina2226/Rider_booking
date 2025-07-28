import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "rider" | "driver";
  isBlocked: boolean;
  comparePassword(inputPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "rider", "driver"],
      default: "rider",
    },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  inputPassword: string
): Promise<boolean> {
  return bcrypt.compare(inputPassword, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
