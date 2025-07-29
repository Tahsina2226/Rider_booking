import { Request, Response } from "express";
import User, { IUser } from "../user/user.model";
import jwt from "jsonwebtoken";

const generateToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || "secret", {
    expiresIn: "7d",
  });
};

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
