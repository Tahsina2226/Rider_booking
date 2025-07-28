import { Request, Response } from "express";
import { User, IUser } from "../user/user.model";
import { signToken } from "../../utils/jwt";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const user = new User({ name, email, password, role });
  await user.save();

  res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Explicitly cast to IUser so TS recognizes comparePassword method
  const user = (await User.findOne({ email })) as IUser | null;
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  if (user.isBlocked)
    return res.status(403).json({ message: "User is blocked by admin" });

  const token = signToken({ id: user._id, role: user.role });

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
