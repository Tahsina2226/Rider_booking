"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const ride_routes_1 = __importDefault(require("./modules/ride/ride.routes"));
const driver_routes_1 = __importDefault(require("./modules/driver/driver.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const rating_routes_1 = __importDefault(require("./modules/rating/rating.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, database_1.default)();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Ride Booking API is running...");
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/rides", ride_routes_1.default);
app.use("/api/driver", driver_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/ratings", rating_routes_1.default);
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
app.use(error_middleware_1.errorHandler);
exports.default = app;
