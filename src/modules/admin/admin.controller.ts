import { Request, Response } from "express";
import User from "../user/user.model";
import Ride from "../ride/ride.model";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const approveDriver = async (req: Request, res: Response) => {
  try {
    const driverId = req.params.id;
    const { approve } = req.body;

    const driver = await User.findById(driverId);
    if (!driver || driver.role !== "driver")
      return res.status(404).json({ message: "Driver not found" });

    driver.isApproved = approve;
    await driver.save();

    res.json({ message: `Driver ${approve ? "approved" : "suspended"}` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { block } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    (user as any).blocked = block;
    await user.save();

    res.json({ message: `User ${block ? "blocked" : "unblocked"}` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllRides = async (req: Request, res: Response) => {
  try {
    const rides = await Ride.find()
      .populate("rider", "name email")
      .populate("driver", "name email")
      .sort({ requestedAt: -1 });
    res.json({ rides });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const totalRides = await Ride.countDocuments();
    const completedRides = await Ride.countDocuments({ status: "completed" });
    const activeDrivers = await User.countDocuments({
      role: "driver",
      availabilityStatus: true,
    });
    const totalEarningsData = await Ride.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, totalFare: { $sum: "$fare" } } },
    ]);
    const totalEarnings = totalEarningsData[0]?.totalFare || 0;

    res.json({
      totalRides,
      completedRides,
      activeDrivers,
      totalEarnings,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
