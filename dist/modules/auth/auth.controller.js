"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../user/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ id: userId, role }, process.env.JWT_SECRET || "secret", {
        expiresIn: "7d",
    });
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role, vehicleInfo } = req.body;
        if (!name || !email || !password || !role)
            return res.status(400).json({ message: "Missing required fields" });
        const userExists = yield user_model_1.default.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: "User already exists" });
        const userData = { name, email, password, role };
        if (role === "driver") {
            userData.vehicleInfo = vehicleInfo;
            userData.isApproved = false;
        }
        const user = new user_model_1.default(userData);
        yield user.save();
        const userId = user._id.toString();
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
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Email and password required" });
        const user = (yield user_model_1.default.findOne({ email }));
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        const isMatch = yield user.comparePassword(password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        if (user.role === "driver" && !user.isApproved)
            return res
                .status(403)
                .json({ message: "Driver not approved by admin yet" });
        const userId = user._id.toString();
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
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.login = login;
