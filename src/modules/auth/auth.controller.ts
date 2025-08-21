import { Request, Response } from "express";
import User, { IUser } from "../user/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || "secret", {
    expiresIn: "7d",
  });
};

// Register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, vehicleInfo } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "Missing required fields" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const userData: Partial<IUser> = { name, email, password, role };
    if (role === "driver") {
      userData.vehicleInfo = vehicleInfo;
      userData.isApproved = false;
    }

    const user = new User(userData);
    await user.save();

    const userId = (user._id as any).toString();
    const token = generateToken(userId, user.role);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = (await User.findOne({ email })) as IUser | null;
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user.role === "driver" && !user.isApproved)
      return res
        .status(403)
        .json({ message: "Driver not approved by admin yet" });

    const userId = (user._id as any).toString();
    const token = generateToken(userId, user.role);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Profile
export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { name, phone } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
};

// Change Password
export const changePassword = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Password change failed" });
  }
};
